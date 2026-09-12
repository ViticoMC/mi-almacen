import { Colors } from "@/constants/theme";
import { getDashboardSummary, listRecentMovements } from "@/database";
import { cn } from "@/utils/cn";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DashboardMetrics = {
    totalProducts: number;
    lowStock: number;
    entriesToday: number;
    exitsToday: number;
};

const defaultMetrics: DashboardMetrics = {
    totalProducts: 0,
    lowStock: 0,
    entriesToday: 0,
    exitsToday: 0,
};

const formatMetricValue = (value: number) =>
    new Intl.NumberFormat("es-MX", {
        maximumFractionDigits: 0,
    }).format(Math.max(0, Math.round(value)));

export default function Index() {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const db = useSQLiteContext();
    const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
    const [recentMovements, setRecentMovements] = useState<{
        id: string;
        product_id: string;
        movement_type: string;
        quantity: number;
        reference_type: string;
        movement_date: string;
        notes: string | null;
    }[]>([]);

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

    const dashboardCards = [
        {
            label: "Productos",
            value: formatMetricValue(metrics.totalProducts),
            detail: metrics.totalProducts > 0 ? `${metrics.totalProducts} activos` : "Sin productos activos",
            tone: "primary" as const,
            icon: "package-variant-closed",
        },
        {
            label: "Stock critico",
            value: formatMetricValue(metrics.lowStock),
            detail: metrics.lowStock > 0 ? "Revisar hoy" : "Todo en orden",
            tone: "warning" as const,
            icon: "alert-circle-outline",
        },
        {
            label: "Entradas hoy",
            value: formatMetricValue(metrics.entriesToday),
            detail: "Compras y ajustes",
            tone: "success" as const,
            icon: "tray-arrow-down",
        },
        {
            label: "Salidas hoy",
            value: formatMetricValue(metrics.exitsToday),
            detail: "Ventas registradas",
            tone: "neutral" as const,
            icon: "tray-arrow-up",
        },
    ];

    const alerts = metrics.lowStock > 0
        ? [
            {
                title: `${metrics.lowStock} productos bajo mínimo`,
                description: "Afectan el inventario y requieren reposición prioritaria.",
                status: "Critico",
                tone: "danger" as const,
            },
        ]
        : [
            {
                title: "Inventario estable",
                description: "No hay productos con stock crítico en este momento.",
                status: "Normal",
                tone: "info" as const,
            },
        ];

    return (
        <View className="flex-1 bg-background">
            <StatusBar style={scheme === "dark" ? "light" : "dark"} />
            <SafeAreaView edges={["top"]} className="flex-1">
                <ScrollView contentContainerClassName="px-5 pt-3 pb-[132px] gap-5" showsVerticalScrollIndicator={false}>
                    <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
                        <View className="absolute w-[260px] h-[260px] rounded-full bg-accent/18 -top-20 -right-10 opacity-[0.24]" />
                        <View className="absolute w-[220px] h-[220px] rounded-full bg-warning/14 top-[280px] -left-[100px] opacity-[0.24]" />
                    </View>

                    <View className="gap-4 pt-2">
                        <View className="gap-2">
                            <Text className="text-eyebrow uppercase text-accent">
                                Panel operativo
                            </Text>
                            <View className="flex-row items-center gap-2.5">
                                <View className="w-[42px] h-[42px] rounded-[16px] items-center justify-center bg-accent-soft">
                                    <MaterialCommunityIcons name="storefront-outline" size={22} color={palette.accent} />
                                </View>
                                <Text className="text-title text-content mt-0.5">
                                    Mi almacen
                                </Text>
                            </View>
                            <Text className="text-subtitle text-content-muted max-w-[540px]">
                                Control visual de inventario, compras y ventas desde una sola entrada.
                            </Text>
                        </View>

                    </View>

                    <View className="flex-row flex-wrap gap-3">
                        {dashboardCards.map((card) => (
                            <MetricCard key={card.label} {...card} />
                        ))}
                    </View>

                    <View className="gap-3">

                        <View className="gap-3">
                            {quickActions.map((action) => (
                                <Pressable
                                    key={action.title}
                                    accessibilityRole="button"
                                    className="flex-row items-center gap-3.5 rounded-3xl p-4 border bg-surface border-border"
                                    style={({ pressed }) => pressed ? { transform: [{ scale: 0.98 }] } : undefined}
                                >
                                    <View className="w-12 h-12 rounded-2xl items-center justify-center bg-accent/10">
                                        <MaterialCommunityIcons name={action.icon} size={22} color={palette.accent} />
                                    </View>
                                    <View className="flex-1 gap-1">
                                        <Text className="text-button-label text-content">{action.title}</Text>
                                        <Text className="text-body-muted text-content-muted">
                                            {action.description}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View className="gap-3">
                        <View className="flex-row items-end justify-between gap-4">
                            <View className="flex-1 gap-1">
                                <Text className="text-section-title text-content">Ultimos movimientos</Text>
                                <Text className="text-body-muted text-content-muted">
                                    Compras, ventas y ajustes recientes del inventario
                                </Text>
                            </View>
                        </View>

                        <View className="rounded-[28px] overflow-hidden bg-surface">
                            {recentMovements.length === 0 ? (
                                <View className="px-[18px] py-4 items-center justify-center">
                                    <Text className="text-body-muted text-content-muted">
                                        Aun no hay movimientos registrados.
                                    </Text>
                                </View>
                            ) : (
                                recentMovements.map((movement, index) => (
                                    <View
                                        key={movement.id}
                                        className={cn(
                                            "flex-row items-center justify-between gap-4 px-[18px] py-4",
                                            index < recentMovements.length - 1 && "border-b border-content-muted/12"
                                        )}
                                    >
                                        <View className="flex-1 flex-row items-start gap-2.5">
                                            <View
                                                className={cn(
                                                    "w-2.5 h-2.5 rounded-full mt-1.5",
                                                    movement.movement_type === "OUT" ? "bg-warning" : "bg-accent"
                                                )}
                                            />
                                            <MaterialCommunityIcons
                                                name={movement.movement_type === "OUT" ? "tray-arrow-up" : "tray-arrow-down"}
                                                size={18}
                                                color={movement.movement_type === "OUT" ? "#F59E0B" : palette.accent}
                                                style={{ marginTop: 3 }}
                                            />
                                            <View className="flex-1 gap-1">
                                                <Text className="text-button-label text-content">
                                                    {movement.reference_type === "PURCHASE" ? "Compra" : movement.reference_type === "SALE" ? "Venta" : "Ajuste"}
                                                </Text>
                                                <Text className="text-body-muted text-content-muted">
                                                    {movement.notes ?? "Movimiento de inventario"}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text className="text-chip uppercase text-content-muted">
                                            {movement.movement_type === "OUT" ? "-" : "+"}
                                            {movement.quantity}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>

                    <View className="gap-3">
                        <View className="flex-row items-end justify-between gap-4">
                            <View className="flex-1 gap-1">
                                <Text className="text-section-title text-content">Alertas activas</Text>
                                <Text className="text-body-muted text-content-muted">
                                    Lo que exige atencion antes de cerrar el dia
                                </Text>
                            </View>
                        </View>

                        <View className="rounded-[28px] overflow-hidden bg-surface">
                            {alerts.map((alert, index) => (
                                <AlertRow
                                    key={alert.title}
                                    title={alert.title}
                                    description={alert.description}
                                    status={alert.status}
                                    tone={alert.tone}
                                    divider={index < alerts.length - 1}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const trendData = [
    { day: "Lun", value: 32 },
    { day: "Mar", value: 41 },
    { day: "Mie", value: 38 },
    { day: "Jue", value: 48 },
    { day: "Vie", value: 46 },
    { day: "Sab", value: 55 },
    { day: "Dom", value: 52 },
];

const chartMax = Math.max(...trendData.map((item) => item.value));

const quickActions = [
    { title: "Nuevo producto", description: "Abre el formulario base para altas futuras.", icon: "plus-box-outline" as const },
    { title: "Registrar compra", description: "Preparado para el flujo de entradas.", icon: "cart-arrow-down" as const },
    { title: "Movimiento manual", description: "Base para ajustes, salidas y transferencias.", icon: "swap-horizontal" as const },
    { title: "Ver inventario", description: "Entrada futura al listado principal.", icon: "view-list-outline" as const },
];


type MetricCardProps = {
    label: string;
    value: string;
    detail: string;
    tone: "primary" | "warning" | "success" | "neutral";
};

function MetricCard({ label, value, detail, tone }: MetricCardProps) {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
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

type AlertRowProps = {
    title: string;
    description: string;
    status: string;
    tone: "danger" | "warning" | "info";
    divider?: boolean;
};

function AlertRow({ title, description, status, tone, divider = true }: AlertRowProps) {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const alertIcon = tone === "danger" ? "alert-octagon-outline" : tone === "warning" ? "clock-alert-outline" : "shield-alert-outline";
    const alertIconColor = tone === "danger" ? "#DC2626" : tone === "warning" ? "#F59E0B" : palette.accent;

    return (
        <View className={cn("flex-row items-center justify-between gap-4 px-[18px] py-4", divider && "border-b border-content-muted/12")}>
            <View className="flex-1 flex-row items-start gap-2.5">
                <View
                    className={cn(
                        "w-2.5 h-2.5 rounded-full mt-1.5",
                        tone === "danger" && "bg-danger",
                        tone === "warning" && "bg-warning",
                        tone === "info" && "bg-accent"
                    )}
                />
                <MaterialCommunityIcons name={alertIcon} size={18} color={alertIconColor} style={{ marginTop: 3 }} />
                <View className="flex-1 gap-1">
                    <Text className="text-button-label text-content">{title}</Text>
                    <Text className="text-body-muted text-content-muted">
                        {description}
                    </Text>
                </View>
            </View>

            <View
                className={cn(
                    "px-3 py-2 rounded-full",
                    tone === "danger" && "bg-danger/10",
                    tone === "warning" && "bg-warning/12",
                    tone === "info" && "bg-accent/10"
                )}
            >
                <Text className="text-chip uppercase text-content">
                    {status}
                </Text>
            </View>
        </View>
    );
}

const metricIconMap = {
    primary: "package-variant-closed",
    warning: "alert-circle-outline",
    success: "tray-arrow-down",
    neutral: "tray-arrow-up",
} as const;