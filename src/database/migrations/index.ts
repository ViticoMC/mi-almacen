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
