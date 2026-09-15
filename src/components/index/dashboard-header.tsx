import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";

export default function DashboardHeader() {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];

    return (
        <View className="gap-4 pt-2">
            <View className="gap-2">
                <Text className="text-eyebrow uppercase text-accent">
                    Panel operativo
                </Text>
                <View className="flex-row items-center gap-2.5">
                    <View className="w-[42px] h-[42px] rounded-[16px] items-center justify-center bg-accent-soft">
                        <MaterialCommunityIcons name="storefront-outline" size={22} color={palette.accent} />
                    </View>
                    <Text className="text-title text-content mt-0.5">
                        Mi almacen
                    </Text>
                </View>
                <Text className="text-subtitle text-content-muted max-w-[540px]">
                    Control visual de inventario, compras y ventas desde una sola entrada.
                </Text>
            </View>
        </View>
    );
}