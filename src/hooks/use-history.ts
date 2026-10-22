import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useDataRevision } from "@/database/data-context";
import {
  listHistory,
  type HistoryFilters,
  type HistoryListItem,
} from "@/database/repositories/history.repository";

export function useHistory(filters: HistoryFilters = {}) {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();
  const { type, productId, since } = filters;

  const [entries, setEntries] = useState<HistoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listHistory(db, { type, productId, since })
      .then((rows) => {
        if (!active) return;
        setEntries(rows);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudo cargar el historial.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, productId, revision, since, type]);

  return { entries, loading, error };
}
