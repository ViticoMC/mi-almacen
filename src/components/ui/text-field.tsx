import { forwardRef } from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";
import { AppText } from "./app-text";

export interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, hint, className, ...rest },
  ref,
) {
  const palette = usePalette();

  return (
    <View className="gap-1.5">
      {label ? <AppText variant="label">{label}</AppText> : null}
      <TextInput
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-surface px-4 py-3 text-body text-content",
          error && "border-danger",
          className,
        )}
        placeholderTextColor={palette.contentMuted}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" className="text-danger">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption">{hint}</AppText>
      ) : null}
    </View>
  );
});
