import type { SQLiteDatabase } from "expo-sqlite";
import { DATABASE_VERSION } from "../schema";
import {
  enableDatabasePragmas,
  getUserVersion,
  runInTransaction,
  setUserVersion,
} from "../utils/sqlite";
import {
  INITIAL_MIGRATION_VERSION,
  INITIAL_SCHEMA_SQL,
  INITIAL_SEED_SQL,
} from "./0001-initial";
import {
  PRODUCT_IMAGES_MIGRATION_VERSION,
  PRODUCT_IMAGES_SCHEMA_SQL,
} from "./0002-product-images";
import {
  REMOVE_PRODUCT_CACHE_MIGRATION_VERSION,
  REMOVE_PRODUCT_CACHE_SCHEMA_SQL,
} from "./0003-remove-product-cache";
import {
  SEED_DEMO_PRODUCTS_MIGRATION_VERSION,
  SEED_DEMO_PRODUCTS_SCHEMA_SQL,
} from "./0004-seed-demo-products";
import {
  UNITS_HARDENING_MIGRATION_VERSION,
  UNITS_HARDENING_SCHEMA_SQL,
} from "./0005-units-hardening";
import {
  BASE_UNITS_BACKFILL_MIGRATION_VERSION,
  BASE_UNITS_BACKFILL_SCHEMA_SQL,
} from "./0006-base-units-backfill";

type Migration = {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
};

const MIGRATIONS: Migration[] = [
  {
    version: INITIAL_MIGRATION_VERSION,
    up: async (db) => {
      await db.execAsync(INITIAL_SCHEMA_SQL);
      await db.execAsync(INITIAL_SEED_SQL);
    },
  },
  {
    version: PRODUCT_IMAGES_MIGRATION_VERSION,
    up: async (db) => {
      await db.execAsync(PRODUCT_IMAGES_SCHEMA_SQL);
    },
  },
  {
    version: REMOVE_PRODUCT_CACHE_MIGRATION_VERSION,
    up: async (db) => {
      await db.execAsync(REMOVE_PRODUCT_CACHE_SCHEMA_SQL);
    },
  },
  {
    version: SEED_DEMO_PRODUCTS_MIGRATION_VERSION,
    up: async (db) => {
      await db.execAsync(SEED_DEMO_PRODUCTS_SCHEMA_SQL);
    },
  },
  {
    version: UNITS_HARDENING_MIGRATION_VERSION,
    up: async (db) => {
      await db.execAsync(UNITS_HARDENING_SCHEMA_SQL);
    },
  },
  {
    version: BASE_UNITS_BACKFILL_MIGRATION_VERSION,
    up: async (db) => {
      await db.execAsync(BASE_UNITS_BACKFILL_SCHEMA_SQL);
    },
  },
];

export async function migrateDatabase(db: SQLiteDatabase) {
  await enableDatabasePragmas(db);

  const currentVersion = await getUserVersion(db);

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  const pendingMigrations = MIGRATIONS.filter(
    (migration) => migration.version > currentVersion,
  ).sort((left, right) => left.version - right.version);

  await runInTransaction(db, async (txn) => {
    for (const migration of pendingMigrations) {
      await migration.up(txn);
      await setUserVersion(txn, migration.version);
    }
  });
}
