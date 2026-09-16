import MovementSummaryCard from "@/components/movements/movement-summary-card";
import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import type { MovementView } from "@/utils/movement-presentation";

type MovementRowProps = {
    movement: MovementView;
};

function MovementRow({ movement }: MovementRowProps) {
    const router = useRouter();

    return (
        <View className="rounded-[22px] border p-4 bg-surface border-border">
            <MovementSummaryCard
                title={movement.productName}
                subtitle={`${movement.dateLabel} • ${movement.typeLabel} · ${movement.referenceLabel}`}
                totalText={movement.totalText}
                deltaText={`${movement.amountText} u.`}
                isOutgoing={movement.isOutgoing}
                icon={movement.icon}
                iconColor={movement.iconColor}
                action={
                    <Pressable
                        onPress={() => {
                            router.push({
                                pathname: "/movement/[referenceType]/[referenceId]",
                                params: {
                                    referenceType: movement.referenceType,
                                    referenceId: movement.referenceId,
                                },
                            });
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Ver detalles de ${movement.referenceLabel} de ${movement.productName}`}
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

export default memo(MovementRow);
