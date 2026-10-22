import type { SQLiteDatabase } from "expo-sqlite";
import type { HistoryEntry, HistoryType } from "../types";
import { roundMoney } from "../utils/money";
import { roundQuantity } from "../utils/quantity";

export interface DashboardStats {
  costValue: number;
  saleValue: number;
  potentialProfit: number;
  totalUnits: number;
  activeProducts: number;
  lowStockCount: number;
}

export interface DashboardActivity extends HistoryEntry {
  productUnit: string;
}

interface StatsRow {
  cost_value: number | null;
  sale_value: number | null;
  total_units: number | null;
  active_products: number;
  low_stock_count: number;
}

interface ActivityRow {
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

function mapActivity(row: ActivityRow): DashboardActivity {
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

export async function getDashboardStats(
  db: SQLiteDatabase,
): Promise<DashboardStats> {
  const row = await db.getFirstAsync<StatsRow>(
    `SELECT
       COALESCE(SUM(stock * COALESCE(current_price, 0)), 0) AS cost_value,
       COALESCE(SUM(stock * COALESCE(sale_price, 0)), 0) AS sale_value,
       COALESCE(SUM(stock), 0) AS total_units,
       COUNT(*) AS active_products,
       COALESCE(SUM(
         CASE WHEN min_stock > 0 AND stock <= min_stock THEN 1 ELSE 0 END
       ), 0) AS low_stock_count
     FROM products
     WHERE archived_at IS NULL`,
  );

  const costValue = roundMoney(row?.cost_value ?? 0);
  const saleValue = roundMoney(row?.sale_value ?? 0);

  return {
    costValue,
    saleValue,
    potentialProfit: saleValue - costValue,
    totalUnits: roundQuantity(row?.total_units ?? 0),
    activeProducts: row?.active_products ?? 0,
    lowStockCount: row?.low_stock_count ?? 0,
  };
}

export async function listRecentActivity(
  db: SQLiteDatabase,
  limit = 5,
): Promise<DashboardActivity[]> {
  const rows = await db.getAllAsync<ActivityRow>(
    `SELECT h.*, pr.unit AS product_unit
     FROM history h
     JOIN products pr ON pr.id = h.product_id
     ORDER BY h.created_at DESC
     LIMIT ?`,
    [limit],
  );

  return rows.map(mapActivity);
}
