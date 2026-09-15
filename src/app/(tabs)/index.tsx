import { getDashboardSummary, listRecentMovements } from "@/database";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AlertsSection from "@/components/index/alerts-section";
import DashboardHeader from "@/components/index/dashboard-header";
import MetricCardsSection from "@/components/index/metric-cards-section";
import QuickActionsSection from "@/components/index/quick-actions-section";
import RecentMovementsSection from "@/components/index/recent-movements-section";
import type { DashboardMetrics, RecentMovement } from "@/components/index/types";

const defaultMetrics: DashboardMetrics = {
    totalProducts: 0,
    lowStock: 0,
    entriesToday: 0,
    exitsToday: 0,
};

export default function Index() {
    const scheme = useColorScheme();
    const db = useSQLiteContext();
    const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
    const [recentMovements, setRecentMovements] = useState<RecentMovement[]>([]);

    useEffect(() => {
        let isMounted = true;

        async function loadDashboardMetrics() {
            try {
                const [summary, movements] = await Promise.all([
                    getDashboardSummary(db),
                    listRecentMovements(db, 5),
                ]);

                if (!isMounted) {
                    return;
                }
                setMetrics(summary);
                setRecentMovements(movements);
            } catch (error) {
                console.warn("No se pudieron cargar las métricas del dashboard:", error);
                if (isMounted) {
                    setMetrics(defaultMetrics);
                    setRecentMovements([]);
                }
            }
        }

        loadDashboardMetrics();

        return () => {
            isMounted = false;
        };
    }, [db]);

    return (
        <View className="flex-1 bg-background">
            <StatusBar style={scheme === "dark" ? "light" : "dark"} />
            <SafeAreaView edges={["top"]} className="flex-1">
                <ScrollView contentContainerClassName="px-5 pt-3 pb-[132px] gap-5" showsVerticalScrollIndicator={false}>
                    <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
                        <View className="absolute w-[260px] h-[260px] rounded-full bg-accent/18 -top-20 -right-10 opacity-[0.24]" />
                        <View className="absolute w-[220px] h-[220px] rounded-full bg-warning/14 top-[280px] -left-[100px] opacity-[0.24]" />
                    </View>

                    <DashboardHeader />
                    <MetricCardsSection metrics={metrics} />
                    <QuickActionsSection />
                    <RecentMovementsSection recentMovements={recentMovements} />
                    <AlertsSection lowStock={metrics.lowStock} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}