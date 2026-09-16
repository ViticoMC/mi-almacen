import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";

const quickActions: {
    title: string;
    description: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    route: "/(tabs)/inventory" | "/(tabs)/movements";
    params?: Record<string, string>;
}[] = [
    {
        title: "Nuevo producto",
        description: "Abre el formulario base para altas futuras.",
        icon: "plus-box-outline",
        route: "/(tabs)/inventory",
        params: { openForm: "true" },
    },
    {
        title: "Registrar compra",
        description: "Preparado para el flujo de entradas.",
        icon: "cart-arrow-down",
        route: "/(tabs)/movements",
        params: { openForm: "true", movementType: "IN" },
    },
    {
        title: "Ver inventario",
        description: "Entrada futura al listado principal.",
        icon: "view-list-outline",
        route: "/(tabs)/inventory",
    },
];

export default function QuickActionsSection() {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const router = useRouter();

    return (
        <View className="gap-3">
            <View className="gap-3">
                {quickActions.map((action) => (
                    <Pressable
                        key={action.title}
                        accessibilityRole="button"
                        className="flex-row items-center gap-3.5 rounded-3xl p-4 border bg-surface border-border"
                        style={({ pressed }) => pressed ? { transform: [{ scale: 0.98 }] } : undefined}
                        onPress={() => {
                            router.push({
                                pathname: action.route,
                                params: action.params,
                            });
                        }}
                    >
                        <View className="w-12 h-12 rounded-2xl items-center justify-center bg-accent/10">
                            <MaterialCommunityIcons name={action.icon} size={22} color={palette.accent} />
                        </View>
                        <View className="flex-1 gap-1">
                            <Text className="text-button-label text-content">{action.title}</Text>
                            <Text className="text-body-muted text-content-muted">
                                {action.description}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}