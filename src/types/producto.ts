export type Product = {
  id: string;
  name: string;
  description?: string | null;
  current_stock?: number | null;
  average_cost?: number | null;
  last_cost?: number | null;
  image_path?: string | null;
};
