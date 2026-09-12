import type { SQLiteDatabase } from "expo-sqlite";
import { Platform } from "react-native";

export async function enableDatabasePragmas(db: SQLiteDatabase) {
  await db.execAsync("PRAGMA foreign_keys = ON;");
  await db.execAsync("PRAGMA journal_mode = WAL;");
}

export async function getUserVersion(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );

  return result?.user_version ?? 0;
}

export async function setUserVersion(db: SQLiteDatabase, version: number) {
  await db.execAsync(`PRAGMA user_version = ${version};`);
}

export async function runInTransaction(
  db: SQLiteDatabase,
  task: (txn: SQLiteDatabase) => Promise<void>,
) {
  if (Platform.OS === "web") {
    // await db.withTransactionAsync(task);
    return;
  }

  await db.withExclusiveTransactionAsync(task);
}
