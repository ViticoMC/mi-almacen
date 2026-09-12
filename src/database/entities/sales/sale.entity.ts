export type SaleRow = {
  id: string;
  sale_date: string;
  subtotal: number;
  total: number;
  notes: string | null;
  created_at: string;
};

export type SaleItemRow = {
  id: string;
  sale_id: string;
  product_id: string;
  unit_id: string;
  quantity: number;
  factor: number;
  inventory_quantity: number;
  unit_price: number;
  cost_at_sale: number;
  total: number;
};
