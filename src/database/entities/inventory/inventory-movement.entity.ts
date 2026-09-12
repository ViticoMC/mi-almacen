export type InventoryMovementRow = {
  id: string;
  product_id: string;
  movement_type: string;
  quantity: number;
  unit_cost: number | null;
  reference_type: string;
  reference_id: string;
  movement_date: string;
  notes: string | null;
  created_at: string;
};
