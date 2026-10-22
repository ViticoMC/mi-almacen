import type { StyleProp, TextStyle } from "react-native";
import { formatMoney } from "@/database/utils/money";
import { AppText, type TextVariant } from "./app-text";

export function MoneyText({
  value,
  variant = "body",
  className,
  style,
}: {
  value: number | null | undefined;
  variant?: TextVariant;
  className?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <AppText
      variant={variant}
      className={className}
      style={[{ fontVariant: ["tabular-nums"] }, style]}
    >
      {formatMoney(value)}
    </AppText>
  );
}
