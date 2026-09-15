import { Colors } from "@/constants/theme";
import { cn } from "@/utils/cn";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";
import type { RecentMovement, ThemePalette } from "./types";

export default function RecentMovementsSection({ recentMovements }: { recentMovements: RecentMovement[] }) {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];

    return (
        <View className="gap-3">
            <View className="flex-row items-end justify-between gap-4">
                <View className="flex-1 gap-1">
                    <Text className="text-section-title text-content">Ultimos movimientos</Text>
                    <Text className="text-body-muted text-content-muted">
                        Compras, ventas y ajustes recientes del inventario
                    </Text>
                </View>
            </View>

            <View className="rounded-[28px] overflow-hidden bg-surface">
                {recentMovements.length === 0 ? (
                    <View className="px-[18px] py-4 items-center justify-center">
                        <Text className="text-body-muted text-content-muted">
                            Aun no hay movimientos registrados.
                        </Text>
                    </View>
                ) : (
                    recentMovements.map((movement, index) => (
                        <MovementRow
                            key={movement.id}
                            movement={movement}
                            divider={index < recentMovements.length - 1}
                            palette={palette}
                        />
                    ))
                )}
            </View>
        </View>
    );
}

function MovementRow({
    movement,
    divider,
    palette,
}: {
    movement: RecentMovement;
    divider: boolean;
    palette: ThemePalette;
}) {
    const movementIcon = movement.movement_type === "OUT" ? "tray-arrow-up" : "tray-arrow-down";
    const movementIconColor = movement.movement_type === "OUT" ? "#F59E0B" : palette.accent;

    return (
        <View className={cn("flex-row items-center justify-between gap-4 px-[18px] py-4", divider && "border-b border-content-muted/12")}>
            <View className="flex-1 flex-row items-start gap-2.5">
                <View
                    className={cn(
                        "w-2.5 h-2.5 rounded-full mt-1.5",
                        movement.movement_type === "OUT" ? "bg-warning" : "bg-accent"
                    )}
                />
                <MaterialCommunityIcons name={movementIcon} size={18} color={movementIconColor} style={{ marginTop: 3 }} />
                <View className="flex-1 gap-1">
                    <Text className="text-button-label text-content">
                        {movement.reference_type === "PURCHASE" ? "Compra" : movement.reference_type === "SALE" ? "Venta" : "Ajuste"}
                    </Text>
                    <Text className="text-body-muted text-content-muted">
                        {movement.notes ?? "Movimiento de inventario"}
                    </Text>
                </View>
            </View>
            <Text className="text-chip uppercase text-content-muted">
                {movement.movement_type === "OUT" ? "-" : "+"}
                {movement.quantity}
            </Text>
        </View>
    );
}