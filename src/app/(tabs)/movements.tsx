import MovementFilterBar from "@/components/movements/movement-filter-bar";
import MovementList from "@/components/movements/movement-list";
import DocumentForm from "@/components/movements/document-form";
import { Colors } from "@/constants/theme";
import {
    createManualInventoryMovement,
    listMovementsDetailed,
    type InventoryMovementDetailedRow,
    type ManualMovementType,
    type MovementFilter,
} from "@/database";
import { forceRefreshProducts, useProducts } from "@/hooks/useProducts";
import { buildMovementViews } from "@/utils/movement-presentation";
import { deferUntilInteractions } from "@/utils/interactions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    useColorScheme,
    View,
    type ViewStyle,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const INITIAL_MOVEMENT_LIMIT = 60;
const MOVEMENT_LIMIT_STEP = 60;
const MAX_MOVEMENT_LIMIT = 240;

const manualMovementOptions: { value: ManualMovementType; label: string }[] = [
    { value: "IN", label: "Entrada" },
    { value: "OUT", label: "Salida" },
    { value: "ADJUSTMENT_IN", label: "Ajuste +" },
    { value: "ADJUSTMENT_OUT", label: "Ajuste -" },
];

const summaryFormatter = new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
});

type FetchMode = "initial" | "refresh" | "more";

