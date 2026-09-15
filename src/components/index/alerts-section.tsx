import { Colors } from "@/constants/theme";
import { cn } from "@/utils/cn";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";
import type { AlertTone } from "./types";

type AlertRowData = {
    title: string;
    description: string;
    status: string;
    tone: AlertTone;
};

export default function AlertsSection({ lowStock }: { lowStock: number }) {
    const alerts = lowStock > 0
        ? [
            {
                title: `${lowStock} productos bajo mínimo`,
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
    );
}

function AlertRow({ title, description, status, tone, divider = true }: AlertRowData & { divider?: boolean }) {
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