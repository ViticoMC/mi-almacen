import { Stack } from "expo-router";
import { useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DatabaseProvider } from "../database";
import "../global.css";

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <View className={scheme === "dark" ? "flex-1 dark" : "flex-1"}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}