export default function MovementsScreen() {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const db = useSQLiteContext();
    const router = useRouter();
    const params = useLocalSearchParams<{ openForm?: string; movementType?: string }>();
    const { products, loading: productsLoading, ensureProducts } = useProducts(db, { autoLoad: false });
    const [movements, setMovements] = useState<InventoryMovementDetailedRow[]>([]);
    const [filter, setFilter] = useState<MovementFilter>("ALL");
    const [limit, setLimit] = useState(INITIAL_MOVEMENT_LIMIT);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [movementType, setMovementType] = useState<ManualMovementType>("IN");
    const [productId, setProductId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<string>("1");
    const [unitCost, setUnitCost] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const firstLoadRef = useRef(true);
    const loadMoreRef = useRef(false);

    const activeProducts = useMemo(
        () => products.filter((product) => Number(product.active) === 1),
        [products],
    );

    const { views, summary: todaySummary } = useMemo(
        () => buildMovementViews(movements, palette),
        [movements, palette],
    );

    const selectedProduct = useMemo(
        () => activeProducts.find((product) => product.id === productId) ?? null,
        [activeProducts, productId],
    );

    const pickerItems = useMemo(
        () =>
            activeProducts.map((product) => ({
                label: `${product.name}  ·  Stock: ${summaryFormatter.format(Number(product.current_stock || 0))}`,
                value: product.id,
            })),
        [activeProducts],
    );

    const fetchMovements = useCallback(
        async (
            targetFilter: MovementFilter,
            targetLimit: number,
            mode: FetchMode = "refresh",
            isActive: () => boolean = () => true,
        ): Promise<void> => {
            if (mode === "more") {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            try {
                const movementRows = await listMovementsDetailed(db, { limit: targetLimit, filter: targetFilter });

                if (!isActive()) {
                    return;
                }

                setMovements(movementRows);
            } catch (error) {
                console.warn("No se pudieron cargar los movimientos:", error);

                if (!isActive()) {
                    return;
                }

                setMovements([]);
            } finally {
                if (!isActive()) {
                    return;
                }

                setLoading(false);
                setLoadingMore(false);
            }
        },
        [db],
    );

    useEffect(() => {
        let isActive = true;
        const isMore = loadMoreRef.current;
        loadMoreRef.current = false;
        const shouldDeferFirstLoad = firstLoadRef.current && !isMore;
        firstLoadRef.current = false;

        const run = () => {
            if (isActive) {
                void fetchMovements(
                    filter,
                    limit,
                    isMore ? "more" : shouldDeferFirstLoad ? "initial" : "refresh",
                    () => isActive,
                );
            }
        };

        if (shouldDeferFirstLoad) {
            const cancelDeferredLoad = deferUntilInteractions(run);

            return () => {
                isActive = false;
                cancelDeferredLoad();
            };
        }

        run();

        return () => {
            isActive = false;
        };
    }, [fetchMovements, filter, limit]);

    useEffect(() => {
        if (params.openForm !== "true") {
            return;
        }

        const validTypes: ManualMovementType[] = ["IN", "OUT", "ADJUSTMENT_IN", "ADJUSTMENT_OUT"];
        const requestedType = params.movementType;
        const nextType = validTypes.includes(requestedType as ManualMovementType)
            ? (requestedType as ManualMovementType)
            : "IN";

        router.setParams({ openForm: undefined, movementType: undefined });

        Promise.resolve().then(() => {
            setSubmitError(null);
            setMovementType(nextType);
            setProductId(activeProducts[0]?.id ?? null);
            setQuantity("1");
            setUnitCost("");
            setNotes("");
            setPickerOpen(false);
            setIsFormOpen(true);
            void ensureProducts().then((rows) => {
                const firstActive = rows.find((product) => Number(product.active) === 1);

                if (firstActive) {
                    setProductId((previous) => previous ?? firstActive.id);
                }
            });
        });
    }, [params.openForm, params.movementType, activeProducts, ensureProducts, router]);

    const handleFilterChange = useCallback(
        (nextFilter: MovementFilter) => {
            if (nextFilter === filter) {
                return;
            }

            setFilter(nextFilter);
            setLimit(INITIAL_MOVEMENT_LIMIT);
        },
        [filter],
    );

    const handleLoadMore = useCallback(() => {
        if (loading || loadingMore || limit >= MAX_MOVEMENT_LIMIT) {
            return;
        }

        loadMoreRef.current = true;
        setLimit((previous) => Math.min(previous + MOVEMENT_LIMIT_STEP, MAX_MOVEMENT_LIMIT));
    }, [loading, loadingMore, limit]);

    const openForm = useCallback(
        (type: ManualMovementType = "IN") => {
            setSubmitError(null);
            setMovementType(type);
            setProductId(activeProducts[0]?.id ?? null);
            setQuantity("1");
            setUnitCost("");
            setNotes("");
            setPickerOpen(false);
            setIsFormOpen(true);
            void ensureProducts().then((rows) => {
                const firstActive = rows.find((product) => Number(product.active) === 1);

                if (firstActive) {
                    setProductId((previous) => previous ?? firstActive.id);
                }
            });
        },
        [activeProducts, ensureProducts],
    );

    const closeForm = useCallback(() => {
        setIsFormOpen(false);
        setPickerOpen(false);
        setSubmitError(null);
    }, []);

    const submitMovement = useCallback(async () => {
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
            forceRefreshProducts();
            await fetchMovements(filter, limit);
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo registrar el movimiento.";
            setSubmitError(message);
        } finally {
            setSaving(false);
        }
    }, [productId, quantity, unitCost, notes, movementType, db, closeForm, filter, limit, fetchMovements]);

    const listHeader = useMemo(
        () => (
            <View>
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
                        onPress={() => openForm()}
                        className="rounded-2xl px-3.5 py-2.5 bg-accent"
                        style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
                    >
                        <MaterialCommunityIcons name="plus" size={18} color={palette.onAccent} />
                    </Pressable>
                </View>

                <View className="flex-row flex-wrap gap-3 mb-4">
                    <View className="flex-1 min-w-[46%] p-4 rounded-[18px] border bg-surface border-border">
                        <Text className="text-body-muted text-content-muted">Movimientos hoy</Text>
                        <Text className="text-metric-value text-content">{todaySummary.total}</Text>
                    </View>
                    <View className="flex-1 min-w-[46%] p-4 rounded-[18px] border bg-surface border-border">
                        <Text className="text-body-muted text-content-muted">Entradas hoy</Text>
                        <Text className="text-metric-value text-accent">+{summaryFormatter.format(todaySummary.entries)}</Text>
                    </View>
                    <View className="flex-1 min-w-[46%] p-4 rounded-[18px] border bg-surface border-border">
                        <Text className="text-body-muted text-content-muted">Salidas hoy</Text>
                        <Text className="text-metric-value text-warning">-{summaryFormatter.format(todaySummary.exits)}</Text>
                    </View>
                    <View className="flex-1 min-w-[46%] p-4 rounded-[18px] border bg-surface border-border">
                        <Text className="text-body-muted text-content-muted">Ajustes hoy</Text>
                        <Text className="text-metric-value text-content">{todaySummary.adjustments}</Text>
                    </View>
                </View>

                <MovementFilterBar filter={filter} onSelect={handleFilterChange} palette={palette} />
            </View>
        ),
        [filter, handleFilterChange, openForm, palette, todaySummary],
    );

    return (
        <View className="flex-1 px-5 pt-6 bg-background">
            <StatusBar style={scheme === "dark" ? "light" : "dark"} />
            <MovementList
                header={listHeader}
                views={views}
                loading={loading}
                loadingMore={loadingMore}
                canLoadMore={!loading && !loadingMore && views.length >= limit && limit < MAX_MOVEMENT_LIMIT}
                onLoadMore={handleLoadMore}
            />

            {isFormOpen ? (
                <Modal transparent visible={isFormOpen} animationType="slide" onRequestClose={closeForm}>
                    <View className="flex-1 justify-end bg-[rgba(15,23,42,0.45)]">
                        <View
                            className="rounded-t-[28px] border pt-[18px] px-[18px] pb-6 bg-surface border-border"
                            style={
                                movementType === "IN" || movementType === "OUT"
                                    ? { height: "92%", maxHeight: "92%" }
                                    : { maxHeight: "92%", minHeight: "68%" }
                            }
                        >
                            <View className="flex-row items-center justify-between mb-3 shrink-0">
                                <Text className="text-section-title text-content">
                                    {movementType === "IN"
                                        ? "Nueva entrada (multi-producto)"
                                        : movementType === "OUT"
                                          ? "Nueva salida (multi-producto)"
                                          : "Registrar movimiento"}
                                </Text>
                                <Pressable onPress={closeForm}>
                                    <MaterialCommunityIcons name="close" size={22} color={palette.text} />
                                </Pressable>
                            </View>

                            <View className="gap-2 mb-3 shrink-0">
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

                            {movementType === "IN" || movementType === "OUT" ? (
                                <View className="flex-1 min-h-0">
                                <DocumentForm
                                    kind={movementType}
                                    db={db}
                                    products={activeProducts}
                                    palette={palette}
                                    onClose={closeForm}
                                    onSaved={async () => {
                                        forceRefreshProducts();
                                        await fetchMovements(filter, limit);
                                    }}
                                />
                                </View>
                            ) : (
                                <>
                            <ScrollView contentContainerClassName="gap-4 pb-3" keyboardShouldPersistTaps="handled">

                                <View className="gap-2">
                                    <Text className="text-body-muted text-content-muted">Producto</Text>
                                    <View style={{ zIndex: pickerOpen ? 5000 : 0, elevation: pickerOpen ? 12 : 0 }}>
                                        <DropDownPicker
                                            open={pickerOpen}
                                            setOpen={setPickerOpen}
                                            value={productId}
                                            setValue={setProductId}
                                            items={pickerItems}
                                            placeholder={
                                                productsLoading && activeProducts.length === 0
                                                    ? "Cargando productos..."
                                                    : activeProducts.length
                                                      ? "Selecciona un producto"
                                                      : "Sin productos activos"
                                            }
                                            loading={productsLoading}
                                            searchable
                                            searchPlaceholder="Buscar producto"
                                            listMode="MODAL"
                                            modalTitle="Selecciona un producto"
                                            modalTitleStyle={{
                                                fontSize: 17,
                                                fontWeight: "600",
                                                color: palette.text,
                                            }}
                                            modalContentContainerStyle={{
                                                backgroundColor: palette.surfaceStrong,
                                            }}
                                            zIndex={5000}
                                            zIndexInverse={5000}
                                            theme={scheme === "dark" ? "DARK" : "LIGHT"}
                                            disabled={!activeProducts.length}
                                            style={{
                                                borderRadius: 14,
                                                borderColor: palette.border,
                                                backgroundColor: palette.background,
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                minHeight: 48,
                                            }}
                                            dropDownContainerStyle={{
                                                borderRadius: 14,
                                                borderColor: palette.border,
                                                backgroundColor: palette.surfaceStrong,
                                            }}
                                            labelStyle={{
                                                fontSize: 15,
                                                fontWeight: "600",
                                                color: palette.text,
                                            }}
                                            placeholderStyle={{
                                                fontSize: 15,
                                                color: palette.textMuted,
                                            }}
                                            textStyle={{
                                                fontSize: 15,
                                                color: palette.text,
                                            }}
                                            arrowIconStyle={{ tintColor: palette.textMuted } as ViewStyle}
                                            tickIconStyle={{ tintColor: palette.accent } as ViewStyle}
                                            selectedItemContainerStyle={{
                                                backgroundColor: palette.accentSoft,
                                            }}
                                            selectedItemLabelStyle={{
                                                color: palette.accent,
                                                fontWeight: "600",
                                            }}
                                            searchContainerStyle={{
                                                backgroundColor: palette.surfaceStrong,
                                                borderBottomColor: palette.border,
                                            }}
                                            searchTextInputStyle={{
                                                borderColor: palette.border,
                                                backgroundColor: palette.background,
                                                color: palette.text,
                                            }}
                                            searchPlaceholderTextColor={palette.textMuted}
                                        />
                                    </View>
                                    {!productsLoading && activeProducts.length === 0 ? (
                                        <Text className="text-body-muted text-content-muted">
                                            Primero crea un producto en Inventario para registrar movimientos.
                                        </Text>
                                    ) : null}
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
                                    <Text className="text-button-label text-on-accent">
                                        {saving ? "Guardando..." : "Registrar"}
                                    </Text>
                                </Pressable>
                            </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            ) : null}
        </View>
    );
}
