import { AppText, Button, EmptyState, Screen, TextField } from "@/components/ui";
import { buildCountPreview } from "@/database/repositories/counts.repository";
import type { Product } from "@/database/types";
import { formatMoney } from "@/database/utils/money";
import { formatQuantity, parseQuantityInput } from "@/database/utils/quantity";
import { useProducts } from "@/hooks/use-products";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";
import { sanitizeDecimalInput } from "@/utils/input";
import { useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Switch,
    View,
    type ListRenderItem,
} from "react-native";

export interface CountFormSubmitEntry {
    productId: string;
    counted: number | null;
}

interface CountFormProps {
    submitting?: boolean;
    onSubmit: (entries: CountFormSubmitEntry[]) => Promise<void> | void;
    onCancel: () => void;
}

interface CountListItemState {
    product: Product;
    raw: string;
    parsed: number | null;
    preview: ReturnType<typeof buildCountPreview> | null;
}

function getStatusLabel(preview: ReturnType<typeof buildCountPreview>) {
    if (!preview || preview.delta === 0) return null;

    if (preview.kind === "sale") {
        if (preview.salePriceMissing) {
            return { tone: "warning", text: "Sin precio de salida" } as const;
        }

        const verb = preview.delta < 0 ? "Faltan" : "Quedan";
        const abs = Math.abs(preview.delta);
        return {
            tone: "danger",
            text: `${verb} ${formatQuantity(abs)} · venta ${formatMoney(preview.total)}`,
        } as const;
    }

    if (preview.kind === "adjustment") {
        return {
            tone: "success",
            text: `Sobran ${formatQuantity(Math.abs(preview.delta))} · entrada`,
        } as const;
    }

    return null;
}

