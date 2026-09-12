import type { SQLiteDatabase } from "expo-sqlite";
import type {
  ProductCreateInput,
  ProductRow,
  ProductUpdateInput,
} from "../../entities";
import { createId } from "../../utils/ids";
import { nowIso } from "../../utils/time";

const PRODUCT_COLUMNS = `
  id,
  name,
  description,
  image_path,
  active,
  current_stock,
  average_cost,
  last_cost,
  created_at,
  updated_at
`;

export async function listProducts(db: SQLiteDatabase) {
  return db.getAllAsync<ProductRow>(
    `SELECT ${PRODUCT_COLUMNS} FROM products ORDER BY name ASC`,
  );
}

export async function getProductById(db: SQLiteDatabase, id: string) {
  return db.getFirstAsync<ProductRow>(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = $id`,
    { $id: id },
  );
}

export async function createProduct(
  db: SQLiteDatabase,
  input: ProductCreateInput,
) {
  const id = input.id ?? createId("product");
  const timestamp = nowIso();

  await db.runAsync(
    `
      INSERT INTO products (
        id,
        name,
        description,
        image_path,
        active,
        current_stock,
        average_cost,
        last_cost,
        created_at,
        updated_at
      ) VALUES (
        $id,
        $name,
        $description,
        $image_path,
        $active,
        $current_stock,
        $average_cost,
        $last_cost,
        $created_at,
        $updated_at
      )
    `,
    {
      $id: id,
      $name: input.name,
      $description: input.description ?? null,
      $image_path: input.image_path ?? null,
      $active: input.active ?? 1,
      $current_stock: input.current_stock ?? 0,
      $average_cost: input.average_cost ?? 0,
      $last_cost: input.last_cost ?? 0,
      $created_at: timestamp,
      $updated_at: timestamp,
    },
  );

  return getProductById(db, id);
}

export async function updateProduct(
  db: SQLiteDatabase,
  id: string,
  input: ProductUpdateInput,
) {
  const current = await getProductById(db, id);

  if (!current) {
    return null;
  }

  const timestamp = nowIso();

  await db.runAsync(
    `
      UPDATE products SET
        name = $name,
        description = $description,
        image_path = $image_path,
        active = $active,
        current_stock = $current_stock,
        average_cost = $average_cost,
        last_cost = $last_cost,
        updated_at = $updated_at
      WHERE id = $id
    `,
    {
      $id: id,
      $name: input.name ?? current.name,
      $description: input.description ?? current.description,
      $image_path:
        input.image_path !== undefined
          ? input.image_path
          : current.image_path,
      $active: input.active ?? current.active,
      $current_stock: input.current_stock ?? current.current_stock,
      $average_cost: input.average_cost ?? current.average_cost,
      $last_cost: input.last_cost ?? current.last_cost,
      $updated_at: timestamp,
    },
  );

  return getProductById(db, id);
}

export async function deleteProduct(db: SQLiteDatabase, id: string) {
  const result = await db.runAsync(
    `
      UPDATE products SET
        active = 0,
        updated_at = $updated_at
      WHERE id = $id
    `,
    {
      $id: id,
      $updated_at: nowIso(),
    },
  );

  return result.changes > 0;
}
