import {
  AppText,
  Badge,
  Button,
  Card,
  EmptyState,
  MoneyText,
} from "@/components/ui";
import type { AdjustmentListItem } from "@/database/repositories/adjustments.repository";
import type { CountListItem } from "@/database/repositories/counts.repository";
import type { PurchaseListItem } from "@/database/repositories/purchases.repository";
import { formatDateTime } from "@/database/utils/dates";
import { formatQuantity } from "@/database/utils/quantity";
import { useAdjustments } from "@/hooks/use-adjustments";
import { useCounts } from "@/hooks/use-counts";
import { usePurchases } from "@/hooks/use-purchases";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

type MovementMode = "purchases" | "counts" | "adjustments";

type MovementItem =
  | { kind: "purchase"; data: PurchaseListItem }
  | { kind: "count"; data: CountListItem }
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
    { value: "counts", label: "Conteos" },
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

function CountCard({ item, onPress }: { item: CountListItem; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Card className="gap-3 border-accent/25 bg-accent-soft">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <AppText className="font-semibold">Conteo semanal</AppText>
            <AppText variant="caption">
              {item.itemCount} productos · {formatDateTime(item.createdAt)}
            </AppText>
          </View>
          <Badge tone="success" label="Conteo" />
        </View>

        <View className="flex-row items-end justify-between gap-3">
          <View className="gap-0.5">
            <AppText variant="caption">Venta conjunta</AppText>
            <MoneyText value={item.totalSale} className="font-semibold" />
          </View>
          <View className="items-end gap-0.5">
            <AppText variant="caption">Unidades faltantes</AppText>
            <AppText className="font-semibold">
              {formatQuantity(item.unitsSold)}
            </AppText>
          </View>
        </View>
      </Card>
    </Pressable>
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
  const countState = useCounts();
  const adjustmentState = useAdjustments();

  const isPurchase = mode === "purchases";
  const isCount = mode === "counts";
  const items: MovementItem[] = isPurchase
    ? purchaseState.purchases.map((data) => ({ kind: "purchase", data }))
    : isCount
      ? countState.entries.map((data) => ({ kind: "count", data }))
      : adjustmentState.adjustments.map((data) => ({ kind: "adjustment", data }));
  const loading = isPurchase
    ? purchaseState.loading
    : isCount
      ? countState.loading
      : adjustmentState.loading;
  const error = isPurchase
    ? purchaseState.error
    : isCount
      ? countState.error
      : adjustmentState.error;

  const countLabel = isPurchase
    ? items.length === 1
      ? "1 compra registrada"
      : `${items.length} compras registradas`
    : isCount
      ? items.length === 1
        ? "1 conteo registrado"
        : `${items.length} conteos registrados`
      : items.length === 1
        ? "1 ajuste registrado"
        : `${items.length} ajustes registrados`;

  const newLabel = isPurchase
    ? "Nueva compra"
    : isCount
      ? "Nuevo conteo"
      : "Nuevo ajuste";

  function openNew() {
    if (isPurchase) {
      router.push("/purchase/new");
    } else if (isCount) {
      router.push("/count/new");
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
          if (item.kind === "count")
            return (
              <CountCard
                item={item.data}
                onPress={() => router.push(`/count/${item.data.id}`)}
              />
            );
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
                  : isCount
                    ? "clipboard-check-outline"
                    : "swap-vertical"
              }
              title={
                isPurchase ? "Sin compras" : isCount ? "Sin conteos" : "Sin ajustes"
              }
              description={
                isPurchase
                  ? "Registra tu primera compra para actualizar el stock y los precios."
                  : isCount
                    ? "Haz tu primer conteo semanal para ajustar stock y registrar la venta conjunta."
                    : "Registra un ajuste para corregir el stock sin comprar ni vender."
              }
              action={
                <Button
                  label={
                    isPurchase
                      ? "Registrar compra"
                      : isCount
                        ? "Nuevo conteo"
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
