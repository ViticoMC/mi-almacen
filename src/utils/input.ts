export function sanitizeDecimalInput(text: string, maxDecimals = 3): string {
  const cleaned = text.replace(/[^0-9.,]/g, "").replace(/\./g, ",");
  const [integer, ...decimals] = cleaned.split(",");
  return decimals.length > 0
    ? `${integer},${decimals.join("").slice(0, maxDecimals)}`
    : integer;
}

export function sanitizeMoneyInput(text: string): string {
  return text.replace(/\D/g, "");
}
