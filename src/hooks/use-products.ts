import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useDataRevision } from "@/database/data-context";
import {
  getProduct,
  listProducts,
} from "@/database/repositories/products.repository";
import type { Product } from "@/database/types";

export function useProducts(
  options: {
    search?: string;
    lowStockOnly?: boolean;
    includeArchived?: boolean;
  } = {},
) {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();
  const search = options.search ?? "";
  const lowStockOnly = options.lowStockOnly ?? false;
  const includeArchived = options.includeArchived ?? false;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listProducts(db, { search, lowStockOnly, includeArchived })
      .then((rows) => {
        if (!active) return;
        setProducts(rows);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "No se pudieron cargar los productos.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, includeArchived, revision, search, lowStockOnly]);

  return { products, loading, error };
}

export function useProduct(id: string | undefined) {
  const db = useSQLiteContext();
  const { revision } = useDataRevision();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let active = true;

    getProduct(db, id)
      .then((row) => {
        if (!active) return;
        setProduct(row);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "No se pudo cargar el producto.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, id, revision]);

  return {
    product: id ? product : null,
    loading: id ? loading : false,
    error: id ? error : null,
  };
}
