import { View } from "react-native";
import { cn } from "@/utils/cn";
import { AppText } from "./app-text";

const tones = {
  neutral: "bg-background",
  accent: "bg-accent-soft",
  success: "bg-success/10",
  warning: "bg-warning/10",
  danger: "bg-danger/10",
} as const;

const labels = {
  neutral: "text-content-muted",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <View className={cn("rounded-full px-2.5 py-1", tones[tone], className)}>
      <AppText variant="caption" className={cn("font-semibold", labels[tone])}>
        {label}
      </AppText>
    </View>
  );
}
