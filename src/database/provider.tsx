import { SQLiteProvider } from "expo-sqlite";
import { Suspense, type PropsWithChildren } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { usePalette } from "@/theme/colors";
import { DataProvider } from "./data-context";
import { DATABASE_NAME, migrateDatabase } from "./migrations";

function DatabaseFallback() {
  const palette = usePalette();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        backgroundColor: palette.background,
      }}
    >
      <ActivityIndicator color={palette.accent} />
      <Text style={{ color: palette.contentMuted }}>Preparando el almacén…</Text>
    </View>
  );
}

export function DatabaseProvider({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={<DatabaseFallback />}>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDatabase} useSuspense>
        <DataProvider>{children}</DataProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
