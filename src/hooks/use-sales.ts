import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useDataRevision } from "@/database/data-context";
import {
  listSales,
  type SaleListItem,
} from "@/database/repositories/sales.repository";

export function useSales(limit = 50) {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();

  const [sales, setSales] = useState<SaleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listSales(db, limit)
      .then((rows) => {
        if (!active) return;
        setSales(rows);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "No se pudieron cargar las ventas.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, limit, revision]);

  return { sales, loading, error };
}
