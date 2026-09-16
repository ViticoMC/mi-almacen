import type { SQLiteDatabase } from "expo-sqlite";
import type { ProductUnitRow } from "../../entities";
import { createId } from "../../utils/ids";
import { nowIso } from "../../utils/time";

export type UnitCreateInput = {
  id?: string;
  product_id: string;
  name: string;
  factor: number;
  is_base?: number | boolean;
};

export type UnitUpdateInput = {
  name?: string;
  factor?: number;
  is_base?: number | boolean;
};

function normalizeIsBase(value: number | boolean | undefined, fallback = 0): number {
  if (value === undefined || value === null) return fallback;
  return Number(value) === 1 || value === true ? 1 : 0;
}

export async function listUnitsByProduct(
  db: SQLiteDatabase,
  productId: string,
): Promise<ProductUnitRow[]> {
  return db.getAllAsync<ProductUnitRow>(
    `SELECT * FROM product_units WHERE product_id = $product_id ORDER BY is_base DESC, factor ASC, name ASC`,
    { $product_id: productId },
  );
}

export async function getUnitById(
  db: SQLiteDatabase,
  id: string,
): Promise<ProductUnitRow | null> {
  return db.getFirstAsync<ProductUnitRow>(`SELECT * FROM product_units WHERE id = $id`, {
    $id: id,
  });
}

export async function getBaseUnit(
  db: SQLiteDatabase,
  productId: string,
): Promise<ProductUnitRow | null> {
  return db.getFirstAsync<ProductUnitRow>(
    `SELECT * FROM product_units WHERE product_id = $product_id AND is_base = 1 LIMIT 1`,
    { $product_id: productId },
  );
}

export async function createUnit(db: SQLiteDatabase, input: UnitCreateInput): Promise<ProductUnitRow | null> {
  const name = input.name.trim();
  const factor = Number(input.factor);

  if (!input.product_id) throw new Error("Falta el producto.");
  if (!name) throw new Error("El nombre de la presentación es obligatorio.");
  if (!Number.isFinite(factor) || factor <= 0) {
    throw new Error("Indica cuántas unidades trae la presentación (debe ser mayor a cero).");
  }

  const product = await db.getFirstAsync<{ id: string }>(
    `SELECT id FROM products WHERE id = $id`,
    { $id: input.product_id },
  );
  if (!product) throw new Error("No existe el producto.");

  const id = input.id ?? createId("unit");
  const createdAt = nowIso();
  const isBase = normalizeIsBase(input.is_base);

  await db.withTransactionAsync(async () => {
    if (isBase === 1) {
      await db.runAsync(`UPDATE product_units SET is_base = 0 WHERE product_id = $product_id`, {
        $product_id: input.product_id,
      });
    }
    await db.runAsync(
      `INSERT INTO product_units (id, product_id, name, factor, is_base, created_at)
       VALUES ($id, $product_id, $name, $factor, $is_base, $created_at)`,
      {
        $id: id,
        $product_id: input.product_id,
        $name: name,
        $factor: factor,
        $is_base: isBase,
        $created_at: createdAt,
      },
    );
  });

  return getUnitById(db, id);
}

export async function updateUnit(
  db: SQLiteDatabase,
  id: string,
  input: UnitUpdateInput,
): Promise<ProductUnitRow | null> {
  const current = await getUnitById(db, id);
  if (!current) return null;

  const name = input.name !== undefined ? input.name.trim() : current.name;
  const factor = input.factor !== undefined ? Number(input.factor) : Number(current.factor);
  const isBase =
    input.is_base !== undefined ? normalizeIsBase(input.is_base) : Number(current.is_base);

  if (!name) throw new Error("El nombre de la presentación es obligatorio.");
  if (!Number.isFinite(factor) || factor <= 0) {
    throw new Error("Indica cuántas unidades trae la presentación (debe ser mayor a cero).");
  }

  await db.withTransactionAsync(async () => {
    if (isBase === 1) {
      await db.runAsync(`UPDATE product_units SET is_base = 0 WHERE product_id = $product_id`, {
        $product_id: current.product_id,
      });
    }
    await db.runAsync(
      `UPDATE product_units SET name = $name, factor = $factor, is_base = $is_base WHERE id = $id`,
      { $name: name, $factor: factor, $is_base: isBase, $id: id },
    );
  });

  return getUnitById(db, id);
}

export async function deleteUnit(db: SQLiteDatabase, id: string): Promise<boolean> {
  const current = await getUnitById(db, id);
  if (!current) return false;

  const usedInPurchases = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(*) AS total FROM purchase_items WHERE unit_id = $id`,
    { $id: id },
  );
  const usedInSales = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(*) AS total FROM sale_items WHERE unit_id = $id`,
    { $id: id },
  );

  if (Number(usedInPurchases?.total ?? 0) > 0 || Number(usedInSales?.total ?? 0) > 0) {
    throw new Error("No se puede eliminar: la presentación ya se usó en compras o ventas.");
  }

  const result = await db.runAsync(`DELETE FROM product_units WHERE id = $id`, { $id: id });
  return result.changes > 0;
}
