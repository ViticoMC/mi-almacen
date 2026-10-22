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
  buildSalePreview,
  type SaleInput,
} from "@/database/repositories/sales.repository";
import type { Product } from "@/database/types";
import { formatPercent } from "@/database/utils/money";
import {
  formatQuantity,
  parseQuantityInput,
} from "@/database/utils/quantity";
import { usePalette } from "@/theme/colors";
import { sanitizeDecimalInput } from "@/utils/input";

interface SaleFormProps {
  initialProduct?: Product | null;
  submitting?: boolean;
  onSubmit: (input: SaleInput) => Promise<void> | void;
  onCancel: () => void;
}

interface FormErrors {
  product?: string;
  quantity?: string;
  salePrice?: string;
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <AppText variant="muted">{label}</AppText>
      {children}
    </View>
  );
}

export function SaleForm({
  initialProduct,
  submitting = false,
  onSubmit,
  onCancel,
}: SaleFormProps) {
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialProduct ?? null,
  );
  const [quantityInput, setQuantityInput] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const quantity = parseQuantityInput(quantityInput);
  const preview = selectedProduct
    ? buildSalePreview(selectedProduct, quantity)
    : null;
  const marginTone =
    preview?.marginPercent == null
      ? palette.contentMuted
      : preview.marginPercent < 0
        ? palette.danger
        : palette.success;
  const profitTone =
    preview?.totalProfit == null
      ? palette.contentMuted
      : preview.totalProfit < 0
        ? palette.danger
        : palette.success;

  function handleSelect(product: Product) {
    setSelectedProduct(product);
    setErrors({});
    setPickerVisible(false);
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (!selectedProduct) {
      next.product = "Selecciona un producto.";
    } else {
      if (selectedProduct.salePrice == null || selectedProduct.salePrice <= 0) {
        next.salePrice =
          "El producto no tiene precio de salida. Edítalo antes de vender.";
      }
      if (quantity <= 0) {
        next.quantity = "Ingresa una cantidad mayor a cero.";
      } else if (quantity > selectedProduct.stock) {
        next.quantity = `Solo hay ${formatQuantity(selectedProduct.stock)} ${selectedProduct.unit} en stock.`;
      } else if (preview?.total != null && preview.total <= 0) {
        next.quantity = "El total de la venta debe ser mayor a cero.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (submitting || !validate() || !selectedProduct) return;

    await onSubmit({
      productId: selectedProduct.id,
      quantity,
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
              {selectedProduct.salePrice != null ? (
                <View className="flex-row items-center gap-1">
                  <AppText variant="muted">Precio de salida</AppText>
                  <MoneyText value={selectedProduct.salePrice} className="font-semibold" />
                </View>
              ) : null}
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
          {errors.salePrice ? (
            <AppText variant="caption" className="text-danger">
              {errors.salePrice}
            </AppText>
          ) : null}
        </Card>

        <Card className="gap-4">
          <AppText variant="title">Datos de la venta</AppText>

          <TextField
            label={selectedProduct ? `Cantidad (${selectedProduct.unit})` : "Cantidad"}
            value={quantityInput}
            onChangeText={(text) => {
              setQuantityInput(sanitizeDecimalInput(text));
              setErrors((current) => ({ ...current, quantity: undefined }));
            }}
            keyboardType="decimal-pad"
            placeholder="Ej. 1"
            hint="Se descuenta del stock al confirmar."
            error={errors.quantity}
          />
        </Card>

        {preview ? (
          <Card className="gap-3">
            <View className="flex-row items-center justify-between gap-3">
              <AppText variant="title">Resumen</AppText>
              <Badge tone="success" label="Venta" />
            </View>

            {preview.unitPrice == null ? (
              <AppText variant="muted">
                Este producto no tiene precio de salida. Edítalo antes de vender.
              </AppText>
            ) : (
              <>
                <SummaryRow label="Precio de venta">
                  <MoneyText value={preview.unitPrice} className="font-semibold" />
                </SummaryRow>
                <SummaryRow label="Costo actual">
                  <MoneyText value={preview.costPrice} />
                </SummaryRow>
                <SummaryRow label="Margen actual">
                  <AppText style={{ color: marginTone }} className="font-semibold">
                    {formatPercent(preview.marginPercent)}
                  </AppText>
                </SummaryRow>
              </>
            )}

            <SummaryRow label="Stock disponible">
              <AppText variant="body">
                {formatQuantity(preview.product.stock)} {preview.product.unit}
              </AppText>
            </SummaryRow>

            <View className="h-px bg-border" />

            <SummaryRow label="Total">
              <MoneyText value={preview.total} className="font-semibold" />
            </SummaryRow>
            <SummaryRow label="Ganancia estimada">
              <MoneyText
                value={preview.totalProfit}
                className="font-semibold"
                style={{ color: profitTone }}
              />
            </SummaryRow>
            <SummaryRow label="Stock después">
              <AppText
                variant="body"
                className={preview.stockAfter < 0 ? "font-semibold text-danger" : "font-semibold"}
              >
                {formatQuantity(preview.stockAfter)} {preview.product.unit}
              </AppText>
            </SummaryRow>

            {preview.issue && quantity > 0 ? (
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
            label="Registrar venta"
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
