import { Platform } from "react-native";

export const Colors = {
  light: {
    background: "#F5F7FB",
    surface: "rgba(255, 255, 255, 0.92)",
    surfaceStrong: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    accent: "#0A5FD8",
    accentSoft: "rgba(10, 95, 216, 0.16)",
    border: "rgba(15, 23, 42, 0.08)",
    shadow: "rgba(15, 23, 42, 0.08)",
  },
  dark: {
    background: "#07111F",
    surface: "rgba(12, 20, 34, 0.9)",
    surfaceStrong: "#0C1422",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    accent: "#4BA3FF",
    accentSoft: "rgba(75, 163, 255, 0.18)",
    border: "rgba(148, 163, 184, 0.12)",
    shadow: "rgba(0, 0, 0, 0.28)",
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "sans-serif",
    rounded: "sans-serif",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;
