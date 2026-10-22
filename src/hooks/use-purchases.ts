import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useDataRevision } from "@/database/data-context";
import {
  listPurchases,
  type PurchaseListItem,
} from "@/database/repositories/purchases.repository";

export function usePurchases(limit = 50) {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();

  const [purchases, setPurchases] = useState<PurchaseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listPurchases(db, limit)
      .then((rows) => {
        if (!active) return;
        setPurchases(rows);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "No se pudieron cargar las compras.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, limit, revision]);

  return { purchases, loading, error };
}
