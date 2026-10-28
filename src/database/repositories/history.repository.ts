import type { SQLiteDatabase } from "expo-sqlite";
import type {
  Adjustment,
  CountAdjustmentLine,
  CountListItem,
  CountSaleLine,
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

export interface CountHistoryDetail extends CountListItem {
  kind: "count";
  productName: string;
  productUnit: string | null;
  sales: CountSaleLine[];
  adjustments: CountAdjustmentLine[];
}

export type HistoryDetail =
  | PurchaseHistoryDetail
  | SaleHistoryDetail
  | AdjustmentHistoryDetail
  | CountHistoryDetail;

interface HistoryRow {
  type: HistoryType;
  id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  total: number | null;
  unit_price: number | null;
  reason: string | null;
  created_at: number;
  product_unit: string | null;
  item_count: number | null;
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

interface CountRow {
  id: string;
  total_sale: number;
  units_sold: number;
  units_added: number;
  sale_lines: number;
  adjustment_lines: number;
  created_at: number;
}

interface CountSaleLineRow {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  cost_price: number | null;
  margin_percent: number | null;
  total: number;
  stock_before: number | null;
  stock_after: number | null;
  product_name: string;
  product_unit: string;
  created_at: number;
}

interface CountAdjustmentLineRow {
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

function mapCountSaleLine(row: CountSaleLineRow): CountSaleLine {
  return {
    id: row.id,
    productId: row.product_id,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    costPrice: row.cost_price,
    marginPercent: row.margin_percent,
    total: row.total,
    stockBefore: row.stock_before,
    stockAfter: row.stock_after,
    productName: row.product_name,
    productUnit: row.product_unit,
    createdAt: row.created_at,
  };
}

function mapCountAdjustmentLine(
  row: CountAdjustmentLineRow,
): CountAdjustmentLine {
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
    itemCount: row.item_count ?? null,
    createdAt: row.created_at,
    productUnit: row.product_unit ?? "",
  };
}

export function isHistoryType(value: string | undefined): value is HistoryType {
  return (
    value === "purchase" ||
    value === "sale" ||
    value === "adjustment" ||
    value === "count"
  );
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
    clauses.push(`(
      h.product_id = ? OR (
        h.type = 'count' AND (
          EXISTS (SELECT 1 FROM sales s WHERE s.count_id = h.id AND s.product_id = ?) OR
          EXISTS (SELECT 1 FROM adjustments a WHERE a.count_id = h.id AND a.product_id = ?)
        )
      )
    )`);
    params.push(filters.productId, filters.productId, filters.productId);
  }
  if (filters.since != null) {
    clauses.push("h.created_at >= ?");
    params.push(filters.since);
  }

  const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = await db.getAllAsync<HistoryRow>(
    `SELECT h.*, pr.unit AS product_unit
     FROM history h
     LEFT JOIN products pr ON pr.id = h.product_id
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
  if (type === "count") {
    const countRow = await db.getFirstAsync<CountRow>(
      `SELECT * FROM counts WHERE id = ?`,
      id,
    );

    if (!countRow) return null;

    const sales = await db.getAllAsync<CountSaleLineRow>(
      `SELECT
         s.id,
         s.product_id,
         s.quantity,
         s.unit_price,
         s.cost_price,
         s.margin_percent,
         s.total,
         s.stock_before,
         s.stock_after,
         pr.name AS product_name,
         pr.unit AS product_unit,
         s.created_at
       FROM sales s
       JOIN products pr ON pr.id = s.product_id
       WHERE s.count_id = ?
       ORDER BY s.created_at ASC`,
      [id],
    );

    const adjustments = await db.getAllAsync<CountAdjustmentLineRow>(
      `SELECT
         a.id,
         a.product_id,
         a.quantity_delta,
         a.stock_before,
         a.stock_after,
         a.unit_cost,
         a.reason,
         a.created_at,
         pr.name AS product_name,
         pr.unit AS product_unit
       FROM adjustments a
       JOIN products pr ON pr.id = a.product_id
       WHERE a.count_id = ?
       ORDER BY a.created_at ASC`,
      [id],
    );

    return {
      kind: "count",
      id: countRow.id,
      totalSale: countRow.total_sale,
      unitsSold: countRow.units_sold,
      unitsAdded: countRow.units_added,
      saleLines: countRow.sale_lines,
      adjustmentLines: countRow.adjustment_lines,
      createdAt: countRow.created_at,
      itemCount: countRow.sale_lines + countRow.adjustment_lines,
      productName: "Conteo semanal",
      productUnit: null,
      sales: sales.map(mapCountSaleLine),
      adjustments: adjustments.map(mapCountAdjustmentLine),
    };
  }

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
