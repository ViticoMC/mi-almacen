import type { SQLiteDatabase } from "expo-sqlite";
import type { Product, Sale } from "../types";
import { createId } from "../utils/ids";
import { effectiveMargin, roundMoney } from "../utils/money";
import { roundQuantity } from "../utils/quantity";
import {
  mapProductRow,
  type ProductRow,
} from "./products.repository";

export interface SaleInput {
  productId: string;
  quantity: number;
}

export interface SalePreview {
  product: Product;
  quantity: number;
  unitPrice: number | null;
  costPrice: number | null;
  marginPercent: number | null;
  total: number | null;
  unitProfit: number | null;
  totalProfit: number | null;
  stockAfter: number;
  canSell: boolean;
  issue: string | null;
}

export interface SaleListItem extends Sale {
  productName: string;
  productUnit: string;
}

interface SaleRow {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  cost_price: number | null;
  margin_percent: number | null;
  total: number;
  created_at: number;
  product_name: string;
  product_unit: string;
}

function mapSale(row: SaleRow): SaleListItem {
  return {
    id: row.id,
    productId: row.product_id,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    costPrice: row.cost_price,
    marginPercent: row.margin_percent,
    total: row.total,
    createdAt: row.created_at,
    productName: row.product_name,
    productUnit: row.product_unit,
  };
}

function saleMargin(
  costPrice: number | null,
  unitPrice: number,
): number | null {
  if (costPrice == null || costPrice <= 0) return null;
  return Math.round(effectiveMargin(costPrice, unitPrice) * 100) / 100;
}

export function buildSalePreview(product: Product, quantity: number): SalePreview {
  const safeQuantity = roundQuantity(quantity);
  const unitPrice =
    product.salePrice != null && product.salePrice > 0 ? product.salePrice : null;
  const costPrice = product.currentPrice;
  const total =
    unitPrice != null && safeQuantity > 0
      ? roundMoney(unitPrice * safeQuantity)
      : null;
  const unitProfit =
    unitPrice != null && costPrice != null ? unitPrice - costPrice : null;
  const totalProfit =
    unitProfit != null && safeQuantity > 0
      ? roundMoney(unitProfit * safeQuantity)
      : null;
  const stockAfter =
    safeQuantity > 0
      ? roundQuantity(product.stock - safeQuantity)
      : product.stock;

  let issue: string | null = null;
  if (unitPrice == null) {
    issue = "El producto no tiene precio de salida.";
  } else if (safeQuantity > product.stock) {
    issue = "La cantidad supera el stock disponible.";
  } else if (total != null && total <= 0) {
    issue = "El total de la venta debe ser mayor a cero.";
  }

  return {
    product,
    quantity: safeQuantity,
    unitPrice,
    costPrice,
    marginPercent: unitPrice != null ? saleMargin(costPrice, unitPrice) : null,
    total,
    unitProfit,
    totalProfit,
    stockAfter,
    canSell:
      unitPrice != null &&
      safeQuantity > 0 &&
      safeQuantity <= product.stock &&
      total != null &&
      total > 0,
    issue,
  };
}

export async function listSales(
  db: SQLiteDatabase,
  limit = 50,
): Promise<SaleListItem[]> {
  const rows = await db.getAllAsync<SaleRow>(
    `SELECT
       s.*,
       pr.name AS product_name,
       pr.unit AS product_unit
     FROM sales s
     JOIN products pr ON pr.id = s.product_id
     ORDER BY s.created_at DESC
     LIMIT ?`,
    [limit],
  );

  return rows.map(mapSale);
}

export async function registerSale(
  db: SQLiteDatabase,
  input: SaleInput,
): Promise<Sale> {
  const quantity = roundQuantity(input.quantity);

  if (quantity <= 0) {
    throw new Error("La cantidad debe ser mayor a cero.");
  }

  let created: Sale | null = null;

  await db.withExclusiveTransactionAsync(async (txn) => {
    const productRow = await txn.getFirstAsync<ProductRow>(
      "SELECT * FROM products WHERE id = ? AND archived_at IS NULL",
      input.productId,
    );

    if (!productRow) {
      throw new Error("Producto no encontrado o archivado.");
    }

    const product = mapProductRow(productRow);
    const unitPrice = product.salePrice;

    if (unitPrice == null || unitPrice <= 0) {
      throw new Error(
        "El producto no tiene precio de salida. Edítalo antes de vender.",
      );
    }
    if (quantity > product.stock) {
      throw new Error("La cantidad supera el stock disponible.");
    }

    const total = roundMoney(quantity * unitPrice);
    if (total <= 0) {
      throw new Error("El total de la venta debe ser mayor a cero.");
    }

    const marginPercent = saleMargin(product.currentPrice, unitPrice);
    const newStock = roundQuantity(product.stock - quantity);
    const id = createId("sal");
    const now = Date.now();

    await txn.runAsync(
      `INSERT INTO sales (
        id, product_id, quantity, unit_price, cost_price,
        margin_percent, total, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        product.id,
        quantity,
        unitPrice,
        product.currentPrice,
        marginPercent,
        total,
        now,
      ],
    );

    await txn.runAsync(
      `UPDATE products
       SET stock = ?, updated_at = ?
       WHERE id = ?`,
      [newStock, now, product.id],
    );

    created = {
      id,
      productId: product.id,
      quantity,
      unitPrice,
      costPrice: product.currentPrice,
      marginPercent,
      total,
      createdAt: now,
    };
  });

  if (!created) {
    throw new Error("No se pudo registrar la venta.");
  }

  return created;
}
