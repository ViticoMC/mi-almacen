import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, Badge, Button, Card, MoneyText, TextField } from "@/components/ui";
import type { UpdateProductInput } from "@/database/repositories/products.repository";
import type { Product } from "@/database/types";
import {
  MAX_MARGIN_PERCENT,
  calculateSalePrice,
  clampMargin,
  effectiveMargin,
  formatPercent,
  parseMoneyInput,
} from "@/database/utils/money";
import { formatQuantity, parseQuantityInput } from "@/database/utils/quantity";
import { sanitizeDecimalInput, sanitizeMoneyInput } from "@/utils/input";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
  submitting?: boolean;
  onSubmit: (input: UpdateProductInput) => Promise<void> | void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  unit?: string;
  minStock?: string;
  margin?: string;
  salePrice?: string;
}

function marginToInput(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return String(value).replace(".", ",");
}

function SummaryRow({ label, value }: { label: string; value: number | null }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <AppText variant="muted">{label}</AppText>
      <MoneyText value={value} />
    </View>
  );
}

export function ProductForm({
  mode,
  product,
  submitting = false,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const insets = useSafeAreaInsets();
  const cost = product?.currentPrice ?? null;
  const hasCost = cost != null && cost > 0;

  const [name, setName] = useState(product?.name ?? "");
  const [unit, setUnit] = useState(product?.unit ?? "");
  const [minStock, setMinStock] = useState(
    product ? formatQuantity(product.minStock) : "0",
  );
  const [margin, setMargin] = useState(
    product ? marginToInput(product.marginPercent) : "0",
  );
  const [salePrice, setSalePrice] = useState(
    product?.salePrice != null ? String(product.salePrice) : "",
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const rawMargin = parseQuantityInput(margin);
  const marginValue = clampMargin(rawMargin);
  const salePriceValue = salePrice ? parseMoneyInput(salePrice) : 0;
  const computedPrice =
    cost != null && cost > 0 ? calculateSalePrice(cost, marginValue) : null;
  const effective =
    cost != null && cost > 0 && salePriceValue > 0
      ? effectiveMargin(cost, salePriceValue)
      : null;

  function handleMarginChange(text: string) {
    const next = sanitizeDecimalInput(text);
    setMargin(next);
    setErrors((current) => ({ ...current, margin: undefined, salePrice: undefined }));

    if (cost != null && cost > 0) {
      const nextMargin = clampMargin(parseQuantityInput(next));
      setSalePrice(String(calculateSalePrice(cost, nextMargin)));
    }
  }

  function handleSalePriceChange(text: string) {
    const next = sanitizeMoneyInput(text);
    setSalePrice(next);

    if (cost == null || cost <= 0) return;
    const value = next ? parseMoneyInput(next) : 0;
    const nextMargin = value > 0 ? effectiveMargin(cost, value) : null;

    if (value > 0 && value < cost) {
      setErrors((current) => ({
        ...current,
        salePrice: "El precio no puede ser menor al costo.",
      }));
      return;
    }

    if (nextMargin != null && nextMargin >= 30) {
      setErrors((current) => ({
        ...current,
        salePrice: "El margen debe ser menor a 30%.",
      }));
      return;
    }

    setErrors((current) => ({ ...current, salePrice: undefined }));
    if (nextMargin != null) {
      setMargin(marginToInput(Math.round(nextMargin * 100) / 100));
    }
  }

  function handleSalePriceBlur() {
    if (cost == null || cost <= 0) return;
    const value = parseMoneyInput(salePrice);

    if (value <= 0) return;

    if (value < cost) {
      setSalePrice(String(cost));
      setMargin("0");
      setErrors((current) => ({ ...current, salePrice: undefined }));
      return;
    }

    if (effectiveMargin(cost, value) >= 30) {
      setMargin(marginToInput(MAX_MARGIN_PERCENT));
      setSalePrice(String(calculateSalePrice(cost, MAX_MARGIN_PERCENT)));
      setErrors((current) => ({ ...current, salePrice: undefined }));
    }
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (name.trim().length < 2) {
      next.name = "Escribe un nombre de al menos 2 caracteres.";
    }
    if (!unit.trim()) {
      next.unit = "Escribe la unidad: g, lb, unidad…";
    }
    if (parseQuantityInput(minStock) < 0) {
      next.minStock = "El stock mínimo no puede ser negativo.";
    }
    if (rawMargin < 0 || rawMargin >= 30) {
      next.margin = "El margen debe estar entre 0% y 29,9%.";
    }
    if (cost != null && cost > 0) {
      if (!salePrice || salePriceValue <= 0) {
        next.salePrice = "Define el precio de salida.";
      } else if (salePriceValue < cost) {
        next.salePrice = "El precio no puede ser menor al costo.";
      } else if (effectiveMargin(cost, salePriceValue) >= 30) {
        next.salePrice = "El margen debe ser menor a 30%.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (submitting || !validate()) return;

    await onSubmit({
      name: name.trim(),
      unit: unit.trim(),
      minStock: Math.max(0, parseQuantityInput(minStock)),
      marginPercent: marginValue,
      salePrice: cost != null && cost > 0 ? salePriceValue : undefined,
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
        <Card className="gap-4">
          <AppText variant="title">
            {mode === "create" ? "Datos del producto" : "Editar producto"}
          </AppText>

          <TextField
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Ej. Pollo"
            autoFocus={mode === "create"}
            returnKeyType="next"
            error={errors.name}
          />

          <TextField
            label="Unidad o pesaje"
            value={unit}
            onChangeText={setUnit}
            placeholder="Ej. lb, kg, unidad"
            autoCapitalize="none"
            error={errors.unit}
          />

          <TextField
            label="Stock mínimo"
            value={minStock}
            onChangeText={(text) => setMinStock(sanitizeDecimalInput(text))}
            keyboardType="decimal-pad"
            hint="Se muestra una alerta cuando el stock llegue a este valor. 0 = sin alerta."
            error={errors.minStock}
          />
        </Card>

        <Card className="gap-4">
          <View className="flex-row items-center justify-between gap-3">
            <AppText variant="title">Ganancia</AppText>
            <Badge tone="accent" label={formatPercent(marginValue)} />
          </View>

          <TextField
            label="Ganancia (%)"
            value={margin}
            onChangeText={handleMarginChange}
            keyboardType="decimal-pad"
            hint={`Máximo ${formatPercent(MAX_MARGIN_PERCENT)} por ley.`}
            error={errors.margin}
          />

          {hasCost ? (
            <>
              <TextField
                label="Precio de salida"
                value={salePrice}
                onChangeText={handleSalePriceChange}
                onBlur={handleSalePriceBlur}
                keyboardType="number-pad"
                error={errors.salePrice}
              />

              <View className="gap-2 rounded-xl bg-background p-3">
                <AppText variant="caption">Vista previa</AppText>
                <SummaryRow label="Costo actual" value={cost} />
                <SummaryRow
                  label="Precio de venta"
                  value={salePriceValue > 0 ? salePriceValue : computedPrice}
                />
                <View className="flex-row items-center justify-between gap-3">
                  <AppText variant="muted">Margen efectivo</AppText>
                  <AppText variant="body" className="font-semibold text-success">
                    {formatPercent(effective ?? 0)}
                  </AppText>
                </View>
              </View>
            </>
          ) : (
            <AppText variant="muted">
              El costo y el precio de salida se definen al registrar la primera
              compra. Puedes dejar el margen configurado desde ahora.
            </AppText>
          )}
        </Card>
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
            label={mode === "create" ? "Crear producto" : "Guardar cambios"}
            className="flex-1"
            loading={submitting}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
