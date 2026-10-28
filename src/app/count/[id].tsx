import {
    AppText,
    Badge,
    Button,
    Card,
    EmptyState,
    MoneyText,
    Screen,
} from "@/components/ui";
import { formatDateTime } from "@/database/utils/dates";
import { formatQuantity } from "@/database/utils/quantity";
import { useCountDetail } from "@/hooks/use-counts";
import { usePalette } from "@/theme/colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View className="flex-row items-center justify-between gap-3">
            <AppText variant="muted">{label}</AppText>
            {children}
        </View>
    );
}

export default function CountDetailScreen() {
    const params = useLocalSearchParams<{ id?: string }>();
    const router = useRouter();
    const palette = usePalette();
    const { detail, loading, error } = useCountDetail(params.id);

    if (loading) {
        return (
            <Screen scroll={false}>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color={palette.accent} />
                </View>
            </Screen>
        );
    }

    if (!detail) {
        return (
            <Screen>
                <EmptyState
                    icon="clipboard-check-outline"
                    title="Conteo no encontrado"
                    description={error ?? "Puede que ya no esté disponible."}
                    action={<Button label="Volver" variant="outline" onPress={() => router.back()} />}
                />
            </Screen>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: "Detalle del conteo" }} />
            <Screen>
                <Card className="gap-3 border-accent/25 bg-accent-soft">
                    <View className="flex-row items-start justify-between gap-3">
                        <View className="flex-1 gap-1">
                            <AppText variant="title">Conteo semanal</AppText>
                            <AppText variant="muted">{formatDateTime(detail.createdAt)}</AppText>
                        </View>
                        <Badge tone="success" label="Conteo" />
                    </View>

                    <View className="flex-row items-center justify-between gap-3">
                        <AppText variant="muted">Venta conjunta</AppText>
                        <MoneyText value={detail.totalSale} className="font-semibold" />
                    </View>
                    <View className="flex-row items-center justify-between gap-3">
                        <AppText variant="muted">Unidades faltantes</AppText>
                        <AppText className="font-semibold">{formatQuantity(detail.unitsSold)}</AppText>
                    </View>
                    <View className="flex-row items-center justify-between gap-3">
                        <AppText variant="muted">Entradas</AppText>
                        <AppText className="font-semibold">{formatQuantity(detail.unitsAdded)}</AppText>
                    </View>
                </Card>

                <Card className="gap-3">
                    <AppText variant="title">Ventas del conteo</AppText>
                    {detail.sales.length === 0 ? (
                        <AppText variant="muted">No hubo faltantes en este conteo.</AppText>
                    ) : (
                        detail.sales.map((sale) => (
                            <View key={sale.id} className="gap-2 border-t border-border pt-3 first:border-0 first:pt-0">
                                <SummaryRow label="Producto">
                                    <AppText className="font-semibold">{sale.productName}</AppText>
                                </SummaryRow>
                                <SummaryRow label="Stock">
                                    <AppText>
                                        {formatQuantity(sale.stockBefore)} → {formatQuantity(sale.stockAfter)}
                                    </AppText>
                                </SummaryRow>
                                <SummaryRow label="Cantidad">
                                    <AppText>{formatQuantity(sale.quantity)} {sale.productUnit}</AppText>
                                </SummaryRow>
                                <SummaryRow label="Precio congelado">
                                    <MoneyText value={sale.unitPrice} />
                                </SummaryRow>
                                <SummaryRow label="Total">
                                    <MoneyText value={sale.total} className="font-semibold" />
                                </SummaryRow>
                            </View>
                        ))
                    )}
                </Card>

                <Card className="gap-3">
                    <AppText variant="title">Entradas</AppText>
                    {detail.adjustments.length === 0 ? (
                        <AppText variant="muted">No hubo sobrantes en este conteo.</AppText>
                    ) : (
                        detail.adjustments.map((adjustment) => (
                            <View key={adjustment.id} className="gap-2 border-t border-border pt-3 first:border-0 first:pt-0">
                                <SummaryRow label="Producto">
                                    <AppText className="font-semibold">{adjustment.productName}</AppText>
                                </SummaryRow>
                                <SummaryRow label="Delta">
                                    <AppText>{formatQuantity(adjustment.quantityDelta)} {adjustment.productUnit}</AppText>
                                </SummaryRow>
                                <SummaryRow label="Stock">
                                    <AppText>
                                        {formatQuantity(adjustment.stockBefore)} → {formatQuantity(adjustment.stockAfter)}
                                    </AppText>
                                </SummaryRow>
                                <SummaryRow label="Costo congelado">
                                    <MoneyText value={adjustment.unitCost} />
                                </SummaryRow>
                                <SummaryRow label="Motivo">
                                    <AppText>{adjustment.reason ?? "Sobrante de conteo"}</AppText>
                                </SummaryRow>
                            </View>
                        ))
                    )}
                </Card>

                <AppText variant="caption">
                    Precios y cantidades congelados al momento del conteo.
                </AppText>
            </Screen>
        </>
    );
}
