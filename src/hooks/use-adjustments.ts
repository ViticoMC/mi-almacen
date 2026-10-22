import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useDataRevision } from "@/database/data-context";
import {
  listAdjustments,
  type AdjustmentListItem,
} from "@/database/repositories/adjustments.repository";

export function useAdjustments(limit = 50) {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();

  const [adjustments, setAdjustments] = useState<AdjustmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listAdjustments(db, limit)
      .then((rows) => {
        if (!active) return;
        setAdjustments(rows);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudieron cargar los ajustes.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, limit, revision]);

  return { adjustments, loading, error };
}
