import { useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductPicker } from "@/components/products/product-picker";
import {
  AppText,
  Badge,
  Button,
  Card,
  MoneyText,
  TextField,
} from "@/components/ui";
import {
  buildAdjustmentPreview,
  type AdjustmentDirection,
  type AdjustmentInput,
  type AdjustmentMode,
} from "@/database/repositories/adjustments.repository";
import type { Product } from "@/database/types";
import {
  formatQuantity,
  parseQuantityInput,
} from "@/database/utils/quantity";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";
import { sanitizeDecimalInput } from "@/utils/input";

interface AdjustmentFormProps {
  initialProduct?: Product | null;
  submitting?: boolean;
  onSubmit: (input: AdjustmentInput) => Promise<void> | void;
  onCancel: () => void;
}

interface FormErrors {
  product?: string;
  quantity?: string;
  counted?: string;
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <AppText variant="muted">{label}</AppText>
      {children}
    </View>
  );
}

function formatDelta(value: number): string {
  if (value === 0) return formatQuantity(0);
  const formatted = formatQuantity(Math.abs(value));
  return value > 0 ? `+${formatted}` : `-${formatted}`;
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: AdjustmentMode;
  onChange: (mode: AdjustmentMode) => void;
}) {
  const palette = usePalette();
  const options: { value: AdjustmentMode; label: string }[] = [
    { value: "direct", label: "Directo" },
    { value: "count", label: "Por conteo" },
  ];

  return (
    <View className="flex-row rounded-xl border border-border bg-surface p-1">
      {options.map((option) => {
        const selected = option.value === mode;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={{
              flex: 1,
              alignItems: "center",
              borderRadius: 8,
              paddingVertical: 8,
              backgroundColor: selected ? palette.accentSoft : undefined,
            }}
          >
            <AppText
              variant="caption"
              className={cn(
                "font-semibold",
                selected ? "text-accent" : "text-content-muted",
              )}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

function DirectionToggle({
  direction,
  onChange,
}: {
  direction: AdjustmentDirection;
  onChange: (direction: AdjustmentDirection) => void;
}) {
  const palette = usePalette();
  const options: { value: AdjustmentDirection; label: string }[] = [
    { value: "in", label: "Agregar" },
    { value: "out", label: "Quitar" },
  ];

  return (
    <View className="flex-row gap-2">
      {options.map((option) => {
        const selected = option.value === direction;
        const isOut = option.value === "out";
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={{
              flex: 1,
              alignItems: "center",
              borderRadius: 12,
              borderWidth: 1,
              paddingVertical: 10,
              borderColor: selected
                ? isOut
                  ? palette.danger
                  : palette.accent
                : palette.border,
              backgroundColor: selected
                ? isOut
                  ? palette.dangerSoft
                  : palette.accentSoft
                : palette.surface,
            }}
          >
            <AppText
              className="font-semibold"
              style={{
                color: selected
                  ? isOut
                    ? palette.danger
                    : palette.accent
                  : palette.contentMuted,
              }}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

export function AdjustmentForm({
  initialProduct,
  submitting = false,
  onSubmit,
  onCancel,
}: AdjustmentFormProps) {
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialProduct ?? null,
  );
  const [mode, setMode] = useState<AdjustmentMode>("direct");
  const [direction, setDirection] = useState<AdjustmentDirection>("in");
  const [quantityInput, setQuantityInput] = useState("");
  const [countedInput, setCountedInput] = useState(
    initialProduct ? formatQuantity(initialProduct.stock) : "",
  );
  const [reason, setReason] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const quantity = quantityInput.trim() ? parseQuantityInput(quantityInput) : null;
  const counted = countedInput.trim() ? parseQuantityInput(countedInput) : null;
  const preview = selectedProduct
    ? buildAdjustmentPreview(selectedProduct, {
        mode,
        direction,
        quantity,
        countedStock: counted,
      })
    : null;
  const isRemoval = (preview?.quantityDelta ?? 0) < 0;
  const deltaTone =
    preview == null || preview.quantityDelta === 0
      ? palette.contentMuted
      : isRemoval
        ? palette.danger
        : palette.success;

  function handleSelect(product: Product) {
    setSelectedProduct(product);
    setCountedInput(formatQuantity(product.stock));
    setErrors({});
    setPickerVisible(false);
  }

  function handleMode(next: AdjustmentMode) {
    setMode(next);
    setErrors({});
    if (next === "count" && selectedProduct) {
      setCountedInput(formatQuantity(selectedProduct.stock));
    }
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (!selectedProduct) {
      next.product = "Selecciona un producto.";
    } else if (preview && !preview.valid) {
      if (mode === "direct") {
        next.quantity = preview.issue ?? "Revisa la cantidad.";
      } else {
        next.counted = preview.issue ?? "Revisa el stock contado.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (submitting || !validate() || !selectedProduct) return;

    await onSubmit({
      productId: selectedProduct.id,
      mode,
      direction,
      quantity,
      countedStock: counted,
      reason: reason.trim() || null,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card className="gap-3">
          <View className="flex-row items-center justify-between gap-3">
            <AppText variant="title">Producto</AppText>
            {selectedProduct ? (
              <Button
                label="Cambiar"
                size="sm"
                variant="secondary"
                onPress={() => setPickerVisible(true)}
              />
            ) : null}
          </View>

          {selectedProduct ? (
            <View className="gap-1">
              <AppText className="font-semibold">{selectedProduct.name}</AppText>
              <View className="flex-row items-center gap-1">
                <AppText variant="muted">
                  {formatQuantity(selectedProduct.stock)} {selectedProduct.unit} en
                  stock · costo
                </AppText>
                {selectedProduct.currentPrice != null ? (
                  <MoneyText value={selectedProduct.currentPrice} />
                ) : (
                  <AppText variant="muted">sin definir</AppText>
                )}
              </View>
            </View>
          ) : (
            <Button
              label="Seleccionar producto"
              variant="secondary"
              onPress={() => setPickerVisible(true)}
            />
          )}

          {errors.product ? (
            <AppText variant="caption" className="text-danger">
              {errors.product}
            </AppText>
          ) : null}
        </Card>

        <Card className="gap-4">
          <View className="flex-row items-center justify-between gap-3">
            <AppText variant="title">Ajuste</AppText>
            <Badge tone="warning" label="Inventario" />
          </View>

          <ModeToggle mode={mode} onChange={handleMode} />

          {mode === "direct" ? (
            <View className="gap-3">
              <DirectionToggle
                direction={direction}
                onChange={(next) => {
                  setDirection(next);
                  setErrors((current) => ({ ...current, quantity: undefined }));
                }}
              />

              <TextField
                label={
                  selectedProduct
                    ? `Cantidad (${selectedProduct.unit})`
                    : "Cantidad"
                }
                value={quantityInput}
                onChangeText={(text) => {
                  setQuantityInput(sanitizeDecimalInput(text));
                  setErrors((current) => ({ ...current, quantity: undefined }));
                }}
                keyboardType="decimal-pad"
                placeholder="Ej. 1"
                hint={
                  direction === "in"
                    ? "La cantidad se suma al stock actual."
                    : "La cantidad se resta del stock actual."
                }
                error={errors.quantity}
              />
            </View>
          ) : (
            <TextField
              label={
                selectedProduct
                  ? `Stock contado (${selectedProduct.unit})`
                  : "Stock contado"
              }
              value={countedInput}
              onChangeText={(text) => {
                setCountedInput(sanitizeDecimalInput(text));
                setErrors((current) => ({ ...current, counted: undefined }));
              }}
              keyboardType="decimal-pad"
              placeholder="Ej. 12"
              hint={
                selectedProduct
                  ? `Stock actual: ${formatQuantity(selectedProduct.stock)} ${selectedProduct.unit}. La diferencia se calcula automáticamente.`
                  : "La diferencia se calcula automáticamente."
              }
              error={errors.counted}
            />
          )}

          <TextField
            label="Motivo (opcional)"
            value={reason}
            onChangeText={setReason}
            placeholder="Ej. conteo físico, producto dañado…"
            maxLength={160}
            autoCapitalize="sentences"
          />
        </Card>

        {preview ? (
          <Card
            className={cn(
              "gap-3",
              preview.quantityDelta === 0
                ? undefined
                : isRemoval
                  ? "border-danger-border bg-danger-soft"
                  : "border-success/25 bg-success/10",
            )}
          >
            <View className="flex-row items-center justify-between gap-3">
              <AppText variant="title">Vista previa</AppText>
              <Badge
                tone={
                  preview.quantityDelta === 0
                    ? "neutral"
                    : isRemoval
                      ? "danger"
                      : "success"
                }
                label={
                  preview.quantityDelta === 0
                    ? "Sin cambio"
                    : isRemoval
                      ? "Salida"
                      : "Entrada"
                }
              />
            </View>

            <SummaryRow label="Stock actual">
              <AppText variant="body">
                {formatQuantity(preview.stockBefore)} {preview.product.unit}
              </AppText>
            </SummaryRow>
            <SummaryRow label="Ajuste">
              <AppText style={{ color: deltaTone }} className="font-semibold">
                {formatDelta(preview.quantityDelta)} {preview.product.unit}
              </AppText>
            </SummaryRow>
            <SummaryRow label="Stock después">
              <AppText
                variant="body"
                className={
                  preview.stockAfter < 0
                    ? "font-semibold text-danger"
                    : "font-semibold"
                }
              >
                {formatQuantity(preview.stockAfter)} {preview.product.unit}
              </AppText>
            </SummaryRow>
            <SummaryRow label="Costo congelado">
              <MoneyText value={preview.unitCost} />
            </SummaryRow>

            {preview.issue ? (
              <AppText variant="caption" className="text-danger">
                {preview.issue}
              </AppText>
            ) : null}
          </Card>
        ) : null}
      </ScrollView>

      <View
        className="border-t border-border bg-surface px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View className="flex-row gap-3">
          <Button
            label="Cancelar"
            variant="outline"
            className="flex-1"
            onPress={onCancel}
            disabled={submitting}
          />
          <Button
            label="Registrar ajuste"
            className="flex-1"
            loading={submitting}
            onPress={handleSubmit}
          />
        </View>
      </View>

      <ProductPicker
        visible={pickerVisible}
        selectedId={selectedProduct?.id}
        onSelect={handleSelect}
        onClose={() => setPickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}
