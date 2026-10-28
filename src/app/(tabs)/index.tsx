import {
  AppText,
  Badge,
  Button,
  Card,
  MoneyText,
  Screen,
} from "@/components/ui";
import type { DashboardActivity } from "@/database/repositories/dashboard.repository";
import type { Product } from "@/database/types";
import { formatDateTime } from "@/database/utils/dates";
import { formatQuantity } from "@/database/utils/quantity";
import { useLastCount } from "@/hooks/use-counts";
import { useDashboard } from "@/hooks/use-dashboard";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, View } from "react-native";

const activityStyles = {
  purchase: { icon: "cart-arrow-down", label: "Compra" },
  sale: { icon: "cash-register", label: "Venta" },
  adjustment: { icon: "swap-vertical", label: "Ajuste" },
  count: { icon: "clipboard-check-outline", label: "Conteo" },
} as const;

function formatDelta(value: number): string {
  if (value === 0) return formatQuantity(0);
  const formatted = formatQuantity(Math.abs(value));
  return value > 0 ? `+${formatted}` : `-${formatted}`;
}

function ActivityCard({ entry }: { entry: DashboardActivity }) {
  const palette = usePalette();
  const meta = activityStyles[entry.type];
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

  return (
    <Card className={cn("gap-3", cardTone)}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-2">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-surface">
            <MaterialCommunityIcons name={meta.icon} size={18} color={color} />
          </View>
          <View className="flex-1 gap-0.5">
            <AppText className="font-semibold" numberOfLines={1}>
              {entry.productName}
            </AppText>
            <AppText variant="caption">{formatDateTime(entry.createdAt)}</AppText>
          </View>
        </View>
        <Badge tone={badgeTone} label={meta.label} />
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
        <View className="items-end gap-0.5">
          <AppText variant="caption">
            {isAdjustment ? "Costo unidad" : "Total"}
          </AppText>
          <MoneyText
            value={isAdjustment ? entry.unitPrice : entry.total}
            className="font-semibold"
          />
        </View>
      </View>

      {isAdjustment && entry.reason ? (
        <AppText variant="caption">{entry.reason}</AppText>
      ) : null}
    </Card>
  );
}

