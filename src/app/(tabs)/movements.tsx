import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import {
  AppText,
  Badge,
  Button,
  Card,
  EmptyState,
  MoneyText,
} from "@/components/ui";
import type { AdjustmentListItem } from "@/database/repositories/adjustments.repository";
import type { PurchaseListItem } from "@/database/repositories/purchases.repository";
import type { SaleListItem } from "@/database/repositories/sales.repository";
import { formatDateTime } from "@/database/utils/dates";
import { roundMoney } from "@/database/utils/money";
import { formatQuantity } from "@/database/utils/quantity";
import { useAdjustments } from "@/hooks/use-adjustments";
import { usePurchases } from "@/hooks/use-purchases";
import { useSales } from "@/hooks/use-sales";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";

type MovementMode = "purchases" | "sales" | "adjustments";

type MovementItem =
  | { kind: "purchase"; data: PurchaseListItem }
  | { kind: "sale"; data: SaleListItem }
  | { kind: "adjustment"; data: AdjustmentListItem };

function formatDelta(value: number): string {
  if (value === 0) return formatQuantity(0);
  const formatted = formatQuantity(Math.abs(value));
  return value > 0 ? `+${formatted}` : `-${formatted}`;
}

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: MovementMode;
  onChange: (mode: MovementMode) => void;
}) {
  const palette = usePalette();
  const options: { value: MovementMode; label: string }[] = [
    { value: "purchases", label: "Compras" },
    { value: "sales", label: "Ventas" },
    { value: "adjustments", label: "Ajustes" },
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

function PurchaseCard({ item }: { item: PurchaseListItem }) {
  return (
    <Card className="gap-3 border-warning/25 bg-warning/10">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <AppText className="font-semibold">{item.productName}</AppText>
          <AppText variant="caption">
            {formatQuantity(item.quantity)} {item.productUnit} ·{" "}
            {formatDateTime(item.createdAt)}
          </AppText>
        </View>
        <Badge tone="warning" label="Compra" />
      </View>

      <View className="flex-row items-end justify-between gap-3">
        <View className="gap-0.5">
          <AppText variant="caption">Costo unidad</AppText>
          <MoneyText value={item.unitCost} />
        </View>
        <View className="items-end gap-0.5">
          <AppText variant="caption">Total</AppText>
          <MoneyText value={item.total} className="font-semibold" />
        </View>
      </View>
    </Card>
  );
}

function SaleCard({ item }: { item: SaleListItem }) {
  const palette = usePalette();
  const profit =
    item.costPrice != null
      ? roundMoney(item.quantity * (item.unitPrice - item.costPrice))
      : null;

  return (
    <Card className="gap-3 border-success/25 bg-success/10">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <AppText className="font-semibold">{item.productName}</AppText>
          <AppText variant="caption">
            {formatQuantity(item.quantity)} {item.productUnit} ·{" "}
            {formatDateTime(item.createdAt)}
          </AppText>
        </View>
        <Badge tone="success" label="Venta" />
      </View>

      <View className="flex-row items-end justify-between gap-3">
        <View className="gap-0.5">
          <AppText variant="caption">Precio unidad</AppText>
          <MoneyText value={item.unitPrice} />
        </View>
        <View className="items-end gap-0.5">
          <AppText variant="caption">Total</AppText>
          <MoneyText value={item.total} className="font-semibold" />
        </View>
      </View>

      {profit != null ? (
        <View className="flex-row items-center justify-between gap-3 border-t border-border pt-3">
          <AppText variant="caption">Ganancia</AppText>
          <MoneyText
            value={profit}
            className="font-semibold"
            style={{ color: profit < 0 ? palette.danger : palette.success }}
          />
        </View>
      ) : null}
    </Card>
  );
}

function AdjustmentCard({ item }: { item: AdjustmentListItem }) {
  const palette = usePalette();
  const isRemoval = item.quantityDelta < 0;

  return (
    <Card
      className={cn(
        "gap-3",
        isRemoval
          ? "border-danger-border bg-danger-soft"
          : "border-success/25 bg-success/10",
      )}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <AppText className="font-semibold">{item.productName}</AppText>
          <AppText variant="caption">
            {item.reason ?? "Ajuste de inventario"} ·{" "}
            {formatDateTime(item.createdAt)}
          </AppText>
        </View>
        <Badge tone={isRemoval ? "danger" : "success"} label="Ajuste" />
      </View>

      <View className="flex-row items-end justify-between gap-3">
        <View className="gap-0.5">
          <AppText variant="caption">Ajuste</AppText>
          <AppText
            className="font-semibold"
            style={{ color: isRemoval ? palette.danger : palette.success }}
          >
            {formatDelta(item.quantityDelta)} {item.productUnit}
          </AppText>
        </View>
        <View className="items-end gap-0.5">
          <AppText variant="caption">Stock</AppText>
          <AppText className="font-semibold">
            {formatQuantity(item.stockBefore)} → {formatQuantity(item.stockAfter)}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

export default function MovementsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const [mode, setMode] = useState<MovementMode>("purchases");
  const purchaseState = usePurchases();
  const saleState = useSales();
  const adjustmentState = useAdjustments();

  const isPurchase = mode === "purchases";
  const isSale = mode === "sales";
  const items: MovementItem[] = isPurchase
    ? purchaseState.purchases.map((data) => ({ kind: "purchase", data }))
    : isSale
      ? saleState.sales.map((data) => ({ kind: "sale", data }))
      : adjustmentState.adjustments.map((data) => ({ kind: "adjustment", data }));
  const loading = isPurchase
    ? purchaseState.loading
    : isSale
      ? saleState.loading
      : adjustmentState.loading;
  const error = isPurchase
    ? purchaseState.error
    : isSale
      ? saleState.error
      : adjustmentState.error;

  const countLabel = isPurchase
    ? items.length === 1
      ? "1 compra registrada"
      : `${items.length} compras registradas`
    : isSale
      ? items.length === 1
        ? "1 venta registrada"
        : `${items.length} ventas registradas`
      : items.length === 1
        ? "1 ajuste registrado"
        : `${items.length} ajustes registrados`;

  const newLabel = isPurchase
    ? "Nueva compra"
    : isSale
      ? "Nueva venta"
      : "Nuevo ajuste";

  function openNew() {
    if (isPurchase) {
      router.push("/purchase/new");
    } else if (isSale) {
      router.push("/sale/new");
    } else {
      router.push("/adjustment/new");
    }
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={items}
        keyExtractor={(item) => item.data.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-3 pb-1">
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 gap-1">
                <AppText variant="title">Movimientos</AppText>
                <AppText variant="muted">{countLabel}</AppText>
              </View>
              <Button label={newLabel} size="sm" onPress={openNew} />
            </View>

            <ModeSwitch mode={mode} onChange={setMode} />

            {error ? (
              <AppText variant="caption" className="text-danger">
                {error}
              </AppText>
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          if (item.kind === "purchase") return <PurchaseCard item={item.data} />;
          if (item.kind === "sale") return <SaleCard item={item.data} />;
          return <AdjustmentCard item={item.data} />;
        }}
        ListEmptyComponent={
          loading ? (
            <View className="items-center py-12">
              <ActivityIndicator color={palette.accent} />
            </View>
          ) : (
            <EmptyState
              icon={
                isPurchase
                  ? "cart-arrow-down"
                  : isSale
                    ? "cash-register"
                    : "swap-vertical"
              }
              title={
                isPurchase ? "Sin compras" : isSale ? "Sin ventas" : "Sin ajustes"
              }
              description={
                isPurchase
                  ? "Registra tu primera compra para actualizar el stock y los precios."
                  : isSale
                    ? "Registra tu primera venta para descontar stock y congelar precios."
                    : "Registra un ajuste para corregir el stock sin comprar ni vender."
              }
              action={
                <Button
                  label={
                    isPurchase
                      ? "Registrar compra"
                      : isSale
                        ? "Registrar venta"
                        : "Registrar ajuste"
                  }
                  onPress={openNew}
                />
              }
            />
          )
        }
      />
    </View>
  );
}
