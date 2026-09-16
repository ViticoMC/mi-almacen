import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Text, useColorScheme, View } from "react-native";

export default function StatisticsScreen() {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];

    return (
        <View className="flex-1 px-5 pt-6 pb-[92px] bg-background">
            <StatusBar style={scheme === "dark" ? "light" : "dark"} />
            <View className="flex-row items-center justify-between mt-9 mb-6 gap-3">
                <View className="flex-1 gap-2">
                    <Text className="text-eyebrow uppercase text-accent">
                        Analitica
                    </Text>
                    <Text className="text-title text-content">
                        Estadisticas
                    </Text>
                    <Text className="text-subtitle text-content-muted max-w-[360px]">
                        Resumen del rendimiento de tu inventario, compras y ventas.
                    </Text>
                </View>
            </View>

            <View className="rounded-[22px] border p-6 items-center gap-2.5 mt-2 bg-surface border-border">
                <MaterialCommunityIcons name="chart-box-outline" size={28} color={palette.accent} />
                <Text className="text-button-label text-content">
                    Aun no hay datos
                </Text>
                <Text className="text-body-muted text-content-muted text-center">
                    Aqui veras graficas y metricas de movimiento, rotacion de stock y desempeno de ventas.
                </Text>
            </View>
        </View>
    );
}