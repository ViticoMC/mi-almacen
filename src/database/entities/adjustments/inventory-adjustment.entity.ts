export type InventoryAdjustmentRow = {
  id: string;
  adjustment_date: string;
  reason: string | null;
  created_at: string;
};

export type InventoryAdjustmentItemRow = {
  id: string;
  adjustment_id: string;
  product_id: string;
  expected_quantity: number;
  actual_quantity: number;
  difference_quantity: number;
};
