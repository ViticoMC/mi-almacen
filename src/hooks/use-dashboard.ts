import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useDataRevision } from "@/database/data-context";
import {
  getDashboardStats,
  listRecentActivity,
  type DashboardActivity,
  type DashboardStats,
} from "@/database/repositories/dashboard.repository";
import { listProducts } from "@/database/repositories/products.repository";
import type { Product } from "@/database/types";

export function useDashboard(activityLimit = 5) {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [activity, setActivity] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      getDashboardStats(db),
      listProducts(db, { lowStockOnly: true }),
      listRecentActivity(db, activityLimit),
    ])
      .then(([nextStats, nextLowStock, nextActivity]) => {
        if (!active) return;
        setStats(nextStats);
        setLowStock(nextLowStock);
        setActivity(nextActivity);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudo cargar el resumen.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activityLimit, db, revision]);

  return { stats, lowStock, activity, loading, error };
}
