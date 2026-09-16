import type { ThemePalette } from "@/components/index/types";
import type { InventoryFilter } from "@/utils/inventory-filters";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

export type InventoryFilterOption = {
  value: InventoryFilter;
  label: string;
  count: number;
};

type InventoryFilterBarProps = {
  filter: InventoryFilter;
  options: InventoryFilterOption[];
  onSelect: (filter: InventoryFilter) => void;
  palette: ThemePalette;
};

function InventoryFilterBar({ filter, options, onSelect, palette }: InventoryFilterBarProps) {
  return (
    <View className="flex-row flex-wrap gap-2 mb-3">
      {options.map((option) => {
        const isActive = option.value === filter;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Filtrar por ${option.label}`}
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
              {option.label} ({option.count})
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default memo(InventoryFilterBar);
