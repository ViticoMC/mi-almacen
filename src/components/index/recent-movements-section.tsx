import MovementSummaryCard from "@/components/movements/movement-summary-card";
import { Colors } from "@/constants/theme";
import { cn } from "@/utils/cn";
import { formatMovementDate, getReferenceLabel } from "@/utils/movement-presentation";
import { useRouter } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";
import type { RecentMovement, ThemePalette } from "./types";

const quantityFormatter = new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
});

const moneyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
});

export default function RecentMovementsSection({ recentMovements }: { recentMovements: RecentMovement[] }) {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const router = useRouter();

    const openDetail = (referenceType: string, referenceId: string) => {
        router.push({
            pathname: "/movement/[referenceType]/[referenceId]",
            params: { referenceType, referenceId },
        });
    };

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
                            onViewDetails={openDetail}
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
    onViewDetails,
}: {
    movement: RecentMovement;
    divider: boolean;
    palette: ThemePalette;
    onViewDetails: (referenceType: string, referenceId: string) => void;
}) {
    const isOutgoing =
        movement.movement_type === "OUT" || movement.movement_type === "ADJUSTMENT_OUT";
    const movementIconColor = isOutgoing ? "#F59E0B" : palette.accent;
    const quantity = Number(movement.quantity || 0);
    const hasTotal =
        movement.unit_cost !== null &&
        movement.unit_cost !== undefined &&
        Number.isFinite(Number(movement.unit_cost));
    const total = quantity * Number(movement.unit_cost || 0);

    return (
        <View className={cn("px-[18px] py-4", divider && "border-b border-content-muted/12")}>
            <MovementSummaryCard
                title={getReferenceLabel(movement.reference_type)}
                subtitle={`${formatMovementDate(movement.movement_date)} • ${quantityFormatter.format(quantity)} u.`}
                totalText={hasTotal ? moneyFormatter.format(total) : "—"}
                deltaText={`${isOutgoing ? "-" : "+"}${quantityFormatter.format(quantity)}`}
                isOutgoing={isOutgoing}
                icon={isOutgoing ? "tray-arrow-up" : "tray-arrow-down"}
                iconColor={movementIconColor}
                action={
                    <Pressable
                        onPress={() => onViewDetails(movement.reference_type, movement.reference_id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Ver detalles de ${getReferenceLabel(movement.reference_type)}`}
                        hitSlop={8}
                        className="rounded-xl py-2.5 items-center justify-center bg-accent-soft"
                        style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
                    >
                        <Text className="text-chip uppercase text-accent">Ver detalles</Text>
                    </Pressable>
                }
            />
        </View>
    );
}