export const MAX_MARGIN_PERCENT = 29.9;

export function roundMoney(value: number): number {
  return Math.round(Number.isFinite(value) ? value : 0);
}

export function clampMargin(marginPercent: number): number {
  if (!Number.isFinite(marginPercent)) return 0;
  return Math.min(Math.max(marginPercent, 0), MAX_MARGIN_PERCENT);
}

export function effectiveMargin(cost: number, price: number): number {
  if (cost <= 0) return 0;
  return ((price - cost) / cost) * 100;
}

export function calculateSalePrice(cost: number, marginPercent: number): number {
  if (cost <= 0) return 0;

  const margin = clampMargin(marginPercent);
  const raw = cost * (1 + margin / 100);

  if (margin === 0) {
    return roundMoney(raw);
  }

  const roundedUp = Math.ceil(raw / 5) * 5;

  if (roundedUp > 0 && effectiveMargin(cost, roundedUp) < 30) {
    return roundedUp;
  }

  let previousMultiple = roundedUp - 5;
  while (previousMultiple > 0 && effectiveMargin(cost, previousMultiple) >= 30) {
    previousMultiple -= 5;
  }
  if (previousMultiple > 0) {
    return previousMultiple;
  }

  let fallback = roundMoney(raw);
  while (fallback > 0 && effectiveMargin(cost, fallback) >= 30) {
    fallback -= 1;
  }
  return fallback;
}

export function formatMoney(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}$ ${digits}`;
}

export function parseMoneyInput(input: string): number {
  const digits = input.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(decimals).replace(".", ",")}%`;
}
