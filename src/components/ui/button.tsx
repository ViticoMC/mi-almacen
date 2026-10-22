import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";
import { AppText } from "./app-text";

const variants = {
  primary: { container: "bg-accent", label: "text-on-accent" },
  secondary: { container: "bg-accent-soft", label: "text-accent" },
  outline: { container: "border border-border bg-surface", label: "text-content" },
  ghost: { container: "bg-transparent", label: "text-content-muted" },
  danger: { container: "bg-danger", label: "text-white" },
} as const;

const sizes = {
  sm: "rounded-lg px-3 py-2",
  md: "rounded-xl px-4 py-3",
  lg: "rounded-2xl px-5 py-4",
} as const;

export interface ButtonProps extends Omit<PressableProps, "children"> {
  label: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  className,
  style,
  ...rest
}: ButtonProps) {
  const palette = usePalette();
  const isDisabled = disabled || loading;
  const indicatorColor =
    variant === "primary"
      ? palette.onAccent
      : variant === "danger"
        ? "#ffffff"
        : palette.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(
        "flex-row items-center justify-center gap-2",
        variants[variant].container,
        sizes[size],
        isDisabled && "opacity-40",
        className,
      )}
      style={({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
        pressed && !isDisabled ? { opacity: 0.85, transform: [{ scale: 0.96 }] } : null,
        style as StyleProp<ViewStyle>,
      ]}
      {...rest}
    >
      {loading ? <ActivityIndicator color={indicatorColor} /> : icon}
      {!loading ? (
        <AppText variant="body" className={cn("font-semibold", variants[variant].label)}>
          {label}
        </AppText>
      ) : null}
    </Pressable>
  );
}
