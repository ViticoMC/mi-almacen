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

export type HistoryType = "purchase" | "sale" | "adjustment";

export interface HistoryEntry {
  type: HistoryType;
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number | null;
  unitPrice: number | null;
  reason: string | null;
  createdAt: number;
}
