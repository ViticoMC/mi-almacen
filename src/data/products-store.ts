import type { SQLiteDatabase } from "expo-sqlite";
import { listProducts, type ProductWithMetrics } from "@/database";

type ProductsListener = () => void;

type ProductsCacheEntry = {
    rows: ProductWithMetrics[] | null;
    inflight: Promise<ProductWithMetrics[]> | null;
};

type LoadProductsOptions = {
    force?: boolean;
};

const entries = new WeakMap<SQLiteDatabase, ProductsCacheEntry>();
const listeners = new Set<ProductsListener>();

function entryFor(db: SQLiteDatabase): ProductsCacheEntry {
    const existing = entries.get(db);

    if (existing) {
        return existing;
    }

    const created: ProductsCacheEntry = { rows: null, inflight: null };
    entries.set(db, created);
    return created;
}

/**
 * Shared product cache.
 *
 * Inventory and Movements used to issue the same expensive products query
 * independently. Centralizing rows here keeps one copy, deduplicates
 * concurrent requests, and lets a tab reuse data loaded by another tab.
 */
export function getCachedProducts(db: SQLiteDatabase): ProductWithMetrics[] | null {
    return entryFor(db).rows;
}

export function subscribeProducts(listener: ProductsListener): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

export function notifyProductsChanged(): void {
    for (const listener of Array.from(listeners)) {
        listener();
    }
}

/** Backward-compatible notifier used after product mutations. */
export function forceRefreshProducts(): void {
    notifyProductsChanged();
}

export async function loadProducts(
    db: SQLiteDatabase,
    options?: LoadProductsOptions,
): Promise<ProductWithMetrics[]> {
    const entry = entryFor(db);
    const force = options?.force ?? false;

    if (!force && entry.rows) {
        return entry.rows;
    }

    if (entry.inflight) {
        return entry.inflight;
    }

    const request = listProducts(db).then((rows) => {
        entry.rows = rows;
        return rows;
    });

    entry.inflight = request;

    try {
        return await request;
    } finally {
        if (entry.inflight === request) {
            entry.inflight = null;
        }
    }
}
