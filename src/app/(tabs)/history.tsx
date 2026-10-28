import { ProductPicker } from "@/components/products/product-picker";
import {
  AppText,
  Badge,
  Button,
  Card,
  EmptyState,
  MoneyText,
} from "@/components/ui";
import type {
  HistoryListItem,
} from "@/database/repositories/history.repository";
import type { HistoryType, Product } from "@/database/types";
import { formatDateTime } from "@/database/utils/dates";
import { formatQuantity } from "@/database/utils/quantity";
import { useHistory } from "@/hooks/use-history";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  View,
} from "react-native";

type TypeFilter = "all" | HistoryType;
type DateFilter = "all" | "today" | "week" | "month";

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "purchase", label: "Compras" },
  { value: "sale", label: "Ventas" },
  { value: "count", label: "Conteos" },
  { value: "adjustment", label: "Ajustes" },
];

const dateOptions: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "today", label: "Hoy" },
  { value: "week", label: "7 días" },
  { value: "month", label: "30 días" },
];

function resolveSince(filter: DateFilter): number | undefined {
  if (filter === "all") return undefined;
  if (filter === "today") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  }

  const days = filter === "week" ? 7 : 30;
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function formatDelta(value: number): string {
  if (value === 0) return formatQuantity(0);
  const formatted = formatQuantity(Math.abs(value));
  return value > 0 ? `+${formatted}` : `-${formatted}`;
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={cn(
        "rounded-full border px-3 py-2",
        active ? "border-accent bg-accent-soft" : "border-border bg-surface",
      )}
    >
      <AppText
        variant="caption"
        className={cn(
          "font-semibold",
          active ? "text-accent" : "text-content-muted",
        )}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

function HistoryCard({
  entry,
  onPress,
}: {
  entry: HistoryListItem;
  onPress: () => void;
}) {
  const palette = usePalette();
  const isAdjustment = entry.type === "adjustment";
  const isRemoval = isAdjustment && entry.quantity < 0;
  const isCount = entry.type === "count";
  const color = isAdjustment
    ? isRemoval
      ? palette.danger
      : palette.success
    : isCount
      ? palette.accent
      : entry.type === "purchase"
        ? palette.warning
        : palette.success;
  const cardTone = isAdjustment
    ? isRemoval
      ? "border-danger-border bg-danger-soft"
      : "border-success/25 bg-success/10"
    : isCount
      ? "border-accent/25 bg-accent-soft"
      : entry.type === "purchase"
        ? "border-warning/25 bg-warning/10"
        : "border-success/25 bg-success/10";
  const badgeTone = isAdjustment
    ? isRemoval
      ? "danger"
      : "success"
    : isCount
      ? "success"
      : entry.type === "purchase"
        ? "warning"
        : "success";
  const label = isAdjustment
    ? "Ajuste"
    : isCount
      ? "Conteo"
      : entry.type === "purchase"
        ? "Compra"
        : "Venta";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${label} de ${entry.productName}`}
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
    >
      <Card className={cn("gap-3", cardTone)}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <AppText className="font-semibold" numberOfLines={1}>
              {entry.productName}
            </AppText>
            <AppText variant="caption">{formatDateTime(entry.createdAt)}</AppText>
          </View>
          <Badge tone={badgeTone} label={label} />
        </View>

        <View className="flex-row items-end justify-between gap-3">
          <View className="gap-0.5">
            <AppText variant="caption">
              {isAdjustment ? "Ajuste" : "Cantidad"}
            </AppText>
            <AppText
              className="font-semibold"
              style={isAdjustment ? { color } : undefined}
            >
              {isAdjustment
                ? formatDelta(entry.quantity)
                : formatQuantity(entry.quantity)}{" "}
              {entry.productUnit}
            </AppText>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="items-end gap-0.5">
              <AppText variant="caption">
                {isAdjustment ? "Costo unidad" : "Total"}
              </AppText>
              <MoneyText
                value={isAdjustment ? entry.unitPrice : entry.total}
                className="font-semibold"
              />
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={palette.contentMuted}
            />
          </View>
        </View>

        {isAdjustment && entry.reason ? (
          <AppText variant="caption">{entry.reason}</AppText>
        ) : null}
      </Card>
    </Pressable>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const palette = usePalette();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const since = useMemo(() => resolveSince(dateFilter), [dateFilter]);
  const { entries, loading, error } = useHistory({
    type: typeFilter === "all" ? undefined : typeFilter,
    productId: selectedProduct?.id,
    since,
  });

  const hasFilters =
    typeFilter !== "all" || dateFilter !== "all" || selectedProduct != null;

  function clearFilters() {
    setTypeFilter("all");
    setDateFilter("all");
    setSelectedProduct(null);
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={entries}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-3 pb-1">
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 gap-1">
                <AppText variant="eyebrow" className="text-accent">
                  Historial
                </AppText>
                <AppText variant="title">Movimientos</AppText>
                <AppText variant="muted">
                  {entries.length === 1
                    ? "1 movimiento registrado"
                    : `${entries.length} movimientos registrados`}
                </AppText>
              </View>
              {hasFilters ? (
                <Button
                  label="Limpiar"
                  variant="ghost"
                  size="sm"
                  onPress={clearFilters}
                />
              ) : null}
            </View>

            <View className="flex-row flex-wrap gap-2">
              {typeOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  active={typeFilter === option.value}
                  onPress={() => setTypeFilter(option.value)}
                />
              ))}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {dateOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  active={dateFilter === option.value}
                  onPress={() => setDateFilter(option.value)}
                />
              ))}
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filtrar por producto"
              onPress={() => setPickerVisible(true)}
              className="flex-row items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <View className="flex-1 gap-0.5">
                <AppText variant="caption">Producto</AppText>
                <AppText className="font-semibold" numberOfLines={1}>
                  {selectedProduct?.name ?? "Todos"}
                </AppText>
              </View>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color={palette.contentMuted}
              />
            </Pressable>

            {error ? (
              <AppText variant="caption" className="text-danger">
                {error}
              </AppText>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <HistoryCard
            entry={item}
            onPress={() =>
              router.push({
                pathname: "/history/[type]/[id]",
                params: { type: item.type, id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View className="items-center py-12">
              <ActivityIndicator color={palette.accent} />
            </View>
          ) : (
            <EmptyState
              icon={hasFilters ? "magnify" : "history"}
              title={hasFilters ? "Sin resultados" : "Sin historial"}
              description={
                hasFilters
                  ? "Prueba con otros filtros o limpia la búsqueda."
                  : "Cada compra, venta y ajuste quedará guardado con los precios del momento."
              }
              action={
                hasFilters ? (
                  <Button
                    label="Limpiar filtros"
                    variant="outline"
                    onPress={clearFilters}
                  />
                ) : (
                  <Button
                    label="Ir a movimientos"
                    onPress={() => router.push("/movements")}
                  />
                )
              }
            />
          )
        }
        ListFooterComponent={
          loading && entries.length > 0 ? (
            <ActivityIndicator color={palette.accent} style={{ marginTop: 12 }} />
          ) : null
        }
      />

      <ProductPicker
        visible={pickerVisible}
        selectedId={selectedProduct?.id}
        includeArchived
        onSelect={(product) => {
          setSelectedProduct(product);
          setPickerVisible(false);
        }}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}
