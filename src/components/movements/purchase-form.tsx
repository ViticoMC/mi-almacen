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
  buildPurchasePreview,
  type PurchaseInput,
  type SalePriceStrategy,
} from "@/database/repositories/purchases.repository";
import type { Product } from "@/database/types";
import {
  formatPercent,
  parseMoneyInput,
} from "@/database/utils/money";
import {
  formatQuantity,
  parseQuantityInput,
  roundQuantity,
} from "@/database/utils/quantity";
import { usePalette } from "@/theme/colors";
import { sanitizeDecimalInput, sanitizeMoneyInput } from "@/utils/input";

interface PurchaseFormProps {
  initialProduct?: Product | null;
  submitting?: boolean;
  onSubmit: (input: PurchaseInput) => Promise<void> | void;
  onCancel: () => void;
}

interface FormErrors {
  product?: string;
  quantity?: string;
  total?: string;
  price?: string;
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <AppText variant="muted">{label}</AppText>
      {children}
    </View>
  );
}

function defaultSalePriceStrategy(product: Product | null): SalePriceStrategy {
  if (product && product.marginPercent > 0) return "margin";
  if (product && product.salePrice != null) return "keep";
  return "margin";
}

function PriceOption({
  title,
  description,
  price,
  margin,
  selected,
  disabled = false,
  warning,
  onPress,
}: {
  title: string;
  description: string;
  price: number | null;
  margin: number | null;
  selected: boolean;
  disabled?: boolean;
  warning?: string | null;
  onPress: () => void;
}) {
  const palette = usePalette();
  const marginTone =
    margin == null
      ? palette.contentMuted
      : margin < 0 || margin >= 30
        ? palette.danger
        : palette.success;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        gap: 8,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: selected ? palette.accent : palette.border,
        backgroundColor: selected ? palette.accentSoft : palette.surface,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <AppText className="font-semibold">{title}</AppText>
          <AppText variant="caption">{description}</AppText>
        </View>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 1.5,
            borderColor: selected ? palette.accent : palette.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selected ? (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: palette.accent,
              }}
            />
          ) : null}
        </View>
      </View>

      <View className="flex-row items-end justify-between gap-3">
        <MoneyText value={price} className="font-semibold" />
        <View className="items-end gap-0.5">
          <AppText variant="caption">Nuevo margen</AppText>
          <AppText className="font-semibold" style={{ color: marginTone }}>
            {formatPercent(margin)}
          </AppText>
        </View>
      </View>

      {warning ? (
        <AppText variant="caption" className="text-danger">
          {warning}
        </AppText>
      ) : null}
    </Pressable>
  );
}

