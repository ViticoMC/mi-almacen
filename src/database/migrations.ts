import type { SQLiteDatabase } from "expo-sqlite";

export const DATABASE_NAME = "mi-almacen.db";

const PRODUCT_COLUMNS = [
  "id",
  "name",
  "unit",
  "stock",
  "min_stock",
  "last_price",
  "current_price",
  "sale_price",
  "margin_percent",
  "created_at",
  "updated_at",
  "archived_at",
];

const migrations: ((db: SQLiteDatabase) => Promise<void>)[] = [
  async (db) => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        stock REAL NOT NULL DEFAULT 0 CHECK (stock >= 0),
        min_stock REAL NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
        last_price INTEGER,
        current_price INTEGER,
        sale_price INTEGER,
        margin_percent REAL NOT NULL DEFAULT 0 CHECK (margin_percent >= 0 AND margin_percent < 30),
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        archived_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY NOT NULL,
        product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity REAL NOT NULL CHECK (quantity > 0),
        total INTEGER NOT NULL CHECK (total > 0),
        unit_cost INTEGER NOT NULL CHECK (unit_cost > 0),
        previous_cost INTEGER,
        new_cost INTEGER NOT NULL,
        previous_sale_price INTEGER,
        new_sale_price INTEGER,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY NOT NULL,
        product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity REAL NOT NULL CHECK (quantity > 0),
        unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
        cost_price INTEGER,
        margin_percent REAL,
        total INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS adjustments (
        id TEXT PRIMARY KEY NOT NULL,
        product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity_delta REAL NOT NULL CHECK (quantity_delta <> 0),
        stock_before REAL NOT NULL,
        stock_after REAL NOT NULL CHECK (stock_after >= 0),
        unit_cost INTEGER,
        reason TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
      CREATE INDEX IF NOT EXISTS idx_products_alert ON products(archived_at, min_stock, stock);
      CREATE INDEX IF NOT EXISTS idx_purchases_created ON purchases(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_sales_created ON sales(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_adjustments_created ON adjustments(created_at DESC);

      CREATE VIEW IF NOT EXISTS history AS
        SELECT
          'purchase' AS type,
          p.id AS id,
          p.product_id AS product_id,
          pr.name AS product_name,
          p.quantity AS quantity,
          p.total AS total,
          p.unit_cost AS unit_price,
          NULL AS reason,
          p.created_at AS created_at
        FROM purchases p
        JOIN products pr ON pr.id = p.product_id
        UNION ALL
        SELECT
          'sale',
          s.id,
          s.product_id,
          pr.name,
          s.quantity,
          s.total,
          s.unit_price,
          NULL,
          s.created_at
        FROM sales s
        JOIN products pr ON pr.id = s.product_id
        UNION ALL
        SELECT
          'adjustment',
          a.id,
          a.product_id,
          pr.name,
          a.quantity_delta,
          NULL,
          a.unit_cost,
          a.reason,
          a.created_at
        FROM adjustments a
        JOIN products pr ON pr.id = a.product_id;
    `);
  },
];

export const DATABASE_VERSION = migrations.length;

function quoteIdentifier(name: string): string {
  return `"${name.replaceAll('"', '""')}"`;
}

async function tableExists(db: SQLiteDatabase, table: string): Promise<boolean> {
  const row = await db.getFirstAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    table,
  );
  return row != null;
}

async function getTableColumns(
  db: SQLiteDatabase,
  table: string,
): Promise<string[]> {
  if (!(await tableExists(db, table))) return [];

  const rows = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${quoteIdentifier(table)})`,
  );
  return rows.map((row) => row.name);
}

async function snapshotLegacyProducts(
  db: SQLiteDatabase,
  columns: string[],
): Promise<void> {
  const has = (column: string) => columns.includes(column);
  const hasUnits = await tableExists(db, "product_units");
  const hasMovements = await tableExists(db, "inventory_movements");

  const unit = hasUnits
    ? `COALESCE((
        SELECT u.name FROM product_units u
        WHERE u.product_id = lp.id AND u.is_base = 1
        ORDER BY u.created_at ASC LIMIT 1
      ), 'Unidad')`
    : "'Unidad'";

  let stock = "0";
  if (has("current_stock")) {
    stock = "MAX(0, COALESCE(lp.current_stock, 0))";
  } else if (hasMovements) {
    stock = `MAX(0, COALESCE((
      SELECT SUM(
        CASE
          WHEN m.movement_type IN ('IN', 'ADJUSTMENT_IN') THEN m.quantity
          WHEN m.movement_type IN ('OUT', 'ADJUSTMENT_OUT') THEN -m.quantity
          ELSE 0
        END
      )
      FROM inventory_movements m
      WHERE m.product_id = lp.id
    ), 0))`;
  }

  let lastPrice = "NULL";
  if (has("last_cost")) {
    lastPrice =
      "CASE WHEN lp.last_cost > 0 THEN CAST(ROUND(lp.last_cost) AS INTEGER) ELSE NULL END";
  } else if (hasMovements) {
    lastPrice = `(
      SELECT CAST(ROUND(m.unit_cost) AS INTEGER)
      FROM inventory_movements m
      WHERE m.product_id = lp.id
        AND m.movement_type IN ('IN', 'ADJUSTMENT_IN')
        AND m.unit_cost IS NOT NULL
      ORDER BY m.movement_date DESC, m.created_at DESC, m.id DESC
      LIMIT 1
    )`;
  }

  let currentPrice = "NULL";
  if (has("average_cost")) {
    currentPrice =
      "CASE WHEN lp.average_cost > 0 THEN CAST(ROUND(lp.average_cost) AS INTEGER) ELSE NULL END";
  } else if (hasMovements) {
    currentPrice = `(
      SELECT CAST(ROUND(SUM(m.quantity * m.unit_cost) / SUM(m.quantity)) AS INTEGER)
      FROM inventory_movements m
      WHERE m.product_id = lp.id
        AND m.movement_type IN ('IN', 'ADJUSTMENT_IN')
        AND m.unit_cost IS NOT NULL
    )`;
  }

  const createdAt = `COALESCE(
    CAST(strftime('%s', lp.created_at) AS INTEGER) * 1000,
    CAST(strftime('%s', 'now') AS INTEGER) * 1000
  )`;
  const updatedAt = has("updated_at")
    ? `COALESCE(CAST(strftime('%s', lp.updated_at) AS INTEGER) * 1000, ${createdAt})`
    : createdAt;
  const archivedAt = has("active")
    ? `CASE WHEN lp.active = 0 THEN ${updatedAt} ELSE NULL END`
    : "NULL";

  await db.execAsync("DROP TABLE IF EXISTS legacy_product_snapshot;");
  await db.execAsync(`
    CREATE TABLE legacy_product_snapshot AS
    SELECT
      lp.id AS id,
      lp.name AS name,
      ${unit} AS unit,
      ${stock} AS stock,
      0 AS min_stock,
      ${lastPrice} AS last_price,
      ${currentPrice} AS current_price,
      NULL AS sale_price,
      0 AS margin_percent,
      ${createdAt} AS created_at,
      ${updatedAt} AS updated_at,
      ${archivedAt} AS archived_at
    FROM products lp;
  `);
}

async function resetDatabase(
  db: SQLiteDatabase,
  legacyColumns?: string[],
): Promise<void> {
  await db.execAsync("PRAGMA foreign_keys = OFF;");

  if (legacyColumns) {
    await snapshotLegacyProducts(db, legacyColumns);
  }

  const objects = await db.getAllAsync<{ name: string; type: string }>(
    `SELECT name, type FROM sqlite_master
     WHERE type IN ('table', 'view')
       AND name NOT LIKE 'sqlite_%'
       AND name <> 'android_metadata'`,
  );

  for (const object of objects) {
    if (object.name === "legacy_product_snapshot") continue;
    const kind = object.type === "view" ? "VIEW" : "TABLE";
    await db.execAsync(
      `DROP ${kind} IF EXISTS ${quoteIdentifier(object.name)};`,
    );
  }

  await db.execAsync("PRAGMA user_version = 0;");
  await migrations[0](db);

  if (legacyColumns) {
    await db.execAsync(`
      INSERT OR REPLACE INTO products (
        id, name, unit, stock, min_stock, last_price, current_price,
        sale_price, margin_percent, created_at, updated_at, archived_at
      )
      SELECT
        id, name, unit, stock, min_stock, last_price, current_price,
        sale_price, margin_percent, created_at, updated_at, archived_at
      FROM legacy_product_snapshot;

      DROP TABLE IF EXISTS legacy_product_snapshot;
    `);
  }

  await db.execAsync(
    `PRAGMA user_version = ${DATABASE_VERSION}; PRAGMA foreign_keys = ON;`,
  );
}

export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  const currentVersion = row?.user_version ?? 0;

  const columns = await getTableColumns(db, "products");
  const hasProducts = columns.length > 0;
  const hasCurrentSchema = PRODUCT_COLUMNS.every((column) =>
    columns.includes(column),
  );
  const isLegacy = hasProducts && !columns.includes("unit");

  if ((hasProducts && !hasCurrentSchema) || currentVersion > DATABASE_VERSION) {
    await resetDatabase(db, isLegacy ? columns : undefined);
    return;
  }

  if (currentVersion >= DATABASE_VERSION) return;

  for (let version = currentVersion; version < DATABASE_VERSION; version += 1) {
    await migrations[version](db);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
