import type { SQLiteDatabase } from "expo-sqlite";
import type { SupplierRow } from "../../entities";
import { createId } from "../../utils/ids";
import { nowIso } from "../../utils/time";

export type SupplierCreateInput = {
  id?: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
};

export async function listSuppliers(db: SQLiteDatabase): Promise<SupplierRow[]> {
  return db.getAllAsync<SupplierRow>(`SELECT * FROM suppliers ORDER BY name ASC`);
}

export async function createSupplier(
  db: SQLiteDatabase,
  input: SupplierCreateInput,
): Promise<SupplierRow | null> {
  const name = input.name.trim();
  if (!name) throw new Error("El nombre del proveedor es obligatorio.");

  const id = input.id ?? createId("supplier");
  const createdAt = nowIso();

  await db.runAsync(
    `INSERT INTO suppliers (id, name, phone, email, address, created_at)
     VALUES ($id, $name, $phone, $email, $address, $created_at)`,
    {
      $id: id,
      $name: name,
      $phone: input.phone ?? null,
      $email: input.email ?? null,
      $address: input.address ?? null,
      $created_at: createdAt,
    },
  );

  return db.getFirstAsync<SupplierRow>(`SELECT * FROM suppliers WHERE id = $id`, { $id: id });
}
