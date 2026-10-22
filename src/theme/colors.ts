export const palette = {
  background: "#f8f6f2",
  surface: "#ffffff",
  surfaceStrong: "#ffffff",
  content: "#26231e",
  contentMuted: "#7b756b",
  accent: "#745c42",
  onAccent: "#ffffff",
  accentSoft: "#f1e9df",
  border: "#e8e2d8",
  shadow: "rgba(38, 35, 30, 0.07)",
  success: "#4e7a5a",
  warning: "#a9762e",
  danger: "#b2543b",
} as const;

export type Palette = { [K in keyof typeof palette]: string };

export function usePalette(): Palette {
  return palette;
}
