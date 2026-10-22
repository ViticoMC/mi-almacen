function toDate(timestamp: number): Date | null {
  if (!Number.isFinite(timestamp)) return null;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(timestamp: number): string {
  const date = toDate(timestamp);
  if (!date) return "—";

  return date.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(timestamp: number): string {
  const date = toDate(timestamp);
  if (!date) return "—";

  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
  });
}
