export type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  image_path: string | null;
  active: number;
  current_stock: number;
  average_cost: number;
  last_cost: number;
  created_at: string;
  updated_at: string;
};

export type ProductCreateInput = {
  id?: string;
  name: string;
  description?: string | null;
  image_path?: string | null;
  active?: number;
  current_stock?: number;
  average_cost?: number;
  last_cost?: number;
};

export type ProductUpdateInput = Partial<
  Omit<ProductCreateInput, "id"> & {
    current_stock: number;
    average_cost: number;
    last_cost: number;
  }
>;
