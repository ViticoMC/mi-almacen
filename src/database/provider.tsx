import { SQLiteProvider } from "expo-sqlite";
import type { ReactNode } from "react";
import { migrateDatabase } from "./migrations";
import { DATABASE_NAME } from "./schema";

type DatabaseProviderProps = {
    children: ReactNode;
};

export function DatabaseProvider({ children }: DatabaseProviderProps) {
    return (
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDatabase}>
            {children}
        </SQLiteProvider>
    );
}