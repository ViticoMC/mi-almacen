import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { Text, View } from "react-native";
import { cn } from "@/utils/cn";
import type { MovementView } from "@/utils/movement-presentation";

type MovementRowProps = {
    movement: MovementView;
};

function MovementRow({ movement }: MovementRowProps) {
    return (
        <View className="rounded-[22px] border p-4 bg-surface border-border gap-2.5">
            <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 flex-row items-start gap-2.5">
                    <View
                        className={cn(
                            "w-2.5 h-2.5 rounded-full mt-1.5",
                            movement.isOutgoing ? "bg-warning" : "bg-accent",
                        )}
                    />
                    <MaterialCommunityIcons
                        name={movement.icon}
                        size={18}
                        color={movement.iconColor}
                        style={{ marginTop: 2 }}
                    />
                    <View className="flex-1 gap-1">
                        <Text className="text-button-label text-content">{movement.productName}</Text>
                        <Text className="text-body-muted text-content-muted">
                            {movement.typeLabel} · {movement.referenceLabel}
                        </Text>
                    </View>
                </View>
                <Text
                    className={cn(
                        "text-chip uppercase",
                        movement.isOutgoing ? "text-warning" : "text-accent",
                    )}
                >
                    {movement.amountText}
                </Text>
            </View>

            <View className="flex-row items-center justify-between gap-3">
                <Text className="text-body-muted text-content-muted">{movement.dateLabel}</Text>
                <Text className="text-body-muted text-content-muted">{movement.costText}</Text>
            </View>

            {movement.notes ? (
                <Text className="text-body-muted text-content-muted">{movement.notes}</Text>
            ) : null}
        </View>
    );
}

export default memo(MovementRow);
