import type { PropsWithChildren } from "react";
import { ScrollView, View, type ScrollViewProps } from "react-native";
import { cn } from "@/utils/cn";

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  className?: string;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
}

export function Screen({
  children,
  scroll = true,
  className,
  contentContainerStyle,
}: ScreenProps) {
  if (!scroll) {
    return <View className={cn("flex-1 bg-background p-4", className)}>{children}</View>;
  }

  return (
    <ScrollView
      className={cn("flex-1 bg-background", className)}
      contentContainerStyle={[{ padding: 16, gap: 16 }, contentContainerStyle]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}
