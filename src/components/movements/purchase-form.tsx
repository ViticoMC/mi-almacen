import { useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <AppText variant="muted">{label}</AppText>
      {children}
    </View>
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

  function handleSelect(product: Product) {
    setSelectedProduct(product);
    setErrors((current) => ({ ...current, product: undefined }));
    setPickerVisible(false);
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

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (submitting || !validate() || !selectedProduct) return;

    await onSubmit({
      productId: selectedProduct.id,
      quantity,
      total,
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

            {preview.newSalePrice != null ? (
              <>
                <SummaryRow label="Precio de salida">
                  <View className="flex-row items-center gap-2">
                    {preview.previousSalePrice != null ? (
                      <MoneyText
                        value={preview.previousSalePrice}
                        className="text-content-muted"
                        style={{ textDecorationLine: "line-through" }}
                      />
                    ) : null}
                    <MoneyText
                      value={preview.newSalePrice}
                      className="font-semibold text-accent"
                    />
                  </View>
                </SummaryRow>
                <SummaryRow label="Margen efectivo">
                  <AppText variant="body" className="font-semibold text-success">
                    {formatPercent(preview.effectiveMargin)}
                  </AppText>
                </SummaryRow>
              </>
            ) : (
              <AppText variant="muted">
                Este producto no tiene ganancia configurada. El precio de salida
                no se actualizará. Puedes configurarlo desde la edición del
                producto.
              </AppText>
            )}
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
        onClose={() => setPickerVisible(false)}
        onSelect={handleSelect}
      />
    </KeyboardAvoidingView>
  );
}
