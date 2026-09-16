import type { ThemePalette } from "@/components/index/types";
import {
  createPurchase,
  createSale,
  getPrice,
  listUnitsByProduct,
  type ProductUnitRow,
  type ProductWithMetrics,
  type PurchaseItemDraft,
  type SaleItemDraft,
} from "@/database";
import { createId } from "@/database/utils/ids";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { SQLiteDatabase } from "expo-sqlite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type DocumentKind = "IN" | "OUT";

type LineDraft = {
  key: string;
  product_id: string | null;
  unit_id: string | null;
  quantity: string;
  price: string;
};

type DocumentFormProps = {
  kind: DocumentKind;
  db: SQLiteDatabase;
  products: ProductWithMetrics[];
  palette: ThemePalette;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

const moneyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

function emptyLine(): LineDraft {
  return { key: createId("line"), product_id: null, unit_id: null, quantity: "1", price: "" };
}

export default function DocumentForm({ kind, db, products, palette, onClose, onSaved }: DocumentFormProps) {
  const isEntry = kind === "IN";
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);
  const [unitsByProduct, setUnitsByProduct] = useState<Record<string, ProductUnitRow[]>>({});
  const [invoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeProducts = useMemo(
    () => products.filter((p) => Number(p.active) === 1),
    [products],
  );

  const productItems = useMemo(
    () =>
      activeProducts.map((p) => ({
        label: `${p.name} · Stock: ${Number(p.current_stock || 0)}`,
        value: p.id,
      })),
    [activeProducts],
  );

  const ensureUnits = useCallback(
    async (productId: string) => {
      if (unitsByProduct[productId]) return unitsByProduct[productId];
      const rows = await listUnitsByProduct(db, productId);
      setUnitsByProduct((prev) => ({ ...prev, [productId]: rows }));
      return rows;
    },
    [db, unitsByProduct],
  );

  useEffect(() => {
    // Carga bajo demanda las presentaciones de cada producto elegido (SQLite es sistema externo).
    for (const line of lines) {
      if (line.product_id && !unitsByProduct[line.product_id]) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void ensureUnits(line.product_id).then((rows) => {
          if (rows.length > 0) {
            setLines((prev) =>
              prev.map((l) =>
                l.key === line.key && !l.unit_id ? { ...l, unit_id: rows[0].id } : l,
              ),
            );
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.map((l) => `${l.key}:${l.product_id}`).join(",")]);

  const prefillPrice = useCallback(
    async (lineKey: string, productId: string, unitId: string) => {
      try {
        const found = await getPrice(db, productId, unitId);
        if (found) {
          setLines((prev) => prev.map((l) => (l.key === lineKey && !l.price ? { ...l, price: String(found.price) } : l)));
        }
      } catch {
        // precio opcional, ignorar
      }
    },
    [db],
  );

  const updateLine = useCallback((key: string, patch: Partial<LineDraft>) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }, []);

  const addLine = useCallback(() => {
    setLines((prev) => [...prev, emptyLine()]);
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.key !== key)));
  }, []);

  const subtotal = useMemo(() => {
    return lines.reduce((sum, l) => {
      const qty = Number(String(l.quantity).replace(",", "."));
      const price = Number(String(l.price).replace(",", "."));
      if (!Number.isFinite(qty) || !Number.isFinite(price)) return sum;
      return sum + qty * price;
    }, 0);
  }, [lines]);

  const save = useCallback(async () => {
    setSubmitError(null);
    if (lines.length === 0) {
      setSubmitError("Agrega al menos un producto.");
      return;
    }

    const items: PurchaseItemDraft[] | SaleItemDraft[] = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.product_id) {
        setSubmitError(`Línea ${i + 1}: selecciona un producto.`);
        return;
      }
      const units = unitsByProduct[line.product_id] ?? (await ensureUnits(line.product_id));
      const unitId = line.unit_id ?? units[0]?.id ?? null;
      if (!unitId) {
        setSubmitError(
          `Línea ${i + 1}: este producto no tiene presentación. Créala en su ficha.`,
        );
        return;
      }
      const quantity = Number(String(line.quantity).replace(",", "."));
      const price = Number(String(line.price).replace(",", "."));
      if (!Number.isFinite(quantity) || quantity <= 0) {
        setSubmitError(`Línea ${i + 1}: cantidad inválida.`);
        return;
      }
      if (!Number.isFinite(price) || price < 0) {
        setSubmitError(`Línea ${i + 1}: precio inválido.`);
        return;
      }
      if (isEntry) {
        (items as PurchaseItemDraft[]).push(
          { product_id: line.product_id, unit_id: unitId, quantity, unit_cost: price },
        );
      } else {
        (items as SaleItemDraft[]).push(
          { product_id: line.product_id, unit_id: unitId, quantity, unit_price: price },
        );
      }
    }

    setSaving(true);
    try {
      if (isEntry) {
        await createPurchase(db, {
          invoice_number: invoiceNumber.trim() || null,
          notes: notes.trim() || null,
          items: items as PurchaseItemDraft[],
        });
      } else {
        await createSale(db, { notes: notes.trim() || null, items: items as SaleItemDraft[] });
      }
      await onSaved();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo guardar el documento.");
    } finally {
      setSaving(false);
    }
  }, [db, ensureUnits, invoiceNumber, isEntry, lines, notes, onClose, onSaved, unitsByProduct]);

  return (
    <View className="flex-1 min-h-0">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerClassName="gap-4 pb-3"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-2">
          {/* <Text className="text-body-muted text-content-muted">
          {isEntry ? "Cada línea: producto + presentación + cantidad + costo." : "Cada línea: producto + presentación + cantidad + precio."}
        </Text> */}
          <Text className="text-body-muted text-content-muted">
            La presentación se configura en la ficha del producto.
          </Text>
        </View>

        {/* {isEntry ? (
        <View className="gap-2">
          <Text className="text-body-muted text-content-muted">Folio / Factura (opcional)</Text>
          <TextInput
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="F-0001"
            placeholderTextColor={palette.textMuted}
            className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
          />
        </View>
      ) : null} */}

        {lines.map((line, index) => {
          const units = line.product_id ? (unitsByProduct[line.product_id] ?? []) : [];
          const selectedUnit = units.find((u) => u.id === line.unit_id) ?? null;
          const qty = Number(String(line.quantity).replace(",", "."));
          const price = Number(String(line.price).replace(",", "."));
          const factor = selectedUnit ? Number(selectedUnit.factor) : null;
          const baseQty = factor !== null && Number.isFinite(qty) ? qty * factor : null;
          const lineTotal = Number.isFinite(qty) && Number.isFinite(price) ? qty * price : null;

          return (
            <View key={line.key} className="rounded-2xl border p-3 gap-3 bg-background border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-button-label text-content">Producto {index + 1}</Text>
                <Pressable onPress={() => removeLine(line.key)} hitSlop={8}>
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color={palette.textMuted} />
                </Pressable>
              </View>

              <LineProductPicker
                value={line.product_id}
                items={productItems}
                palette={palette}
                onChange={(value) => {
                  updateLine(line.key, { product_id: value, unit_id: null, price: "" });
                }}
              />

              {line.product_id ? (
                <View className="gap-2">
                  <Text className="text-body-muted text-content-muted">Presentación</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {units.map((unit) => {
                      const selected = line.unit_id === unit.id;
                      return (
                        <Pressable
                          key={unit.id}
                          onPress={() => {
                            updateLine(line.key, { unit_id: unit.id });
                            void prefillPrice(line.key, line.product_id!, unit.id);
                          }}
                          className="px-3 py-2 rounded-2xl border"
                          style={{
                            backgroundColor: selected ? palette.accentSoft : palette.background,
                            borderColor: selected ? palette.accent : palette.border,
                          }}
                        >
                          <Text
                            className={selected ? "text-button-label text-accent" : "text-button-label text-content"}
                          >
                            {unit.name} × {Number(unit.factor)}
                            {Number(unit.is_base) === 1 ? " · principal" : ""}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {units.length === 0 ? (
                    <Text className="text-body-muted text-content-muted">
                      Sin presentaciones: se creará “Unidad ×1” al guardar, o créalas en la ficha.
                    </Text>
                  ) : null}
                  {selectedUnit && baseQty !== null ? (
                    <Text className="text-body-muted text-content-muted">
                      Equivale a {baseQty} unidades · Total:{" "}
                      {lineTotal !== null ? moneyFormatter.format(lineTotal) : "—"}
                    </Text>
                  ) : null}
                </View>
              ) : null}

              <View className="flex-row gap-3">
                <View className="flex-1 gap-2">
                  <Text className="text-body-muted text-content-muted">Cantidad</Text>
                  <TextInput
                    value={line.quantity}
                    onChangeText={(value) => updateLine(line.key, { quantity: value })}
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={palette.textMuted}
                    className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Text className="text-body-muted text-content-muted">
                    {isEntry ? "Costo" : "Precio"}
                  </Text>
                  <TextInput
                    value={line.price}
                    onChangeText={(value) => updateLine(line.key, { price: value })}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={palette.textMuted}
                    className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                  />
                </View>
              </View>
            </View>
          );
        })}

        <Pressable
          onPress={addLine}
          className="flex-row items-center justify-center gap-2 rounded-2xl py-3 border border-dashed border-border bg-background"
        >
          <MaterialCommunityIcons name="plus" size={18} color={palette.accent} />
          <Text className="text-button-label text-accent">Agregar otro producto</Text>
        </Pressable>

        <View className="gap-2">
          <Text className="text-body-muted text-content-muted">Notas</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notas adicionales (opcional)"
            placeholderTextColor={palette.textMuted}
            multiline
            className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background min-h-[70px]"
            style={{ textAlignVertical: "top" }}
          />
        </View>

        {submitError ? (
          <View className="rounded-xl px-3 py-2.5 bg-danger/10 border border-danger/20">
            <Text className="text-body-muted text-danger">{submitError}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View className="shrink-0 pt-3 gap-3 border-t border-border">
        <View className="flex-row items-center justify-between rounded-2xl px-4 py-3 bg-accent-soft">
          <Text className="text-body-muted text-content-muted">Subtotal ({lines.length})</Text>
          <Text className="text-metric-value text-content">{moneyFormatter.format(subtotal)}</Text>
        </View>
        <View className="flex-row gap-3">
          <Pressable
            onPress={onClose}
            className="flex-1 border rounded-[14px] py-3 items-center border-border"
          >
            <Text className="text-button-label text-content">Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={() => void save()}
            disabled={saving}
            className="flex-1 rounded-2xl px-3.5 py-3 items-center bg-accent"
            style={({ pressed }) => (pressed || saving ? { opacity: 0.8 } : undefined)}
          >
            <Text className="text-button-label text-on-accent">
              {saving ? "Guardando…" : isEntry ? "Guardar entrada" : "Guardar salida"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function LineProductPicker({
  value,
  items,
  palette,
  onChange,
}: {
  value: string | null;
  items: { label: string; value: string }[];
  palette: ThemePalette;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ zIndex: open ? 4000 : 0 }}>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={(next) => {
          const resolved = typeof next === "function" ? next(value) : next;
          if (typeof resolved === "string") onChange(resolved);
        }}
        items={items}
        placeholder="Selecciona un producto"
        searchable
        searchPlaceholder="Buscar producto"
        listMode="MODAL"
        modalTitle="Selecciona un producto"
        zIndex={4000}
        zIndexInverse={4000}
        theme="LIGHT"
        style={{
          borderRadius: 14,
          borderColor: palette.border,
          backgroundColor: palette.background,
          minHeight: 48,
        }}
        dropDownContainerStyle={{
          borderRadius: 14,
          borderColor: palette.border,
          backgroundColor: palette.surfaceStrong,
        }}
        labelStyle={{ fontSize: 15, fontWeight: "600", color: palette.text }}
        textStyle={{ fontSize: 15, color: palette.text }}
      />
    </View>
  );
}
