import { Text, type TextProps } from "react-native";
import { cn } from "@/utils/cn";

const variants = {
  hero: "text-title text-content",
  title: "text-section-title text-content",
  body: "text-body text-content",
  muted: "text-body-muted text-content-muted",
  label: "text-body-muted text-content",
  caption: "text-chip text-content-muted",
  eyebrow: "text-eyebrow text-content-muted uppercase",
  metric: "text-metric-value text-content",
} as const;

export type TextVariant = keyof typeof variants;

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
}

export function AppText({ variant = "body", className, ...rest }: AppTextProps) {
  return <Text className={cn(variants[variant], className)} {...rest} />;
}