function LowStockRow({
  product,
  last,
  onPress,
}: {
  product: Product;
  last: boolean;
  onPress: () => void;
}) {
  const palette = usePalette();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatQuantity(product.stock)} ${product.unit}, stock bajo`}
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-3",
        !last && "border-b border-border pb-3",
      )}
      style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
    >
      <View className="flex-1 gap-0.5">
        <AppText className="font-semibold">{product.name}</AppText>
        <AppText variant="caption" className="text-danger">
          {formatQuantity(product.stock)} {product.unit} · mínimo{" "}
          {formatQuantity(product.minStock)}
        </AppText>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={palette.contentMuted}
      />
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { stats, lowStock, activity, loading, error } = useDashboard();
  const { count, loading: countLoading } = useLastCount();

  return (
    <Screen>
      {/* <View className="gap-1">
        <AppText variant="eyebrow" className="text-accent">
          Resumen
        </AppText>
        <AppText variant="hero">Tu almacén</AppText>
        <AppText variant="muted">
          {stats
            ? `${stats.activeProducts} ${
                stats.activeProducts === 1 ? "producto activo" : "productos activos"
              } · Todo se guarda en este dispositivo.`
            : "Todo se guarda en este dispositivo."}
        </AppText>
      </View> */}

      {loading && !stats ? (
        <View className="items-center py-16">
          <ActivityIndicator color={palette.accent} />
        </View>
      ) : null}

      {error ? (
        <Card>
          <AppText variant="caption" className="text-danger">
            {error}
          </AppText>
        </Card>
      ) : null}

      {stats ? (
        <>
          {!countLoading && count ? (
            <Card className="gap-3 border-accent/25 bg-accent-soft">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
                  <AppText variant="title">Último conteo</AppText>
                  <AppText variant="muted">{formatDateTime(count.createdAt)}</AppText>
                </View>
                <Badge tone="success" label="Conteo" />
              </View>

              <View className="flex-row items-end justify-between gap-3">
                <View className="gap-0.5">
                  <AppText variant="caption">Venta conjunta</AppText>
                  <MoneyText value={count.totalSale} className="font-semibold" />
                </View>
                <View className="items-end gap-0.5">
                  <AppText variant="caption">Productos</AppText>
                  <AppText className="font-semibold">{count.itemCount}</AppText>
                </View>
              </View>

              <Button
                label="Ver detalle"
                variant="secondary"
                size="sm"
                onPress={() => router.push(`/count/${count.id}`)}
              />
            </Card>
          ) : null}

          {!countLoading && !count ? (
            <Card className="gap-3">
              <AppText variant="title">Conteo semanal</AppText>
              <AppText variant="muted">
                Aún no hay un conteo registrado. Haz el primero para ajustar stock y registrar la venta conjunta.
              </AppText>
              <Button
                label="Nuevo conteo"
                variant="secondary"
                size="sm"
                onPress={() => router.push("/count/new")}
              />
            </Card>
          ) : null}

          <View className="flex-row gap-3">
            <Card className="flex-1 gap-1">
              <AppText variant="caption">Valor a costo</AppText>
              <MoneyText value={stats.costValue} variant="title" />
            </Card>
            <Card className="flex-1 gap-1">
              <AppText variant="caption">Valor a venta</AppText>
              <MoneyText value={stats.saleValue} variant="title" />
            </Card>
          </View>

          <View className="flex-row gap-3">
            <Card className="flex-1 gap-1">
              <AppText variant="caption">Ganancia potencial</AppText>
              <MoneyText
                value={stats.potentialProfit}
                variant="title"
                style={{
                  color:
                    stats.potentialProfit < 0 ? palette.danger : palette.success,
                }}
              />
            </Card>
            <Card className="flex-1 gap-1">
              <AppText variant="caption">Unidades</AppText>
              <AppText
                variant="title"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {formatQuantity(stats.totalUnits)}
              </AppText>
            </Card>
          </View>

          {stats.activeProducts === 0 ? (
            <Card className="items-center gap-3 py-6">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                <MaterialCommunityIcons
                  name="package-variant"
                  size={24}
                  color={palette.accent}
                />
              </View>
              <AppText variant="title">Tu almacén está vacío</AppText>
              <AppText variant="muted" className="text-center">
                Crea tu primer producto para empezar a controlar el stock.
              </AppText>
              <Button
                label="Crear producto"
                onPress={() => router.push("/product/new")}
              />
            </Card>
          ) : (
            <>
              <Card className="gap-3">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1 gap-1">
                    <AppText variant="title">Stock bajo</AppText>
                    <AppText variant="muted">
                      Productos en su mínimo o por debajo.
                    </AppText>
                  </View>
                  <Badge
                    tone={stats.lowStockCount > 0 ? "danger" : "success"}
                    label={
                      stats.lowStockCount > 0
                        ? `${stats.lowStockCount} en alerta`
                        : "Sin alertas"
                    }
                  />
                </View>

                {lowStock.length === 0 ? (
                  <AppText variant="muted">
                    Configura un stock mínimo por producto para activar las
                    alertas.
                  </AppText>
                ) : (
                  <>
                    <View className="gap-3">
                      {lowStock.slice(0, 3).map((product, index) => (
                        <LowStockRow
                          key={product.id}
                          product={product}
                          last={index === Math.min(lowStock.length, 3) - 1}
                          onPress={() =>
                            router.push({
                              pathname: "/product/[id]",
                              params: { id: product.id },
                            })
                          }
                        />
                      ))}
                    </View>
                    {lowStock.length > 3 ? (
                      <Button
                        label="Ver inventario"
                        variant="ghost"
                        size="sm"
                        onPress={() => router.push("/inventory")}
                      />
                    ) : null}
                  </>
                )}
              </Card>

              <View className="gap-3">
                <View className="flex-row items-center justify-between gap-3">
                  <AppText variant="title">Actividad reciente</AppText>
                  <Button
                    label="Ver todo"
                    variant="ghost"
                    size="sm"
                    onPress={() => router.push("/movements")}
                  />
                </View>

                {activity.length === 0 ? (
                  <Card>
                    <AppText variant="muted">
                      Aún no hay compras, ventas ni ajustes.
                    </AppText>
                  </Card>
                ) : (
                  activity.map((entry) => (
                    <ActivityCard
                      key={`${entry.type}-${entry.id}`}
                      entry={entry}
                    />
                  ))
                )}
              </View>
            </>
          )}
        </>
      ) : null}
    </Screen>
  );
}
