export type DashboardMetrics = {
  totalProducts: number;
  lowStock: number;
  entriesToday: number;
  exitsToday: number;
};

export type RecentMovement = {
  id: string;
  product_id: string;
  movement_type: string;
  quantity: number;
  unit_cost: number | null;
  reference_type: string;
  reference_id: string;
  movement_date: string;
  notes: string | null;
};

export type MetricTone = "primary" | "warning" | "success" | "neutral";

export type AlertTone = "danger" | "warning" | "info";

export type ThemePalette = {
  background: string;
  surface: string;
  surfaceStrong: string;
  text: string;
  textMuted: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
  border: string;
  shadow: string;
};
