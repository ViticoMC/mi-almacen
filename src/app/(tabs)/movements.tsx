import { Colors } from "@/constants/theme";
import {
    createManualInventoryMovement,
    listMovementsDetailed,
    listProducts,
    type InventoryMovementDetailedRow,
    type ManualMovementType,
    type MovementFilter,
    type ProductRow,
} from "@/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    useColorScheme,
    View,
} from "react-native";

const movementFilterOptions: { value: MovementFilter; label: string }[] = [
    { value: "ALL", label: "Todos" },
    { value: "IN", label: "Entradas" },
    { value: "OUT", label: "Salidas" },
    { value: "ADJUSTMENTS", label: "Ajustes" },
];

const manualMovementOptions: { value: ManualMovementType; label: string }[] = [
    { value: "IN", label: "Entrada" },
    { value: "OUT", label: "Salida" },
    { value: "ADJUSTMENT_IN", label: "Ajuste +" },
    { value: "ADJUSTMENT_OUT", label: "Ajuste -" },
];

const quantityFormatter = new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
});

const moneyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
});

function isToday(value: string) {
    const date = new Date(value);
    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

function formatMovementDate(value: string) {
    return new Date(value).toLocaleString("es-MX", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getMovementLabel(movementType: string) {
    if (movementType === "IN") {
        return "Entrada";
    }
    if (movementType === "OUT") {
        return "Salida";
    }
    if (movementType === "ADJUSTMENT_IN") {
        return "Ajuste +";
    }
    if (movementType === "ADJUSTMENT_OUT") {
        return "Ajuste -";
    }
    return "Movimiento";
}

function getReferenceLabel(referenceType: string) {
    if (referenceType === "PURCHASE") {
        return "Compra";
    }
    if (referenceType === "SALE") {
        return "Venta";
    }
    if (referenceType === "ADJUSTMENT") {
        return "Ajuste";
    }
    if (referenceType === "MANUAL") {
        return "Manual";
    }
    return "Sistema";
}

export default function MovementsScreen() {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const db = useSQLiteContext();
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [movements, setMovements] = useState<InventoryMovementDetailedRow[]>([]);
    const [filter, setFilter] = useState<MovementFilter>("ALL");
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [movementType, setMovementType] = useState<ManualMovementType>("IN");
    const [productId, setProductId] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("1");
    const [unitCost, setUnitCost] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const activeProducts = useMemo(
        () => products.filter((product) => Number(product.active) === 1),
        [products],
    );

    const todaySummary = useMemo(() => {
        let total = 0;
        let entries = 0;
        let exits = 0;
        let adjustments = 0;

        for (const movement of movements) {
            if (!isToday(movement.movement_date)) {
                continue;
            }

            total += 1;

            if (movement.movement_type === "IN" || movement.movement_type === "ADJUSTMENT_IN") {
                entries += Number(movement.quantity || 0);
            }

            if (movement.movement_type === "OUT" || movement.movement_type === "ADJUSTMENT_OUT") {
                exits += Number(movement.quantity || 0);
            }

            if (movement.movement_type === "ADJUSTMENT_IN" || movement.movement_type === "ADJUSTMENT_OUT") {
                adjustments += 1;
            }
        }

        return { total, entries, exits, adjustments };
    }, [movements]);

    const selectedProduct = useMemo(
        () => activeProducts.find((product) => product.id === productId) ?? null,
        [activeProducts, productId],
    );

    const loadData = async (targetFilter: MovementFilter) => {
        try {
            const [productRows, movementRows] = await Promise.all([
                listProducts(db),
                listMovementsDetailed(db, { limit: 140, filter: targetFilter }),
            ]);
            setProducts(productRows);
            setMovements(movementRows);
        } catch (error) {
            console.warn("No se pudieron cargar los movimientos:", error);
            setMovements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            listProducts(db),
            listMovementsDetailed(db, { limit: 140, filter }),
        ])
            .then(([productRows, movementRows]) => {
                if (!isMounted) {
                    return;
                }
                setProducts(productRows);
                setMovements(movementRows);
            })
            .catch((error) => {
                console.warn("No se pudieron cargar los movimientos:", error);
                if (isMounted) {
                    setMovements([]);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [db, filter]);

    const openForm = () => {
        if (!activeProducts.length) {
            return;
        }

        setSubmitError(null);
        setMovementType("IN");
        setProductId(activeProducts[0].id);
        setQuantity("1");
        setUnitCost("");
        setNotes("");
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setSubmitError(null);
    };

    const submitMovement = async () => {
        if (!productId) {
            setSubmitError("Selecciona un producto para continuar.");
            return;
        }

        const numericQuantity = Number(quantity);

        if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
            setSubmitError("La cantidad debe ser mayor a cero.");
            return;
        }

        const numericUnitCost = unitCost.trim().length ? Number(unitCost) : null;

        if (numericUnitCost !== null && (!Number.isFinite(numericUnitCost) || numericUnitCost < 0)) {
            setSubmitError("El costo unitario debe ser un numero valido.");
            return;
        }

        setSaving(true);
        setSubmitError(null);

        try {
            await createManualInventoryMovement(db, {
                product_id: productId,
                movement_type: movementType,
                quantity: numericQuantity,
                unit_cost: numericUnitCost,
                notes: notes.trim() || null,
            });

            closeForm();
            await loadData(filter);
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo registrar el movimiento.";
            setSubmitError(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <View className="flex-1 px-5 pt-6 pb-[92px] bg-background">
            <StatusBar style={scheme === "dark" ? "light" : "dark"} />
            <View className="flex-row items-center justify-between mt-9 mb-6 gap-3">
                <View className="flex-1 gap-2">
                    <Text className="text-eyebrow uppercase text-accent">
                        Operaciones
                    </Text>
                    <Text className="text-title text-content">
                        Movimientos
                    </Text>
                    <Text className="text-subtitle text-content-muted max-w-[360px]">
                        Registra entradas, salidas y ajustes con impacto inmediato en stock.
                    </Text>
                </View>
                <Pressable
                    onPress={openForm}
                    disabled={!activeProducts.length}
                    className="rounded-2xl px-3.5 py-2.5 bg-accent"
                    style={({ pressed }) => (
                        pressed || !activeProducts.length ? { opacity: 0.8 } : undefined
                    )}
                >
                    <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-3 mb-4">
                <View className="flex-1 min-w-[46%] p-4 rounded-[18px] border bg-surface border-border">
                    <Text className="text-body-muted text-content-muted">Movimientos hoy</Text>
                    <Text className="text-metric-value text-content">{todaySummary.total}</Text>
                </View>
                <View className="flex-1 min-w-[46%] p-4 rounded-[18px] border bg-surface border-border">
                    <Text className="text-body-muted text-content-muted">Entradas hoy</Text>
                    <Text className="text-metric-value text-accent">+{quantityFormatter.format(todaySummary.entries)}</Text>
                </View>
                <View className="flex-1 min-w-[46%] p-4 rounded-[18px] border bg-surface border-border">
                    <Text className="text-body-muted text-content-muted">Salidas hoy</Text>
                    <Text className="text-metric-value text-warning">-{quantityFormatter.format(todaySummary.exits)}</Text>
                </View>
                <View className="flex-1 min-w-[46%] p-4 rounded-[18px] border bg-surface border-border">
                    <Text className="text-body-muted text-content-muted">Ajustes hoy</Text>
                    <Text className="text-metric-value text-content">{todaySummary.adjustments}</Text>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2 mb-4"
            >
                {movementFilterOptions.map((option) => {
                    const isActive = option.value === filter;
                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => setFilter(option.value)}
                            className="px-3.5 py-2 rounded-2xl border"
                            style={{
                                backgroundColor: isActive ? palette.accentSoft : palette.surface,
                                borderColor: isActive ? palette.accent : palette.border,
                            }}
                        >
                            <Text className={isActive ? "text-button-label text-accent" : "text-button-label text-content"}>
                                {option.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {loading ? (
                <View className="rounded-[24px] border p-5 items-center bg-surface border-border">
                    <Text className="text-body-muted text-content-muted">Cargando movimientos...</Text>
                </View>
            ) : movements.length === 0 ? (
                <View className="rounded-[24px] border p-6 items-center gap-2.5 bg-surface border-border">
                    <MaterialCommunityIcons name="swap-horizontal" size={28} color={palette.accent} />
                    <Text className="text-button-label text-content">No hay movimientos para este filtro</Text>
                    <Text className="text-body-muted text-content-muted text-center">
                        Registra una operacion manual o cambia el filtro para ver mas actividad.
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerClassName="gap-3 pb-4" showsVerticalScrollIndicator={false}>
                    {movements.map((movement) => {
                        const isOutgoing =
                            movement.movement_type === "OUT" || movement.movement_type === "ADJUSTMENT_OUT";
                        const movementIcon: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
                            isOutgoing ? "tray-arrow-up" : "tray-arrow-down";

                        return (
                            <View key={movement.id} className="rounded-[22px] border p-4 bg-surface border-border gap-2.5">
                                <View className="flex-row items-start justify-between gap-3">
                                    <View className="flex-1 flex-row items-start gap-2.5">
                                        <View className={isOutgoing ? "w-2.5 h-2.5 rounded-full mt-1.5 bg-warning" : "w-2.5 h-2.5 rounded-full mt-1.5 bg-accent"} />
                                        <MaterialCommunityIcons
                                            name={movementIcon}
                                            size={18}
                                            color={isOutgoing ? "#F59E0B" : palette.accent}
                                            style={{ marginTop: 2 }}
                                        />
                                        <View className="flex-1 gap-1">
                                            <Text className="text-button-label text-content">{movement.product_name}</Text>
                                            <Text className="text-body-muted text-content-muted">
                                                {getMovementLabel(movement.movement_type)} · {getReferenceLabel(movement.reference_type)}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className={isOutgoing ? "text-chip uppercase text-warning" : "text-chip uppercase text-accent"}>
                                        {isOutgoing ? "-" : "+"}
                                        {quantityFormatter.format(Number(movement.quantity || 0))}
                                    </Text>
                                </View>

                                <View className="flex-row items-center justify-between gap-3">
                                    <Text className="text-body-muted text-content-muted">
                                        {formatMovementDate(movement.movement_date)}
                                    </Text>
                                    <Text className="text-body-muted text-content-muted">
                                        {movement.unit_cost === null
                                            ? "Sin costo"
                                            : moneyFormatter.format(Number(movement.unit_cost || 0))}
                                    </Text>
                                </View>

                                {movement.notes ? (
                                    <Text className="text-body-muted text-content-muted">{movement.notes}</Text>
                                ) : null}
                            </View>
                        );
                    })}
                </ScrollView>
            )}

            <Modal transparent visible={isFormOpen} animationType="slide" onRequestClose={closeForm}>
                <View className="flex-1 justify-end bg-[rgba(15,23,42,0.45)]">
                    <View className="rounded-t-[28px] border pt-[18px] px-[18px] pb-6 min-h-[68%] bg-surface border-border">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-section-title text-content">Registrar movimiento</Text>
                            <Pressable onPress={closeForm}>
                                <MaterialCommunityIcons name="close" size={22} color={palette.text} />
                            </Pressable>
                        </View>

                        <ScrollView contentContainerClassName="gap-4 pb-3" keyboardShouldPersistTaps="handled">
                            <View className="gap-2">
                                <Text className="text-body-muted text-content-muted">Tipo de movimiento</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {manualMovementOptions.map((option) => {
                                        const isSelected = movementType === option.value;
                                        return (
                                            <Pressable
                                                key={option.value}
                                                onPress={() => setMovementType(option.value)}
                                                className="px-3.5 py-2 rounded-2xl border"
                                                style={{
                                                    backgroundColor: isSelected ? palette.accentSoft : palette.background,
                                                    borderColor: isSelected ? palette.accent : palette.border,
                                                }}
                                            >
                                                <Text className={isSelected ? "text-button-label text-accent" : "text-button-label text-content"}>
                                                    {option.label}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <View className="gap-2">
                                <Text className="text-body-muted text-content-muted">Producto</Text>
                                <View className="rounded-[14px] border border-border bg-background p-3 gap-2">
                                    {activeProducts.map((product) => {
                                        const isSelected = product.id === productId;
                                        return (
                                            <Pressable
                                                key={product.id}
                                                onPress={() => setProductId(product.id)}
                                                className="rounded-xl px-3 py-2 border"
                                                style={{
                                                    backgroundColor: isSelected ? palette.accentSoft : palette.surface,
                                                    borderColor: isSelected ? palette.accent : palette.border,
                                                }}
                                            >
                                                <View className="flex-row items-center justify-between gap-2">
                                                    <Text className={isSelected ? "text-button-label text-accent" : "text-button-label text-content"}>
                                                        {product.name}
                                                    </Text>
                                                    <Text className="text-chip text-content-muted">
                                                        Stock: {quantityFormatter.format(Number(product.current_stock || 0))}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <View className="flex-row gap-3">
                                <View className="flex-1 gap-2">
                                    <Text className="text-body-muted text-content-muted">Cantidad</Text>
                                    <TextInput
                                        value={quantity}
                                        onChangeText={setQuantity}
                                        keyboardType="decimal-pad"
                                        placeholder="0"
                                        placeholderTextColor={palette.textMuted}
                                        className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                                    />
                                </View>
                                <View className="flex-1 gap-2">
                                    <Text className="text-body-muted text-content-muted">Costo unitario</Text>
                                    <TextInput
                                        value={unitCost}
                                        onChangeText={setUnitCost}
                                        keyboardType="decimal-pad"
                                        placeholder="Opcional"
                                        placeholderTextColor={palette.textMuted}
                                        className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                                    />
                                </View>
                            </View>

                            <View className="gap-2">
                                <Text className="text-body-muted text-content-muted">Notas</Text>
                                <TextInput
                                    value={notes}
                                    onChangeText={setNotes}
                                    placeholder={selectedProduct ? `Referencia para ${selectedProduct.name}` : "Referencia"}
                                    placeholderTextColor={palette.textMuted}
                                    multiline
                                    className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background min-h-[90px]"
                                    style={{ textAlignVertical: "top" }}
                                />
                            </View>

                            {submitError ? (
                                <View className="rounded-xl px-3 py-2.5 bg-danger/10 border border-danger/20">
                                    <Text className="text-body-muted text-danger">{submitError}</Text>
                                </View>
                            ) : null}
                        </ScrollView>

                        <View className="flex-row gap-3 mt-4">
                            <Pressable onPress={closeForm} className="flex-1 border rounded-[14px] py-3 items-center border-border">
                                <Text className="text-button-label text-content">Cancelar</Text>
                            </Pressable>
                            <Pressable
                                onPress={submitMovement}
                                disabled={saving}
                                className="flex-1 rounded-2xl px-3.5 py-3 items-center bg-accent"
                                style={({ pressed }) => (pressed || saving ? { opacity: 0.8 } : undefined)}
                            >
                                <Text className="text-button-label text-accent">
                                    {saving ? "Guardando..." : "Registrar"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}