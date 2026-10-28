import { useDataRevision } from "@/database/data-context";
import {
  getCountDetail,
  getLastCount,
  listCounts,
  type CountDetail,
  type CountListItem,
} from "@/database/repositories/counts.repository";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export function useCounts(limit = 20) {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();

  const [entries, setEntries] = useState<CountListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listCounts(db, limit)
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
            : "No se pudo cargar los conteos.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, limit, revision]);

  return { entries, loading, error };
}

export function useCountDetail(id: string | null | undefined) {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();

  const [detail, setDetail] = useState<CountDetail | null>(null);
  const [loading, setLoading] = useState(() => Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;

    getCountDetail(db, id)
      .then((row) => {
        if (!active) return;
        setDetail(row);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudo cargar el conteo.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, id, revision]);

  return { detail, loading, error };
}

export function useLastCount() {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();

  const [count, setCount] = useState<CountListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getLastCount(db)
      .then((row) => {
        if (!active) return;
        setCount(row);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudo cargar el último conteo.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, revision]);

  return { count, loading, error };
}
