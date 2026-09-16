import type { ProductWithMetrics } from "@/database";

/**
 * Umbral fijo de bajo stock.
 *
 * Coherente con el dashboard (`getDashboardSummary` usa `<= 10`).
 * TODO: mover a una sección de configuración cuando exista.
 */
export const LOW_STOCK_THRESHOLD = 10;

export type InventoryFilter = "ALL" | "LOW_STOCK";

export type StockStatus = "out" | "low" | "ok";

export function getStockStatus(
  product: Pick<ProductWithMetrics, "current_stock">,
  threshold: number = LOW_STOCK_THRESHOLD,
): StockStatus {
  const stock = Number(product.current_stock || 0);

  if (stock <= 0) {
    return "out";
  }

  if (stock <= threshold) {
    return "low";
  }

  return "ok";
}

export function isLowStock(
  product: Pick<ProductWithMetrics, "current_stock">,
  threshold: number = LOW_STOCK_THRESHOLD,
): boolean {
  return Number(product.current_stock || 0) <= threshold;
}

export function filterProducts(
  products: ProductWithMetrics[],
  filter: InventoryFilter,
  query: string,
  threshold: number = LOW_STOCK_THRESHOLD,
): ProductWithMetrics[] {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    if (filter === "LOW_STOCK" && !isLowStock(product, threshold)) {
      return false;
    }

    if (normalizedQuery.length > 0) {
      const name = (product.name ?? "").toLowerCase();

      if (!name.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });
}
