import type { SQLiteDatabase } from "expo-sqlite";
import type {
  CountAdjustmentLine,
  CountDetail,
  CountListItem,
  CountSaleLine,
  Product,
} from "../types";
import { createId } from "../utils/ids";
import { effectiveMargin, roundMoney } from "../utils/money";
import { roundQuantity } from "../utils/quantity";
import { mapProductRow, type ProductRow } from "./products.repository";

export type { CountDetail, CountListItem } from "../types";

export interface CountDraftEntry {
  productId: string;
  counted: number | null;
}

export interface CountRegistrationInput {
  entries: CountDraftEntry[];
}

export interface CountRow {
  id: string;
  total_sale: number;
  units_sold: number;
  units_added: number;
  sale_lines: number;
  adjustment_lines: number;
  created_at: number;
}

export interface CountPreviewEntry {
  product: Product;
  counted: number;
  stockBefore: number;
  delta: number;
  kind: "sale" | "adjustment" | "none";
  quantity: number;
  unitPrice: number;
  total: number;
  costPrice: number | null;
  marginPercent: number | null;
  salePriceMissing: boolean;
}

export interface CountPreview {
  entries: CountPreviewEntry[];
  totalSale: number;
  unitsSold: number;
  unitsAdded: number;
  saleLines: number;
  adjustmentLines: number;
  missingSalePriceCount: number;
}

function mapCountRow(row: CountRow): CountListItem {
  return {
    id: row.id,
    totalSale: row.total_sale,
    unitsSold: row.units_sold,
    unitsAdded: row.units_added,
    saleLines: row.sale_lines,
    adjustmentLines: row.adjustment_lines,
    createdAt: row.created_at,
    itemCount: row.sale_lines + row.adjustment_lines,
  };
}

export async function listCounts(
  db: SQLiteDatabase,
  limit = 30,
): Promise<CountListItem[]> {
  const rows = await db.getAllAsync<CountRow>(
    `SELECT * FROM counts ORDER BY created_at DESC LIMIT ?`,
    [limit],
  );

  return rows.map(mapCountRow);
}

export async function getLastCount(
  db: SQLiteDatabase,
): Promise<CountListItem | null> {
  const row = await db.getFirstAsync<CountRow>(
    `SELECT * FROM counts ORDER BY created_at DESC LIMIT 1`,
  );

  return row ? mapCountRow(row) : null;
}

export async function getCountDetail(
  db: SQLiteDatabase,
  id: string,
): Promise<CountDetail | null> {
  const countRow = await db.getFirstAsync<CountRow>(
    `SELECT * FROM counts WHERE id = ?`,
    id,
  );

  if (!countRow) return null;

  const sales = await db.getAllAsync<CountSaleLine>(
    `SELECT
       s.id,
       s.product_id AS productId,
       s.quantity,
       s.unit_price AS unitPrice,
       s.cost_price AS costPrice,
       s.margin_percent AS marginPercent,
       s.total,
       s.stock_before AS stockBefore,
       s.stock_after AS stockAfter,
       pr.name AS productName,
       pr.unit AS productUnit,
       s.created_at AS createdAt
     FROM sales s
     JOIN products pr ON pr.id = s.product_id
     WHERE s.count_id = ?
     ORDER BY s.created_at ASC`,
    [id],
  );

  const adjustments = await db.getAllAsync<CountAdjustmentLine>(
    `SELECT
       a.id,
       a.product_id AS productId,
       a.quantity_delta AS quantityDelta,
       a.stock_before AS stockBefore,
       a.stock_after AS stockAfter,
       a.unit_cost AS unitCost,
       a.reason,
       a.created_at AS createdAt,
       pr.name AS productName,
       pr.unit AS productUnit
     FROM adjustments a
     JOIN products pr ON pr.id = a.product_id
     WHERE a.count_id = ?
     ORDER BY a.created_at ASC`,
    [id],
  );

  return {
    ...mapCountRow(countRow),
    productName: "Conteo semanal",
    productUnit: null,
    sales,
    adjustments,
  };
}

export function buildCountPreview(
  product: Product,
  counted: number | null,
): CountPreviewEntry | null {
  const safeCounted = counted == null ? null : roundQuantity(counted);
  const stockBefore = roundQuantity(product.stock);

  if (safeCounted == null) {
    return null;
  }

  if (safeCounted < 0) {
    throw new Error("El stock contado no puede ser negativo.");
  }

  const delta = roundQuantity(safeCounted - stockBefore);

  if (delta === 0) {
    return {
      product,
      counted: safeCounted,
      stockBefore,
      delta: 0,
      kind: "none",
      quantity: 0,
      unitPrice: 0,
      total: 0,
      costPrice: product.currentPrice,
      marginPercent: null,
      salePriceMissing: false,
    };
  }

  if (delta < 0) {
    const quantity = Math.abs(delta);
    const unitPrice = product.salePrice ?? 0;
    const total = roundMoney(quantity * unitPrice);
    const costPrice = product.currentPrice;
    const marginPercent =
      unitPrice > 0 && costPrice != null && costPrice > 0
        ? Number(
            ((effectiveMargin(costPrice, unitPrice) * 100) / 100).toFixed(2),
          )
        : null;

    return {
      product,
      counted: safeCounted,
      stockBefore,
      delta,
      kind: "sale",
      quantity,
      unitPrice,
      total,
      costPrice,
      marginPercent,
      salePriceMissing: product.salePrice == null || product.salePrice <= 0,
    };
  }

  return {
    product,
    counted: safeCounted,
    stockBefore,
    delta,
    kind: "adjustment",
    quantity: delta,
    unitPrice: product.currentPrice ?? 0,
    total: 0,
    costPrice: product.currentPrice,
    marginPercent: null,
    salePriceMissing: false,
  };
}

