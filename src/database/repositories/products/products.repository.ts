import type { SQLiteDatabase } from "expo-sqlite";
import type {
  ProductCreateInput,
  ProductUpdateInput,
  ProductWithMetrics,
} from "../../entities";
import { createId } from "../../utils/ids";
import { nowIso } from "../../utils/time";
import { createUnit } from "../units/units.repository";

const PRODUCT_WITH_METRICS_COLUMNS = `
  p.id,
  p.name,
  p.description,
  p.image_path,
  p.active,
  COALESCE(csv.current_stock, 0) AS current_stock,
  COALESCE(acv.average_cost, 0) AS average_cost,
  COALESCE(lcv.last_cost, 0) AS last_cost,
  p.created_at,
  p.updated_at
`;

const PRODUCT_WITH_METRICS_JOIN = `
  FROM products p
  LEFT JOIN current_stock_view csv ON csv.product_id = p.id
  LEFT JOIN average_cost_view acv ON acv.product_id = p.id
  LEFT JOIN last_cost_view lcv ON lcv.product_id = p.id
`;

export async function listProducts(
  db: SQLiteDatabase,
): Promise<ProductWithMetrics[]> {
  return db.getAllAsync<ProductWithMetrics>(
    `SELECT ${PRODUCT_WITH_METRICS_COLUMNS} ${PRODUCT_WITH_METRICS_JOIN}
      WHERE p.active = 1
      ORDER BY p.name ASC`,
  );
}

export async function getProductById(
  db: SQLiteDatabase,
  id: string,
): Promise<ProductWithMetrics | null> {
  return db.getFirstAsync<ProductWithMetrics>(
    `SELECT ${PRODUCT_WITH_METRICS_COLUMNS} ${PRODUCT_WITH_METRICS_JOIN}
      WHERE p.id = $id`,
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
        created_at,
        updated_at
      ) VALUES (
        $id,
        $name,
        $description,
        $image_path,
        $active,
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
      $created_at: timestamp,
      $updated_at: timestamp,
    },
  );

  // Todo producto nace con su unidad base (1 elemento) para que se puedan
  // registrar movimientos sin pasar antes por la ficha del producto.
  await createUnit(db, {
    product_id: id,
    name: "Unidad",
    factor: 1,
    is_base: 1,
  });

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