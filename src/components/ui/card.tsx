import type { PropsWithChildren } from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/utils/cn";

export function Card({ className, children, ...rest }: PropsWithChildren<ViewProps>) {
  return (
    <View className={cn("rounded-2xl border border-border bg-surface p-4", className)} {...rest}>
      {children}
    </View>
  );
}
