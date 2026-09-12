import { StatusBar } from "expo-status-bar";
import { Text, useColorScheme, View } from "react-native";

export default function MovementsScreen() {
    const scheme = useColorScheme();

    return (
        <View className="flex-1 px-5 pt-6 bg-background">
            <StatusBar style={scheme === "dark" ? "light" : "dark"} />
            <View className="gap-2 mt-9 mb-6">
                <Text className="text-eyebrow uppercase text-accent">
                    Operacion futura
                </Text>
                <Text className="text-title text-content">
                    Movimientos
                </Text>
                <Text className="text-subtitle text-content-muted max-w-[360px]">
                    Ajustes, entradas y salidas se habilitan despues de la base visual.
                </Text>
            </View>
            <View className="p-[18px] rounded-3xl border bg-surface border-border">
                <Text className="text-button-label text-content">Lista de actividades</Text>
                <Text className="text-body-muted text-content-muted">
                    Esta vista servira como panel de auditoria y control del flujo.
                </Text>
            </View>
        </View>
    );
}