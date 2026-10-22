export function roundQuantity(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1000) / 1000;
}

export function parseQuantityInput(input: string): number {
  const normalized = input.replace(",", ".").trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? roundQuantity(parsed) : 0;
}

export function formatQuantity(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const rounded = roundQuantity(value);
  const [integer, decimals] = Math.abs(rounded).toFixed(3).split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const trimmed = decimals.replace(/0+$/, "");
  const sign = rounded < 0 ? "-" : "";
  return trimmed ? `${sign}${grouped},${trimmed}` : `${sign}${grouped}`;
}
