import { cn } from "@/utils/cn";
import type { MovementIconName } from "@/utils/movement-presentation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

type MovementSummaryCardProps = {
    title: string;
    subtitle: string;
    totalText: string;
    deltaText: string;
    isOutgoing: boolean;
    icon: MovementIconName;
    iconColor: string;
    action?: ReactNode;
};

/**
 * Ficha resumen de un movimiento: título, fecha + cantidad, total y delta.
 *
 * Se usa igual en Inicio (últimos movimientos) y en Movimientos para
 * mantener una sola presentación en toda la app.
 */
export default function MovementSummaryCard({
    title,
    subtitle,
    totalText,
    deltaText,
    isOutgoing,
    icon,
    iconColor,
    action,
}: MovementSummaryCardProps) {
    return (
        <View className="gap-2.5">
            <View className="flex-row items-center justify-between gap-4">
                <View className="flex-1 flex-row items-start gap-2.5">
                    <View
                        className={cn(
                            "w-2.5 h-2.5 rounded-full mt-1.5",
                            isOutgoing ? "bg-warning" : "bg-accent",
                        )}
                    />
                    <MaterialCommunityIcons
                        name={icon}
                        size={18}
                        color={iconColor}
                        style={{ marginTop: 3 }}
                    />
                    <View className="flex-1 gap-1">
                        <Text className="text-button-label text-content">{title}</Text>
                        <Text className="text-body-muted text-content-muted">{subtitle}</Text>
                    </View>
                </View>
                <View className="items-end gap-1">
                    <Text className="text-button-label text-content">{totalText}</Text>
                    <Text
                        className={cn(
                            "text-chip uppercase",
                            isOutgoing ? "text-warning" : "text-accent",
                        )}
                    >
                        {deltaText}
                    </Text>
                </View>
            </View>
            {action}
        </View>
    );
}
