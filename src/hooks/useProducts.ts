import type { SQLiteDatabase } from "expo-sqlite";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    forceRefreshProducts,
    getCachedProducts,
    loadProducts,
    subscribeProducts,
} from "@/data/products-store";
import type { ProductWithMetrics } from "@/database";
import { deferUntilInteractions } from "@/utils/interactions";

export { forceRefreshProducts };

type UseProductsOptions = {
    /** When false, the hook subscribes to product updates without fetching on mount. */
    autoLoad?: boolean;
};

type RefreshOptions = {
    force?: boolean;
};

/**
 * Product list state backed by a shared cache.
 *
 * The first mount defers SQLite work until tab interactions settle. Cached
 * rows are shown immediately on later visits, while mutations refresh every
 * subscriber through the same deduplicated request.
 */
export function useProducts(db: SQLiteDatabase, options?: UseProductsOptions) {
    const autoLoad = options?.autoLoad ?? true;
    const [products, setProducts] = useState<ProductWithMetrics[]>(() => getCachedProducts(db) ?? []);
    const [loading, setLoading] = useState<boolean>(() => autoLoad && getCachedProducts(db) === null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const refresh = useCallback(
        async (refreshOptions?: RefreshOptions): Promise<ProductWithMetrics[]> => {
            const fallback = getCachedProducts(db) ?? [];

            if (!isMountedRef.current) {
                return fallback;
            }

            const hasCache = fallback.length > 0 || getCachedProducts(db) !== null;

            if (!hasCache) {
                setLoading(true);
            }

            try {
                const rows = await loadProducts(db, { force: refreshOptions?.force });

                if (!isMountedRef.current) {
                    return rows;
                }

                setProducts(rows);
                return rows;
            } catch (error) {
                console.warn("No se pudieron cargar los productos:", error);

                if (!isMountedRef.current) {
                    return fallback;
                }

                if (!hasCache) {
                    setProducts([]);
                }

                return fallback;
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        },
        [db],
    );

    useEffect(() => {
        const unsubscribe = subscribeProducts(() => {
            void refresh({ force: true });
        });

        if (!autoLoad) {
            return unsubscribe;
        }

        const cancelDeferredLoad = deferUntilInteractions(() => {
            void refresh();
        });

        return () => {
            cancelDeferredLoad();
            unsubscribe();
        };
    }, [autoLoad, db, refresh]);

    const reloadProducts = useCallback(async (): Promise<void> => {
        await refresh({ force: true });
    }, [refresh]);
    const ensureProducts = useCallback((): Promise<ProductWithMetrics[]> => refresh(), [refresh]);

    return { products, loading, reloadProducts, ensureProducts };
}
