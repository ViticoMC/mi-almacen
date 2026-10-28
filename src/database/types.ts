export interface Product {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  lastPrice: number | null;
  currentPrice: number | null;
  salePrice: number | null;
  marginPercent: number;
  createdAt: number;
  updatedAt: number;
  archivedAt: number | null;
}

export interface Purchase {
  id: string;
  productId: string;
  quantity: number;
  total: number;
  unitCost: number;
  previousCost: number | null;
  newCost: number;
  previousSalePrice: number | null;
  newSalePrice: number | null;
  createdAt: number;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  costPrice: number | null;
  marginPercent: number | null;
  total: number;
  createdAt: number;
}

export interface Adjustment {
  id: string;
  productId: string;
  quantityDelta: number;
  stockBefore: number;
  stockAfter: number;
  unitCost: number | null;
  reason: string | null;
  createdAt: number;
}

export interface Count {
  id: string;
  totalSale: number;
  unitsSold: number;
  unitsAdded: number;
  saleLines: number;
  adjustmentLines: number;
  createdAt: number;
}

export interface CountListItem extends Count {
  itemCount: number;
}

export interface CountSaleLine {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  costPrice: number | null;
  marginPercent: number | null;
  total: number;
  stockBefore: number | null;
  stockAfter: number | null;
  productName: string;
  productUnit: string;
  createdAt: number;
}

export interface CountAdjustmentLine extends Adjustment {
  productName: string;
  productUnit: string;
}

export interface CountDetail extends CountListItem {
  productName: string;
  productUnit: string | null;
  sales: CountSaleLine[];
  adjustments: CountAdjustmentLine[];
}

export type HistoryLineType = "purchase" | "sale" | "adjustment";
export type HistoryType = HistoryLineType | "count";

export interface HistoryEntry {
  type: HistoryType;
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  total: number | null;
  unitPrice: number | null;
  reason: string | null;
  itemCount: number | null;
  createdAt: number;
}
