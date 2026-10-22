import type { SQLiteDatabase } from "expo-sqlite";
import type { Product, Purchase } from "../types";
import { createId } from "../utils/ids";
import {
  calculateSalePrice,
  effectiveMargin,
  roundMoney,
} from "../utils/money";
import { roundQuantity } from "../utils/quantity";
import {
  mapProductRow,
  type ProductRow,
} from "./products.repository";

export type SalePriceStrategy = "margin" | "keep";

export interface PurchaseInput {
  productId: string;
  quantity: number;
  total: number;
  salePriceStrategy: SalePriceStrategy;
}

export interface PurchasePreview {
  product: Product;
  quantity: number;
  total: number;
  unitCost: number;
  previousCost: number | null;
  newCost: number;
  previousSalePrice: number | null;
  marginPercent: number;
  marginSalePrice: number | null;
  marginEffectiveMargin: number | null;
  keptEffectiveMargin: number | null;
  canKeepPrice: boolean;
}

export interface PurchaseListItem extends Purchase {
  productName: string;
  productUnit: string;
}

interface PurchaseRow {
  id: string;
  product_id: string;
  quantity: number;
  total: number;
  unit_cost: number;
  previous_cost: number | null;
  new_cost: number;
  previous_sale_price: number | null;
  new_sale_price: number | null;
  created_at: number;
  product_name: string;
  product_unit: string;
}

function mapPurchase(row: PurchaseRow): PurchaseListItem {
  return {
    id: row.id,
    productId: row.product_id,
    quantity: row.quantity,
    total: row.total,
    unitCost: row.unit_cost,
    previousCost: row.previous_cost,
    newCost: row.new_cost,
    previousSalePrice: row.previous_sale_price,
    newSalePrice: row.new_sale_price,
    createdAt: row.created_at,
    productName: row.product_name,
    productUnit: row.product_unit,
  };
}

export function buildPurchasePreview(
  product: Product,
  quantity: number,
  total: number,
): PurchasePreview {
  const safeQuantity = roundQuantity(quantity);
  const safeTotal = roundMoney(total);
  const unitCost =
    safeQuantity > 0 && safeTotal > 0 ? roundMoney(safeTotal / safeQuantity) : 0;
  const marginSalePrice =
    unitCost > 0 && product.marginPercent > 0
      ? calculateSalePrice(unitCost, product.marginPercent)
      : null;
  const keptEffectiveMargin =
    unitCost > 0 && product.salePrice != null && product.salePrice >= 0
      ? effectiveMargin(unitCost, product.salePrice)
      : null;

  return {
    product,
    quantity: safeQuantity,
    total: safeTotal,
    unitCost,
    previousCost: product.currentPrice,
    newCost: unitCost,
    previousSalePrice: product.salePrice,
    marginPercent: product.marginPercent,
    marginSalePrice,
    marginEffectiveMargin:
      marginSalePrice != null
        ? effectiveMargin(unitCost, marginSalePrice)
        : null,
    keptEffectiveMargin,
    canKeepPrice:
      keptEffectiveMargin != null && keptEffectiveMargin < 30,
  };
}

export async function listPurchases(
  db: SQLiteDatabase,
  limit = 50,
): Promise<PurchaseListItem[]> {
  const rows = await db.getAllAsync<PurchaseRow>(
    `SELECT
       pu.*,
       pr.name AS product_name,
       pr.unit AS product_unit
     FROM purchases pu
     JOIN products pr ON pr.id = pu.product_id
     ORDER BY pu.created_at DESC
     LIMIT ?`,
    [limit],
  );

  return rows.map(mapPurchase);
}

export async function registerPurchase(
  db: SQLiteDatabase,
  input: PurchaseInput,
): Promise<Purchase> {
  const quantity = roundQuantity(input.quantity);
  const total = roundMoney(input.total);

  if (quantity <= 0) {
    throw new Error("La cantidad debe ser mayor a cero.");
  }
  if (total <= 0) {
    throw new Error("El total pagado debe ser mayor a cero.");
  }

  let created: Purchase | null = null;

  await db.withExclusiveTransactionAsync(async (txn) => {
    const productRow = await txn.getFirstAsync<ProductRow>(
      "SELECT * FROM products WHERE id = ? AND archived_at IS NULL",
      input.productId,
    );

    if (!productRow) {
      throw new Error("Producto no encontrado o archivado.");
    }

    const product = mapProductRow(productRow);
    const unitCost = roundMoney(total / quantity);

    if (unitCost <= 0) {
      throw new Error("El costo unitario debe ser mayor a cero.");
    }

    let newSalePrice: number | null;
    if (input.salePriceStrategy === "keep") {
      if (product.salePrice == null) {
        throw new Error("El producto no tiene un precio de salida para mantener.");
      }
      if (effectiveMargin(unitCost, product.salePrice) >= 30) {
        throw new Error(
          "Mantener el precio actual supera el margen máximo del 30%. Recalcula el precio.",
        );
      }
      newSalePrice = product.salePrice;
    } else {
      newSalePrice =
        product.marginPercent > 0
          ? calculateSalePrice(unitCost, product.marginPercent)
          : null;
    }
    const newStock = roundQuantity(product.stock + quantity);
    const id = createId("pur");
    const now = Date.now();

    await txn.runAsync(
      `INSERT INTO purchases (
        id, product_id, quantity, total, unit_cost, previous_cost,
        new_cost, previous_sale_price, new_sale_price, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        product.id,
        quantity,
        total,
        unitCost,
        product.currentPrice,
        unitCost,
        product.salePrice,
        newSalePrice,
        now,
      ],
    );

    await txn.runAsync(
      `UPDATE products
       SET last_price = current_price,
           current_price = ?,
           sale_price = ?,
           stock = ?,
           updated_at = ?
       WHERE id = ?`,
      [unitCost, newSalePrice, newStock, now, product.id],
    );

    created = {
      id,
      productId: product.id,
      quantity,
      total,
      unitCost,
      previousCost: product.currentPrice,
      newCost: unitCost,
      previousSalePrice: product.salePrice,
      newSalePrice,
      createdAt: now,
    };
  });

  if (!created) {
    throw new Error("No se pudo registrar la compra.");
  }

  return created;
}
