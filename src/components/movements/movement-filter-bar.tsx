import type { ThemePalette } from "@/components/index/types";
import type { MovementFilter } from "@/database";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

export const movementFilterOptions: { value: MovementFilter; label: string }[] = [
    { value: "ALL", label: "Todos" },
    { value: "IN", label: "Entradas" },
    { value: "OUT", label: "Salidas" },
    { value: "ADJUSTMENTS", label: "Ajustes" },
];

type MovementFilterBarProps = {
    filter: MovementFilter;
    onSelect: (filter: MovementFilter) => void;
    palette: ThemePalette;
};

function MovementFilterBar({ filter, onSelect, palette }: MovementFilterBarProps) {
    return (
        <View className="flex-row flex-wrap gap-2 mb-4">
            {movementFilterOptions.map((option) => {
                const isActive = option.value === filter;

                return (
                    <Pressable
                        key={option.value}
                        onPress={() => onSelect(option.value)}
                        className="px-3.5 py-2 rounded-2xl border"
                        style={{
                            backgroundColor: isActive ? palette.accentSoft : palette.surface,
                            borderColor: isActive ? palette.accent : palette.border,
                        }}
                    >
                        <Text
                            className={
                                isActive
                                    ? "text-button-label text-accent"
                                    : "text-button-label text-content"
                            }
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default memo(MovementFilterBar);
