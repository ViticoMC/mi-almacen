import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DatabaseProvider } from "@/database";
import { usePalette } from "@/theme/colors";
import "../global.css";

export default function RootLayout() {
  const palette = usePalette();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        <StatusBar style="dark" />
        <DatabaseProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              headerStyle: { backgroundColor: palette.background },
              headerTintColor: palette.content,
              headerTitleStyle: { fontWeight: "700" },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: palette.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="product/new"
              options={{
                headerShown: true,
                presentation: "modal",
                title: "Nuevo producto",
              }}
            />
            <Stack.Screen
              name="product/[id]/index"
              options={{ headerShown: true, title: "Producto" }}
            />
            <Stack.Screen
              name="product/[id]/edit"
              options={{
                headerShown: true,
                presentation: "modal",
                title: "Editar producto",
              }}
            />
            <Stack.Screen
              name="purchase/new"
              options={{
                headerShown: true,
                presentation: "modal",
                title: "Registrar compra",
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </DatabaseProvider>
      </View>
    </GestureHandlerRootView>
  );
}
