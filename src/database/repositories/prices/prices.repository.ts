import type { SQLiteDatabase } from "expo-sqlite";
import type { ProductPriceRow } from "../../entities";
import { createId } from "../../utils/ids";
import { nowIso } from "../../utils/time";

export type PriceUpsertInput = {
  product_id: string;
  unit_id: string;
  price: number;
  effective_date?: string;
};

export type UnitPriceView = ProductPriceRow & {
  unit_name: string;
  factor: number;
};

export async function listPricesByProduct(
  db: SQLiteDatabase,
  productId: string,
): Promise<UnitPriceView[]> {
  return db.getAllAsync<UnitPriceView>(
    `SELECT pp.*, u.name AS unit_name, u.factor AS factor
     FROM product_prices pp
     INNER JOIN product_units u ON u.id = pp.unit_id
     WHERE pp.product_id = $product_id
     ORDER BY pp.effective_date DESC, pp.created_at DESC`,
    { $product_id: productId },
  );
}

export async function getPrice(
  db: SQLiteDatabase,
  productId: string,
  unitId: string,
): Promise<ProductPriceRow | null> {
  return db.getFirstAsync<ProductPriceRow>(
    `SELECT * FROM product_prices
     WHERE product_id = $product_id AND unit_id = $unit_id
     ORDER BY effective_date DESC, created_at DESC LIMIT 1`,
    { $product_id: productId, $unit_id: unitId },
  );
}

export async function upsertPrice(
  db: SQLiteDatabase,
  input: PriceUpsertInput,
): Promise<ProductPriceRow | null> {
  const price = Number(input.price);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("El precio debe ser un número válido mayor o igual a cero.");
  }

  const unit = await db.getFirstAsync<{ id: string; product_id: string }>(
    `SELECT id, product_id FROM product_units WHERE id = $id`,
    { $id: input.unit_id },
  );
  if (!unit) throw new Error("No existe la presentación seleccionada.");
  if (unit.product_id !== input.product_id) {
    throw new Error("La presentación no pertenece a este producto.");
  }

  const timestamp = nowIso();
  const effectiveDate = input.effective_date ?? timestamp;
  const id = createId("price");

  await db.runAsync(
    `INSERT INTO product_prices (id, product_id, unit_id, price, effective_date, created_at)
     VALUES ($id, $product_id, $unit_id, $price, $effective_date, $created_at)`,
    {
      $id: id,
      $product_id: input.product_id,
      $unit_id: input.unit_id,
      $price: price,
      $effective_date: effectiveDate,
      $created_at: timestamp,
    },
  );

  return db.getFirstAsync<ProductPriceRow>(`SELECT * FROM product_prices WHERE id = $id`, {
    $id: id,
  });
}
