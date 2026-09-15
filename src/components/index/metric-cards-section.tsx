import { Colors } from "@/constants/theme";
import { cn } from "@/utils/cn";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";
import type { DashboardMetrics, MetricTone, ThemePalette } from "./types";

type MetricCardProps = {
    label: string;
    value: string;
    detail: string;
    tone: MetricTone;
};

const formatMetricValue = (value: number) =>
    new Intl.NumberFormat("es-MX", {
        maximumFractionDigits: 0,
    }).format(Math.max(0, Math.round(value)));

const metricIconMap = {
    primary: "package-variant-closed",
    warning: "alert-circle-outline",
    success: "tray-arrow-down",
    neutral: "tray-arrow-up",
} as const;

export default function MetricCardsSection({ metrics }: { metrics: DashboardMetrics }) {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];

    const dashboardCards = [
        {
            label: "Productos",
            value: formatMetricValue(metrics.totalProducts),
            detail: metrics.totalProducts > 0 ? `${metrics.totalProducts} activos` : "Sin productos activos",
            tone: "primary" as const,
        },
        {
            label: "Stock critico",
            value: formatMetricValue(metrics.lowStock),
            detail: metrics.lowStock > 0 ? "Revisar hoy" : "Todo en orden",
            tone: "warning" as const,
        },
        {
            label: "Entradas hoy",
            value: formatMetricValue(metrics.entriesToday),
            detail: "Compras y ajustes",
            tone: "success" as const,
        },
        {
            label: "Salidas hoy",
            value: formatMetricValue(metrics.exitsToday),
            detail: "Ventas registradas",
            tone: "neutral" as const,
        },
    ];

    return (
        <View className="flex-row flex-wrap gap-3">
            {dashboardCards.map((card) => (
                <MetricCard key={card.label} {...card} palette={palette} />
            ))}
        </View>
    );
}

function MetricCard({ label, value, detail, tone, palette }: MetricCardProps & { palette: ThemePalette }) {
    const iconName = metricIconMap[tone];
    const iconColor =
        tone === "warning" ? "#F59E0B"
            : tone === "success" ? "#16A34A"
                : tone === "neutral" ? palette.textMuted
                    : palette.accent;

    return (
        <View className="bg-surface basis-[48%] grow min-w-[150px] rounded-3xl p-4 gap-2">
            <View className="flex-row items-center justify-between">
                <View
                    className={cn(
                        "w-11 h-1.5 rounded-full",
                        tone === "primary" && "bg-accent",
                        tone === "warning" && "bg-warning",
                        tone === "success" && "bg-success",
                        tone === "neutral" && "bg-content-muted"
                    )}
                />
                <MaterialCommunityIcons name={iconName} size={20} color={iconColor} />
            </View>
            <Text className="text-metric-value text-content">{value}</Text>
            <Text className="text-chip uppercase text-content-muted">
                {label}
            </Text>
            <Text className="text-body-muted text-content-muted">
                {detail}
            </Text>
        </View>
    );
}