import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { View } from "react-native";
import { usePalette } from "@/theme/colors";
import { AppText } from "./app-text";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export function EmptyState({
  icon = "package-variant",
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const palette = usePalette();

  return (
    <View className="items-center justify-center gap-3 px-6 py-12">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
        <MaterialCommunityIcons name={icon} size={26} color={palette.accent} />
      </View>
      <AppText variant="title" className="text-center">
        {title}
      </AppText>
      {description ? (
        <AppText variant="muted" className="text-center">
          {description}
        </AppText>
      ) : null}
      {action}
    </View>
  );
}