export function CountForm({ submitting = false, onSubmit, onCancel }: CountFormProps) {
    const palette = usePalette();
    const [search, setSearch] = useState("");
    const [onlyDifferences, setOnlyDifferences] = useState(false);
    const [countInputs, setCountInputs] = useState<Record<string, string>>({});
    const { products, loading, error } = useProducts({ search });

    const items = useMemo<CountListItemState[]>(() => {
        return products.map((product) => {
            const raw = countInputs[product.id] ?? "";
            const parsed = raw.trim() ? parseQuantityInput(raw) : null;

            let preview = null;
            if (parsed != null) {
                try {
                    preview = buildCountPreview(product, parsed);
                } catch {
                    preview = null;
                }
            }

            return { product, raw, parsed, preview };
        });
    }, [countInputs, products]);

    const filtered = useMemo(() => {
        if (!onlyDifferences) return items;
        return items.filter(({ preview }) => {
            return preview != null && preview.delta !== 0;
        });
    }, [items, onlyDifferences]);

    const differences = items.filter(({ preview }) => preview != null && preview.delta !== 0);
    const saleEntries = differences.filter(({ preview }) => preview?.kind === "sale");
    const adjustmentEntries = differences.filter(
        ({ preview }) => preview?.kind === "adjustment",
    );
    const totalSale = saleEntries.reduce(
        (sum, { preview }) => sum + (preview?.total ?? 0),
        0,
    );
    const unitsSold = saleEntries.reduce(
        (sum, { preview }) => sum + (preview?.quantity ?? 0),
        0,
    );
    const unitsAdded = adjustmentEntries.reduce(
        (sum, { preview }) => sum + (preview?.quantity ?? 0),
        0,
    );
    const missingPrices = differences.filter(
        ({ preview }) => preview?.salePriceMissing,
    ).length;

    function updateInput(productId: string, value: string) {
        setCountInputs((current) => ({
            ...current,
            [productId]: sanitizeDecimalInput(value),
        }));
    }

    function handleConfirmPress() {
        const entries: CountFormSubmitEntry[] = differences
            .filter(({ preview }) => preview && preview.delta !== 0)
            .map(({ product, parsed }) => ({
                productId: product.id,
                counted: parsed,
            }));

        if (entries.length === 0) {
            Alert.alert("Sin diferencias", "No hay cambios para registrar.");
            return;
        }

        const message = [
            `Venta conjunta: ${saleEntries.length} productos · ${formatMoney(totalSale)}`,
            `Entradas: ${adjustmentEntries.length} productos · ${formatQuantity(unitsAdded)} unidades`,
            missingPrices > 0 ? `Productos sin precio: ${missingPrices}` : "Todos los faltantes tienen precio",
        ].join("\n");

        Alert.alert("Confirmar conteo", message, [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Confirmar",
                onPress: () => {
                    void onSubmit(entries);
                },
            },
        ]);
    }

    const renderItem: ListRenderItem<CountListItemState> = ({ item }) => {
        const preview = item.preview;
        const status = preview ? getStatusLabel(preview) : null;
        const negativeDelta = preview != null && preview.delta < 0;

        return (
            <View className="gap-3 rounded-2xl border border-border bg-surface p-3">
                <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                        <AppText className="font-semibold">{item.product.name}</AppText>
                        <AppText variant="caption">
                            Sistema: {formatQuantity(item.product.stock)} {item.product.unit}
                        </AppText>
                    </View>
                    {preview && preview.delta !== 0 ? (
                        <View
                            className={cn(
                                "rounded-full px-2 py-1",
                                negativeDelta ? "bg-danger-soft" : "bg-success/10",
                            )}
                        >
                            <AppText
                                variant="caption"
                                className={cn(
                                    "font-semibold",
                                    negativeDelta ? "text-danger" : "text-success",
                                )}
                            >
                                {negativeDelta ? "Falta" : "Sobra"}
                            </AppText>
                        </View>
                    ) : null}
                </View>

                <TextField
                    value={item.raw}
                    onChangeText={(next) => updateInput(item.product.id, next)}
                    placeholder={formatQuantity(item.product.stock)}
                    keyboardType="decimal-pad"
                    inputMode="decimal"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    label="Contado"
                />

                {status ? (
                    <AppText
                        variant="caption"
                        className={cn(
                            status.tone === "danger" && "text-danger",
                            status.tone === "success" && "text-success",
                            status.tone === "warning" && "text-warning",
                        )}
                    >
                        {status.text}
                    </AppText>
                ) : item.raw.trim() ? (
                    <AppText variant="caption" className="text-content-muted">
                        Sin cambios
                    </AppText>
                ) : null}
            </View>
        );
    };

    return (
        <Screen>
            <View className="gap-3">
                <AppText variant="title">Conteo semanal</AppText>

                <View className="gap-3 rounded-2xl border border-border bg-surface p-3">
                    <TextField
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Buscar producto"
                        autoCapitalize="none"
                    />

                    <View className="flex-row items-center justify-between gap-3">
                        <AppText variant="body">Solo diferencias</AppText>
                        <Switch
                            value={onlyDifferences}
                            onValueChange={setOnlyDifferences}
                            thumbColor={palette.surface}
                            trackColor={{ false: palette.border, true: palette.accent }}
                        />
                    </View>
                </View>
            </View>

            {error ? (
                <View className="rounded-2xl border border-danger-border bg-danger-soft p-3">
                    <AppText className="text-danger">{error}</AppText>
                </View>
            ) : null}

            {loading ? (
                <View className="items-center py-8">
                    <AppText variant="muted">Cargando productos…</AppText>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={({ product }) => product.id}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <EmptyState
                            icon="package-variant-closed"
                            title={search ? "Sin resultados" : "No hay productos"}
                            description={
                                search
                                    ? "Intenta con otro nombre."
                                    : "Crea un producto para empezar el conteo."
                            }
                        />
                    }
                    contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
                    scrollEnabled={false}
                />
            )}

            <View className="gap-3 rounded-2xl border border-border bg-surface p-3">
                <AppText variant="title">Resumen</AppText>
                <View className="flex-row items-center justify-between gap-3">
                    <AppText variant="muted">Productos con diferencia</AppText>
                    <AppText className="font-semibold">{differences.length}</AppText>
                </View>
                <View className="flex-row items-center justify-between gap-3">
                    <AppText variant="muted">Ventas</AppText>
                    <AppText className="font-semibold">
                        {formatQuantity(unitsSold)} un · {formatMoney(totalSale)}
                    </AppText>
                </View>
                <View className="flex-row items-center justify-between gap-3">
                    <AppText variant="muted">Entradas</AppText>
                    <AppText className="font-semibold">{formatQuantity(unitsAdded)} un</AppText>
                </View>

                {missingPrices > 0 ? (
                    <AppText variant="caption" className="text-warning">
                        Hay {missingPrices} faltantes sin precio de salida.
                    </AppText>
                ) : null}

                <Button
                    label="Confirmar conteo"
                    onPress={handleConfirmPress}
                    disabled={differences.length === 0 || submitting}
                    loading={submitting}
                />
                <Button label="Cancelar" variant="outline" onPress={onCancel} />
            </View>
        </Screen>
    );
}
