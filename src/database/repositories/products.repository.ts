import type { SQLiteDatabase } from "expo-sqlite";
import type { Product } from "../types";
import { createId } from "../utils/ids";
import {
  calculateSalePrice,
  clampMargin,
  effectiveMargin,
  roundMoney,
} from "../utils/money";
import { roundQuantity } from "../utils/quantity";

export interface ProductInput {
  name: string;
  unit: string;
  minStock: number;
  marginPercent: number;
}

export interface UpdateProductInput extends ProductInput {
  salePrice?: number | null;
}

export interface ProductRow {
  id: string;
  name: string;
  unit: string;
  stock: number;
  min_stock: number;
  last_price: number | null;
  current_price: number | null;
  sale_price: number | null;
  margin_percent: number;
  created_at: number;
  updated_at: number;
  archived_at: number | null;
}

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    stock: row.stock,
    minStock: row.min_stock,
    lastPrice: row.last_price,
    currentPrice: row.current_price,
    salePrice: row.sale_price,
    marginPercent: row.margin_percent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}

export async function listProducts(
  db: SQLiteDatabase,
  options: {
    search?: string;
    lowStockOnly?: boolean;
    includeArchived?: boolean;
  } = {},
): Promise<Product[]> {
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (!options.includeArchived) {
    clauses.push("archived_at IS NULL");
  }

  const search = options.search?.trim();
  if (search) {
    clauses.push("name LIKE ?");
    params.push(`%${search}%`);
  }

  if (options.lowStockOnly) {
    clauses.push("min_stock > 0 AND stock <= min_stock");
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = await db.getAllAsync<ProductRow>(
    `SELECT * FROM products ${where} ORDER BY name COLLATE NOCASE ASC`,
    params,
  );

  return rows.map(mapProductRow);
}

export async function getProduct(
  db: SQLiteDatabase,
  id: string,
): Promise<Product | null> {
  const row = await db.getFirstAsync<ProductRow>(
    "SELECT * FROM products WHERE id = ?",
    id,
  );
  return row ? mapProductRow(row) : null;
}

export async function createProduct(
  db: SQLiteDatabase,
  input: ProductInput,
): Promise<Product> {
  const id = createId("prd");
  const now = Date.now();
  const margin = clampMargin(input.marginPercent);
  const minStock = Math.max(0, roundQuantity(input.minStock));

  await db.runAsync(
    `INSERT INTO products (
      id, name, unit, stock, min_stock, last_price, current_price,
      sale_price, margin_percent, created_at, updated_at, archived_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.name.trim(),
      input.unit.trim(),
      0,
      minStock,
      null,
      null,
      null,
      margin,
      now,
      now,
      null,
    ],
  );

  const product = await getProduct(db, id);
  if (!product) throw new Error("No se pudo crear el producto.");
  return product;
}

export async function updateProduct(
  db: SQLiteDatabase,
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const existing = await getProduct(db, id);
  if (!existing) throw new Error("Producto no encontrado.");

  const margin = clampMargin(input.marginPercent);
  let marginPercent = margin;
  let salePrice: number | null = null;
  const cost = existing.currentPrice;

  if (cost != null && cost > 0) {
    const calculated = calculateSalePrice(cost, margin);
    const requested =
      input.salePrice != null && input.salePrice > 0
        ? roundMoney(input.salePrice)
        : calculated;

    if (requested === calculated) {
      salePrice = calculated;
      marginPercent = margin;
    } else if (requested < cost) {
      salePrice = cost;
      marginPercent = 0;
    } else {
      const effective = effectiveMargin(cost, requested);
      if (effective >= 30) {
        salePrice = calculated;
        marginPercent = margin;
      } else {
        salePrice = requested;
        marginPercent = Math.round(effective * 100) / 100;
      }
    }
  }

  const now = Date.now();
  await db.runAsync(
    `UPDATE products
     SET name = ?, unit = ?, min_stock = ?, margin_percent = ?,
         sale_price = ?, updated_at = ?
     WHERE id = ?`,
    [
      input.name.trim(),
      input.unit.trim(),
      Math.max(0, roundQuantity(input.minStock)),
      marginPercent,
      salePrice,
      now,
      id,
    ],
  );

  const product = await getProduct(db, id);
  if (!product) throw new Error("No se pudo actualizar el producto.");
  return product;
}

export async function archiveProduct(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  const now = Date.now();
  await db.runAsync(
    "UPDATE products SET archived_at = ?, updated_at = ? WHERE id = ? AND archived_at IS NULL",
    [now, now, id],
  );
}
