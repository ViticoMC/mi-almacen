export type PurchaseRow = {
  id: string;
  supplier_id: string | null;
  invoice_number: string | null;
  purchase_date: string;
  subtotal: number;
  total: number;
  notes: string | null;
  created_at: string;
};

export type PurchaseItemRow = {
  id: string;
  purchase_id: string;
  product_id: string;
  unit_id: string;
  quantity: number;
  factor: number;
  inventory_quantity: number;
  unit_cost: number;
  total: number;
};