export async function previewCount(
  db: SQLiteDatabase,
  entries: CountDraftEntry[],
): Promise<CountPreview> {
  const previews: CountPreviewEntry[] = [];

  for (const entry of entries) {
    const productRow = await db.getFirstAsync<ProductRow>(
      "SELECT * FROM products WHERE id = ? AND archived_at IS NULL",
      entry.productId,
    );

    if (!productRow) continue;

    const product = mapProductRow(productRow);
    const preview = buildCountPreview(product, entry.counted);
    if (preview) previews.push(preview);
  }

  const totalSale = previews
    .filter((item) => item.kind === "sale")
    .reduce((sum, item) => sum + item.total, 0);
  const unitsSold = previews
    .filter((item) => item.kind === "sale")
    .reduce((sum, item) => sum + item.quantity, 0);
  const unitsAdded = previews
    .filter((item) => item.kind === "adjustment")
    .reduce((sum, item) => sum + item.quantity, 0);

  return {
    entries: previews,
    totalSale,
    unitsSold,
    unitsAdded,
    saleLines: previews.filter((item) => item.kind === "sale").length,
    adjustmentLines: previews.filter((item) => item.kind === "adjustment")
      .length,
    missingSalePriceCount: previews.filter((item) => item.salePriceMissing)
      .length,
  };
}

export async function registerCount(
  db: SQLiteDatabase,
  input: CountRegistrationInput,
): Promise<CountListItem> {
  const entries = input.entries.filter((entry) => entry.counted != null);

  if (entries.length === 0) {
    throw new Error("No hay diferencias para registrar.");
  }

  let created: CountListItem | null = null;

  await db.withExclusiveTransactionAsync(async (txn) => {
    const previews: CountPreviewEntry[] = [];

    for (const entry of entries) {
      const productRow = await txn.getFirstAsync<ProductRow>(
        "SELECT * FROM products WHERE id = ? AND archived_at IS NULL",
        entry.productId,
      );

      if (!productRow) {
        throw new Error("Hay un producto inválido o archivado en el conteo.");
      }

      const product = mapProductRow(productRow);
      const preview = buildCountPreview(product, entry.counted);

      if (!preview) continue;
      if (preview.delta === 0) continue;

      previews.push(preview);
    }

    if (previews.length === 0) {
      throw new Error("No hay diferencias para registrar.");
    }

    const now = Date.now();
    const countId = createId("cnt");
    const totalSale = previews
      .filter((item) => item.kind === "sale")
      .reduce((sum, item) => sum + item.total, 0);
    const unitsSold = previews
      .filter((item) => item.kind === "sale")
      .reduce((sum, item) => sum + item.quantity, 0);
    const unitsAdded = previews
      .filter((item) => item.kind === "adjustment")
      .reduce((sum, item) => sum + item.quantity, 0);

    await txn.runAsync(
      `INSERT INTO counts (
        id, total_sale, units_sold, units_added, sale_lines, adjustment_lines, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        countId,
        totalSale,
        unitsSold,
        unitsAdded,
        previews.filter((item) => item.kind === "sale").length,
        previews.filter((item) => item.kind === "adjustment").length,
        now,
      ],
    );

    for (const preview of previews) {
      const product = preview.product;
      const stockBefore = preview.stockBefore;
      const stockAfter = preview.counted;

      if (preview.kind === "sale") {
        const saleId = createId("sal");
        await txn.runAsync(
          `INSERT INTO sales (
            id, product_id, quantity, unit_price, cost_price, margin_percent,
            total, count_id, stock_before, stock_after, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            saleId,
            product.id,
            preview.quantity,
            preview.unitPrice,
            preview.costPrice,
            preview.marginPercent,
            preview.total,
            countId,
            stockBefore,
            stockAfter,
            now,
          ],
        );
      }

      if (preview.kind === "adjustment") {
        const adjustmentId = createId("adj");
        await txn.runAsync(
          `INSERT INTO adjustments (
            id, product_id, quantity_delta, stock_before, stock_after,
            unit_cost, reason, count_id, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            adjustmentId,
            product.id,
            preview.quantity,
            stockBefore,
            stockAfter,
            preview.costPrice,
            "Sobrante de conteo",
            countId,
            now,
          ],
        );
      }

      await txn.runAsync(
        `UPDATE products SET stock = ?, updated_at = ? WHERE id = ?`,
        [preview.counted, now, product.id],
      );
    }

    created = {
      id: countId,
      totalSale,
      unitsSold,
      unitsAdded,
      saleLines: previews.filter((item) => item.kind === "sale").length,
      adjustmentLines: previews.filter((item) => item.kind === "adjustment")
        .length,
      createdAt: now,
      itemCount: previews.length,
    };
  });

  if (!created) throw new Error("No se pudo registrar el conteo.");

  return created;
}
