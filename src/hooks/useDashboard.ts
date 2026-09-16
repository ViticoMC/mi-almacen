import type { DashboardMetrics, RecentMovement } from "@/components/index/types";
import { getDashboardSummary, listRecentMovements } from "@/database";
import { useFocusEffect } from "expo-router";
import type { SQLiteDatabase } from "expo-sqlite";
import { useCallback, useState } from "react";
import { deferUntilInteractions } from "@/utils/interactions";

const defaultMetrics: DashboardMetrics = {
    totalProducts: 0,
    lowStock: 0,
    entriesToday: 0,
    exitsToday: 0,
};

/**
 * Dashboard data for the home tab.
 *
 * Queries run after tab interactions settle so the first paint and the tab
 * transition do not compete with SQLite work on the JS thread.
 */
export function useDashboard(db: SQLiteDatabase) {
    const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
    const [recentMovements, setRecentMovements] = useState<RecentMovement[]>([]);

    const loadDashboard = useCallback(
        async (isActive: () => boolean = () => true): Promise<void> => {
            try {
                const [summary, movements] = await Promise.all([
                    getDashboardSummary(db),
                    listRecentMovements(db, 5),
                ]);

                if (!isActive()) {
                    return;
                }

                setMetrics(summary);
                setRecentMovements(movements);
            } catch (error) {
                console.warn("No se pudieron cargar las métricas del dashboard:", error);

                if (isActive()) {
                    setMetrics(defaultMetrics);
                    setRecentMovements([]);
                }
            }
        },
        [db],
    );

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const cancelDeferredLoad = deferUntilInteractions(() => {
                if (isActive) {
                    void loadDashboard(() => isActive);
                }
            });

            return () => {
                isActive = false;
                cancelDeferredLoad();
            };
        }, [loadDashboard]),
    );

    return { metrics, recentMovements };
}
