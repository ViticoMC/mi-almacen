import { Colors } from "@/constants/theme";
import {
  createUnit,
  deleteUnit,
  getProductById,
  listPricesByProduct,
  listUnitsByProduct,
  updateUnit,
  upsertPrice,
  type ProductUnitRow,
  type ProductWithMetrics,
  type UnitPriceView,
} from "@/database";
import { forceRefreshProducts } from "@/hooks/useProducts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const palette = Colors[scheme === "dark" ? "dark" : "light"];
  const db = useSQLiteContext();
  const router = useRouter();

  const [product, setProduct] = useState<ProductWithMetrics | null>(null);
  const [units, setUnits] = useState<ProductUnitRow[]>([]);
  const [prices, setPrices] = useState<UnitPriceView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [unitName, setUnitName] = useState("");
  const [unitFactor, setUnitFactor] = useState("1");
  const [unitIsBase, setUnitIsBase] = useState(false);
  const [unitPrice, setUnitPrice] = useState("");
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [savingUnit, setSavingUnit] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const row = await getProductById(db, String(id));
      if (!row) {
        setError("No se encontró el producto.");
        setProduct(null);
        return;
      }
      setProduct(row);
      const [unitRows, priceRows] = await Promise.all([
        listUnitsByProduct(db, row.id),
        listPricesByProduct(db, row.id),
      ]);
      setUnits(unitRows);
      setPrices(priceRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la ficha.");
    } finally {
      setLoading(false);
    }
  }, [db, id]);

  useEffect(() => {
    // Sincroniza la ficha con SQLite (sistema externo) al abrir o cambiar de producto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const priceByUnit = useMemo(() => {
    const map = new Map<string, UnitPriceView>();
    for (const price of prices) {
      if (!map.has(price.unit_id)) map.set(price.unit_id, price);
    }
    return map;
  }, [prices]);

  const resetUnitForm = useCallback(() => {
    setUnitName("");
    setUnitFactor("1");
    setUnitIsBase(false);
    setUnitPrice("");
    setEditingUnitId(null);
    setFormError(null);
  }, []);

  const startEditUnit = useCallback(
    (unit: ProductUnitRow) => {
      setEditingUnitId(unit.id);
      setUnitName(unit.name);
      setUnitFactor(String(unit.factor));
      setUnitIsBase(Number(unit.is_base) === 1);
      setUnitPrice(priceByUnit.get(unit.id) ? String(priceByUnit.get(unit.id)!.price) : "");
      setFormError(null);
    },
    [priceByUnit],
  );

  const saveUnit = useCallback(async () => {
    if (!product) return;
    const factor = Number(unitFactor.replace(",", "."));
    if (!unitName.trim()) {
      setFormError("Escribe el nombre de la presentación (ej. Caja).");
      return;
    }
    if (!Number.isFinite(factor) || factor <= 0) {
      setFormError("Indica cuántas unidades trae la presentación (número mayor a cero, ej. 24).");
      return;
    }
    const price = unitPrice.trim() === "" ? null : Number(unitPrice.replace(",", "."));
    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      setFormError("El precio debe ser un número válido.");
      return;
    }

    setSavingUnit(true);
    setFormError(null);
    try {
      let unitId = editingUnitId;
      if (editingUnitId) {
        await updateUnit(db, editingUnitId, {
          name: unitName.trim(),
          factor,
          is_base: unitIsBase ? 1 : 0,
        });
      } else {
        const created = await createUnit(db, {
          product_id: product.id,
          name: unitName.trim(),
          factor,
          is_base: unitIsBase ? 1 : 0,
        });
        unitId = created?.id ?? null;
      }
      if (unitId && price !== null) {
        await upsertPrice(db, { product_id: product.id, unit_id: unitId, price });
      }
      resetUnitForm();
      await load();
      forceRefreshProducts();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo guardar la presentación.");
    } finally {
      setSavingUnit(false);
    }
  }, [db, editingUnitId, load, product, resetUnitForm, unitFactor, unitIsBase, unitName, unitPrice]);

  const removeUnit = useCallback(
    async (unitId: string) => {
      setFormError(null);
      try {
        await deleteUnit(db, unitId);
        if (editingUnitId === unitId) resetUnitForm();
        await load();
        forceRefreshProducts();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "No se pudo eliminar.");
      }
    },
    [db, editingUnitId, load, resetUnitForm],
  );

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <ScrollView contentContainerClassName="gap-4 px-5 pt-12 pb-12">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full items-center justify-center border bg-surface border-border"
          >
            <MaterialCommunityIcons name="arrow-left" size={20} color={palette.text} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-eyebrow uppercase text-accent">Ficha de producto</Text>
            <Text className="text-title text-content" numberOfLines={1}>
              {product?.name ?? "Cargando…"}
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator color={palette.accent} />
          </View>
        ) : error || !product ? (
          <View className="rounded-2xl border p-5 bg-surface border-border">
            <Text className="text-content">{error ?? "Sin datos."}</Text>
          </View>
        ) : (
          <>
            <View className="rounded-[20px] border p-4 gap-3 bg-surface border-border">
              <View className="flex-row items-center gap-3">
                {product.image_path ? (
                  <Image
                    source={{ uri: product.image_path }}
                    style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: palette.border }}
                    contentFit="cover"
                  />
                ) : (
                  <View className="w-16 h-16 rounded-2xl items-center justify-center bg-accent-soft">
                    <MaterialCommunityIcons name="package-variant" size={26} color={palette.accent} />
                  </View>
                )}
                <View className="flex-1 gap-1">
                  <Text className="text-button-label text-content">{product.name}</Text>
                  <Text className="text-body-muted text-content-muted">
                    {product.description ?? "Sin descripción"}
                  </Text>
                </View>
              </View>
              <View className="rounded-2xl overflow-hidden bg-background border border-border">
                <View className="flex-row items-center justify-between px-3.5 py-3 border-b border-border">
                  <Text className="text-body-muted uppercase text-content-muted" numberOfLines={1}>
                    Stock
                  </Text>
                  <Text className="text-metric-value text-content text-right">
                    {Number(product.current_stock || 0)}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between px-3.5 py-3 border-b border-border">
                  <Text
                    className="text-body-muted uppercase text-content-muted shrink-0"
                    numberOfLines={1}
                  >
                    Costo medio
                  </Text>
                  <Text className="text-metric-value text-content text-right flex-1" numberOfLines={1}>
                    ${Number(product.average_cost || 0).toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between px-3.5 py-3">
                  <Text className="text-body-muted uppercase text-content-muted" numberOfLines={1}>
                    Último costo
                  </Text>
                  <Text className="text-metric-value text-accent text-right" numberOfLines={1}>
                    ${Number(product.last_cost || 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-section-title text-content">Presentaciones</Text>
              <Text className="text-body-muted text-content-muted">
                Define cómo se maneja este producto: Unidad, Caja, Saco… e indica cuántas unidades trae cada presentación. Ej. una Caja trae 24 unidades.
              </Text>
            </View>

            {units.map((unit) => (
              <View key={unit.id} className="rounded-2xl border p-4 gap-2 bg-surface border-border">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-button-label text-content">
                      {unit.name} × {Number(unit.factor)}
                      {Number(unit.is_base) === 1 ? "  ·  principal" : ""}
                    </Text>
                    <Text className="text-body-muted text-content-muted">
                      Precio:{" "}
                      {priceByUnit.get(unit.id)
                        ? `$${Number(priceByUnit.get(unit.id)!.price).toFixed(2)}`
                        : "sin precio"}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => startEditUnit(unit)}
                      className="px-3 py-2 rounded-xl bg-accent-soft"
                    >
                      <Text className="text-chip uppercase text-accent">Editar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => void removeUnit(unit.id)}
                      className="px-3 py-2 rounded-xl bg-danger/12"
                    >
                      <Text className="text-chip uppercase text-danger">Borrar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}

            {units.length === 0 ? (
              <View className="rounded-2xl border p-4 bg-surface border-border">
                <Text className="text-body-muted text-content-muted">
                  Aún no hay presentaciones. Crea la primera, por ejemplo Unidad ×1 como principal.
                </Text>
              </View>
            ) : null}

            <View className="rounded-[20px] border p-4 gap-3 bg-surface border-border">
              <Text className="text-button-label text-content">
                {editingUnitId ? "Editar presentación" : "Nueva presentación"}
              </Text>
              <View className="gap-2">
                <Text className="text-body-muted text-content-muted">Nombre</Text>
                <TextInput
                  value={unitName}
                  onChangeText={setUnitName}
                  placeholder="Ej. Caja, Saco, Botella"
                  placeholderTextColor={palette.textMuted}
                  className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                />
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1 gap-2">
                  <Text className="text-body-muted text-content-muted">Unidades</Text>
                  <TextInput
                    value={unitFactor}
                    onChangeText={setUnitFactor}
                    keyboardType="decimal-pad"
                    placeholder="24"
                    placeholderTextColor={palette.textMuted}
                    className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Text className="text-body-muted text-content-muted">Precio</Text>
                  <TextInput
                    value={unitPrice}
                    onChangeText={setUnitPrice}
                    keyboardType="decimal-pad"
                    placeholder="Opcional"
                    placeholderTextColor={palette.textMuted}
                    className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                  />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-body-muted text-content-muted">Es la unidad base</Text>
                <Switch value={unitIsBase} onValueChange={setUnitIsBase} />
              </View>
              {formError ? (
                <View className="rounded-xl px-3 py-2.5 bg-danger/10 border border-danger/20">
                  <Text className="text-body-muted text-danger">{formError}</Text>
                </View>
              ) : null}
              <View className="flex-row gap-3">
                {editingUnitId ? (
                  <Pressable
                    onPress={resetUnitForm}
                    className="flex-1 border rounded-[14px] py-3 items-center border-border"
                  >
                    <Text className="text-button-label text-content">Cancelar</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={() => void saveUnit()}
                  disabled={savingUnit}
                  className="flex-1 rounded-2xl px-3.5 py-3 items-center bg-accent"
                  style={({ pressed }) => (pressed || savingUnit ? { opacity: 0.8 } : undefined)}
                >
                  <Text className="text-button-label text-accent">
                    {savingUnit ? "Guardando…" : editingUnitId ? "Actualizar" : "Agregar"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
