import type { SQLiteDatabase } from "expo-sqlite";
import type {
  Adjustment,
  HistoryEntry,
  HistoryType,
  Purchase,
  Sale,
} from "../types";

export interface HistoryFilters {
  type?: HistoryType;
  productId?: string;
  since?: number;
}

export interface HistoryListItem extends HistoryEntry {
  productUnit: string;
}

export interface PurchaseHistoryDetail extends Purchase {
  kind: "purchase";
  productName: string;
  productUnit: string;
}

export interface SaleHistoryDetail extends Sale {
  kind: "sale";
  productName: string;
  productUnit: string;
}

export interface AdjustmentHistoryDetail extends Adjustment {
  kind: "adjustment";
  productName: string;
  productUnit: string;
}

export type HistoryDetail =
  | PurchaseHistoryDetail
  | SaleHistoryDetail
  | AdjustmentHistoryDetail;

interface HistoryRow {
  type: HistoryType;
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  total: number | null;
  unit_price: number | null;
  reason: string | null;
  created_at: number;
  product_unit: string;
}

interface PurchaseDetailRow {
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

interface SaleDetailRow {
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

interface AdjustmentDetailRow {
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

function mapHistory(row: HistoryRow): HistoryListItem {
  return {
    type: row.type,
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    total: row.total,
    unitPrice: row.unit_price,
    reason: row.reason,
    createdAt: row.created_at,
    productUnit: row.product_unit,
  };
}

export function isHistoryType(value: string | undefined): value is HistoryType {
  return value === "purchase" || value === "sale" || value === "adjustment";
}

export async function listHistory(
  db: SQLiteDatabase,
  filters: HistoryFilters = {},
): Promise<HistoryListItem[]> {
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filters.type) {
    clauses.push("h.type = ?");
    params.push(filters.type);
  }
  if (filters.productId) {
    clauses.push("h.product_id = ?");
    params.push(filters.productId);
  }
  if (filters.since != null) {
    clauses.push("h.created_at >= ?");
    params.push(filters.since);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = await db.getAllAsync<HistoryRow>(
    `SELECT h.*, pr.unit AS product_unit
     FROM history h
     JOIN products pr ON pr.id = h.product_id
     ${where}
     ORDER BY h.created_at DESC
     LIMIT 200`,
    params,
  );

  return rows.map(mapHistory);
}

export async function getHistoryDetail(
  db: SQLiteDatabase,
  type: HistoryType,
  id: string,
): Promise<HistoryDetail | null> {
  if (type === "purchase") {
    const row = await db.getFirstAsync<PurchaseDetailRow>(
      `SELECT pu.*, pr.name AS product_name, pr.unit AS product_unit
       FROM purchases pu
       JOIN products pr ON pr.id = pu.product_id
       WHERE pu.id = ?`,
      id,
    );
    if (!row) return null;

    return {
      kind: "purchase",
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

  if (type === "sale") {
    const row = await db.getFirstAsync<SaleDetailRow>(
      `SELECT s.*, pr.name AS product_name, pr.unit AS product_unit
       FROM sales s
       JOIN products pr ON pr.id = s.product_id
       WHERE s.id = ?`,
      id,
    );
    if (!row) return null;

    return {
      kind: "sale",
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

  const row = await db.getFirstAsync<AdjustmentDetailRow>(
    `SELECT a.*, pr.name AS product_name, pr.unit AS product_unit
     FROM adjustments a
     JOIN products pr ON pr.id = a.product_id
     WHERE a.id = ?`,
    id,
  );
  if (!row) return null;

  return {
    kind: "adjustment",
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
