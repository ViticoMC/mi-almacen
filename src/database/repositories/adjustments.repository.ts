import type { SQLiteDatabase } from "expo-sqlite";
import type { Adjustment, Product } from "../types";
import { createId } from "../utils/ids";
import { roundQuantity } from "../utils/quantity";
import {
  mapProductRow,
  type ProductRow,
} from "./products.repository";

export type AdjustmentMode = "direct" | "count";
export type AdjustmentDirection = "in" | "out";

export interface AdjustmentDraft {
  mode: AdjustmentMode;
  direction: AdjustmentDirection;
  quantity: number | null;
  countedStock: number | null;
}

export interface AdjustmentInput extends AdjustmentDraft {
  productId: string;
  reason?: string | null;
}

export interface AdjustmentPreview {
  product: Product;
  stockBefore: number;
  stockAfter: number;
  quantityDelta: number;
  unitCost: number | null;
  valid: boolean;
  issue: string | null;
}

export interface AdjustmentListItem extends Adjustment {
  productName: string;
  productUnit: string;
}

interface AdjustmentRow {
  id: string;
  product_id: string;
  quantity_delta: number;
  stock_before: number;
  stock_after: number;
  unit_cost: number | null;
  reason: string | null;
  created_at: number;
  product_name: string;
  product_unit: string;
}

function mapAdjustment(row: AdjustmentRow): AdjustmentListItem {
  return {
    id: row.id,
    productId: row.product_id,
    quantityDelta: row.quantity_delta,
    stockBefore: row.stock_before,
    stockAfter: row.stock_after,
    unitCost: row.unit_cost,
    reason: row.reason,
    createdAt: row.created_at,
    productName: row.product_name,
    productUnit: row.product_unit,
  };
}

export function buildAdjustmentPreview(
  product: Product,
  draft: AdjustmentDraft,
): AdjustmentPreview {
  const stockBefore = roundQuantity(product.stock);
  const unitCost = product.currentPrice;
  const quantity = draft.quantity != null ? roundQuantity(draft.quantity) : null;
  const counted =
    draft.countedStock != null ? roundQuantity(draft.countedStock) : null;

  let quantityDelta = 0;
  let issue: string | null = null;

  if (draft.mode === "direct") {
    if (quantity == null || quantity <= 0) {
      issue = "Ingresa una cantidad mayor a cero.";
    } else {
      quantityDelta =
        draft.direction === "in" ? quantity : roundQuantity(-quantity);
      if (draft.direction === "out" && quantity > stockBefore) {
        issue = "No puedes quitar más de lo que hay en stock.";
      }
    }
  } else {
    if (counted == null) {
      issue = "Ingresa el stock contado.";
    } else if (counted < 0) {
      issue = "El stock contado no puede ser negativo.";
    } else {
      quantityDelta = roundQuantity(counted - stockBefore);
    }
  }

  const stockAfter = roundQuantity(stockBefore + quantityDelta);

  if (!issue && stockAfter < 0) {
    issue = "El stock después del ajuste no puede ser negativo.";
  }
  if (!issue && quantityDelta === 0) {
    issue = "El ajuste no cambia el stock.";
  }

  return {
    product,
    stockBefore,
    stockAfter,
    quantityDelta,
    unitCost,
    valid: issue == null,
    issue,
  };
}

export async function listAdjustments(
  db: SQLiteDatabase,
  limit = 50,
): Promise<AdjustmentListItem[]> {
  const rows = await db.getAllAsync<AdjustmentRow>(
    `SELECT
       a.*,
       pr.name AS product_name,
       pr.unit AS product_unit
     FROM adjustments a
     JOIN products pr ON pr.id = a.product_id
     ORDER BY a.created_at DESC
     LIMIT ?`,
    [limit],
  );

  return rows.map(mapAdjustment);
}

export async function registerAdjustment(
  db: SQLiteDatabase,
  input: AdjustmentInput,
): Promise<Adjustment> {
  let created: Adjustment | null = null;

  await db.withExclusiveTransactionAsync(async (txn) => {
    const productRow = await txn.getFirstAsync<ProductRow>(
      "SELECT * FROM products WHERE id = ? AND archived_at IS NULL",
      input.productId,
    );

    if (!productRow) {
      throw new Error("Producto no encontrado o archivado.");
    }

    const product = mapProductRow(productRow);
    const preview = buildAdjustmentPreview(product, input);

    if (!preview.valid) {
      throw new Error(preview.issue ?? "El ajuste no es válido.");
    }

    const reason = input.reason?.trim() || null;
    const id = createId("adj");
    const now = Date.now();

    await txn.runAsync(
      `INSERT INTO adjustments (
        id, product_id, quantity_delta, stock_before, stock_after,
        unit_cost, reason, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        product.id,
        preview.quantityDelta,
        preview.stockBefore,
        preview.stockAfter,
        preview.unitCost,
        reason,
        now,
      ],
    );

    await txn.runAsync(
      `UPDATE products
       SET stock = ?, updated_at = ?
       WHERE id = ?`,
      [preview.stockAfter, now, product.id],
    );

    created = {
      id,
      productId: product.id,
      quantityDelta: preview.quantityDelta,
      stockBefore: preview.stockBefore,
      stockAfter: preview.stockAfter,
      unitCost: preview.unitCost,
      reason,
      createdAt: now,
    };
  });

  if (!created) {
    throw new Error("No se pudo registrar el ajuste.");
  }

  return created;
}