export function PurchaseForm({
  initialProduct,
  submitting = false,
  onSubmit,
  onCancel,
}: PurchaseFormProps) {
  const insets = useSafeAreaInsets();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialProduct ?? null,
  );
  const [quantityInput, setQuantityInput] = useState("");
  const [totalInput, setTotalInput] = useState("");
  const [salePriceStrategy, setSalePriceStrategy] = useState<SalePriceStrategy>(
    defaultSalePriceStrategy(initialProduct ?? null),
  );
  const [pickerVisible, setPickerVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const quantity = parseQuantityInput(quantityInput);
  const total = parseMoneyInput(totalInput);
  const preview =
    selectedProduct && quantity > 0 && total > 0
      ? buildPurchasePreview(selectedProduct, quantity, total)
      : null;
  const newStock =
    selectedProduct && quantity > 0
      ? roundQuantity(selectedProduct.stock + quantity)
      : null;
  const hasPriceOptions =
    preview != null &&
    (preview.marginSalePrice != null || preview.previousSalePrice != null);

  function handleSelect(product: Product) {
    setSelectedProduct(product);
    setSalePriceStrategy(defaultSalePriceStrategy(product));
    setErrors((current) => ({ ...current, product: undefined, price: undefined }));
    setPickerVisible(false);
  }

  function handlePriceStrategy(strategy: SalePriceStrategy) {
    setSalePriceStrategy(strategy);
    setErrors((current) => ({ ...current, price: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (!selectedProduct) {
      next.product = "Selecciona un producto.";
    }
    if (quantity <= 0) {
      next.quantity = "Ingresa una cantidad mayor a cero.";
    }
    if (total <= 0) {
      next.total = "Ingresa el total pagado.";
    }
    if (preview && salePriceStrategy === "keep" && !preview.canKeepPrice) {
      next.price =
        preview.previousSalePrice == null
          ? "Este producto no tiene un precio de salida para mantener."
          : "Mantener el precio actual supera el margen máximo del 30%. Recalcula el precio.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (submitting || !validate() || !selectedProduct) return;

    await onSubmit({
      productId: selectedProduct.id,
      quantity,
      total,
      salePriceStrategy,
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
          <AppText variant="title">Datos de la compra</AppText>

          <TextField
            label={selectedProduct ? `Cantidad (${selectedProduct.unit})` : "Cantidad"}
            value={quantityInput}
            onChangeText={(text) => setQuantityInput(sanitizeDecimalInput(text))}
            keyboardType="decimal-pad"
            placeholder="Ej. 100"
            error={errors.quantity}
          />

          <TextField
            label="Total pagado"
            value={totalInput}
            onChangeText={(text) => setTotalInput(sanitizeMoneyInput(text))}
            keyboardType="number-pad"
            placeholder="Ej. 10000"
            hint="El costo unitario se calcula dividiendo el total entre la cantidad."
            error={errors.total}
          />
        </Card>

        {preview ? (
          <Card className="gap-3">
            <View className="flex-row items-center justify-between gap-3">
              <AppText variant="title">Vista previa</AppText>
              <Badge tone="accent" label="Compra" />
            </View>

            <SummaryRow label="Costo unitario">
              <MoneyText value={preview.newCost} className="font-semibold" />
            </SummaryRow>
            <SummaryRow label="Costo anterior">
              <MoneyText value={preview.previousCost} />
            </SummaryRow>
            <SummaryRow label="Nuevo costo">
              <MoneyText value={preview.newCost} className="font-semibold" />
            </SummaryRow>
            <SummaryRow label="Stock actual">
              <AppText variant="body">
                {formatQuantity(selectedProduct?.stock ?? 0)}{" "}
                {selectedProduct?.unit}
              </AppText>
            </SummaryRow>
            <SummaryRow label="Nuevo stock">
              <AppText variant="body" className="font-semibold">
                {formatQuantity(newStock)} {selectedProduct?.unit}
              </AppText>
            </SummaryRow>

            <View className="h-px bg-border" />

            <SummaryRow label="Ganancia definida">
              <AppText variant="body" className="font-semibold text-accent">
                {formatPercent(preview.marginPercent)}
              </AppText>
            </SummaryRow>

            <View className="h-px bg-border" />

            <View className="gap-1">
              <AppText variant="title">Precio de salida</AppText>
              <AppText variant="muted">
                Elige qué hacer con el precio de venta al actualizar el costo.
              </AppText>
            </View>

            {hasPriceOptions ? (
              <View className="gap-2">
                <PriceOption
                  title="Recalcular según margen"
                  description={
                    preview.marginSalePrice != null
                      ? `Mantiene el margen definido de ${formatPercent(preview.marginPercent)}.`
                      : "El producto no tiene un margen mayor a cero."
                  }
                  price={preview.marginSalePrice}
                  margin={preview.marginEffectiveMargin}
                  selected={salePriceStrategy === "margin"}
                  disabled={preview.marginSalePrice == null}
                  onPress={() => handlePriceStrategy("margin")}
                />

                <PriceOption
                  title="Mantener precio actual"
                  description={
                    preview.previousSalePrice != null
                      ? "Conserva el precio de salida existente."
                      : "El producto no tiene un precio de salida actual."
                  }
                  price={preview.previousSalePrice}
                  margin={preview.keptEffectiveMargin}
                  selected={salePriceStrategy === "keep"}
                  disabled={!preview.canKeepPrice}
                  warning={
                    preview.keptEffectiveMargin != null &&
                    preview.keptEffectiveMargin < 0
                      ? "Venderías por debajo del costo."
                      : preview.keptEffectiveMargin != null &&
                          preview.keptEffectiveMargin >= 30
                        ? "Supera el margen máximo del 30%."
                        : null
                  }
                  onPress={() => handlePriceStrategy("keep")}
                />
              </View>
            ) : (
              <AppText variant="muted">
                Este producto no tiene margen ni precio de salida configurado. La
                compra solo actualizará el costo y el stock.
              </AppText>
            )}

            {errors.price ? (
              <AppText variant="caption" className="text-danger">
                {errors.price}
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
            label="Registrar compra"
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
