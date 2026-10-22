import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  AppText,
  Badge,
  Button,
  Card,
  EmptyState,
  MoneyText,
  Screen,
} from "@/components/ui";
import {
  getHistoryDetail,
  isHistoryType,
  type HistoryDetail,
} from "@/database/repositories/history.repository";
import { formatDateTime } from "@/database/utils/dates";
import { formatPercent, roundMoney } from "@/database/utils/money";
import { formatQuantity } from "@/database/utils/quantity";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";

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

export default function HistoryDetailScreen() {
  const params = useLocalSearchParams<{ type?: string; id?: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const palette = usePalette();
  const type = params.type;
  const id = params.id;

  const [detail, setDetail] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(
    isHistoryType(type) && Boolean(id),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isHistoryType(type) || !id) return;

    let active = true;

    getHistoryDetail(db, type, id)
      .then((row) => {
        if (!active) return;
        setDetail(row);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "No se pudo cargar el movimiento.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, id, type]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Detalle" }} />
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator color={palette.accent} />
        </View>
      </>
    );
  }

  if (!detail) {
    return (
      <>
        <Stack.Screen options={{ title: "Detalle" }} />
        <Screen>
          <EmptyState
            icon="history"
            title="Movimiento no encontrado"
            description={error ?? "Puede que ya no esté disponible."}
            action={
              <Button
                label="Volver"
                variant="outline"
                onPress={() => router.back()}
              />
            }
          />
        </Screen>
      </>
    );
  }

  const isAdjustment = detail.kind === "adjustment";
  const isRemoval = isAdjustment && detail.quantityDelta < 0;
  const label = isAdjustment
    ? "Ajuste"
    : detail.kind === "purchase"
      ? "Compra"
      : "Venta";
  const cardTone = isAdjustment
    ? isRemoval
      ? "border-danger-border bg-danger-soft"
      : "border-success/25 bg-success/10"
    : detail.kind === "purchase"
      ? "border-warning/25 bg-warning/10"
      : "border-success/25 bg-success/10";
  const badgeTone = isAdjustment
    ? isRemoval
      ? "danger"
      : "success"
    : detail.kind === "purchase"
      ? "warning"
      : "success";
  const deltaColor = isRemoval ? palette.danger : palette.success;

  return (
    <>
      <Stack.Screen options={{ title: label }} />
      <Screen>
        <Card className={cn("gap-3", cardTone)}>
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <AppText variant="title">{detail.productName}</AppText>
              <AppText variant="muted">{formatDateTime(detail.createdAt)}</AppText>
            </View>
            <Badge tone={badgeTone} label={label} />
          </View>
          <AppText variant="caption">
            Precios y cantidades congelados al momento del movimiento.
          </AppText>
        </Card>

        {detail.kind === "purchase" ? (
          <>
            <Card className="gap-3">
              <AppText variant="title">Compra</AppText>
              <SummaryRow label="Cantidad">
                <AppText variant="body" className="font-semibold">
                  {formatQuantity(detail.quantity)} {detail.productUnit}
                </AppText>
              </SummaryRow>
              <SummaryRow label="Costo unitario">
                <MoneyText value={detail.unitCost} className="font-semibold" />
              </SummaryRow>
              <SummaryRow label="Total pagado">
                <MoneyText value={detail.total} className="font-semibold" />
              </SummaryRow>
            </Card>

            <Card className="gap-3">
              <AppText variant="title">Cambios de precio</AppText>
              <SummaryRow label="Costo anterior">
                <MoneyText value={detail.previousCost} />
              </SummaryRow>
              <SummaryRow label="Costo nuevo">
                <MoneyText value={detail.newCost} className="font-semibold" />
              </SummaryRow>
              <SummaryRow label="Salida anterior">
                <MoneyText value={detail.previousSalePrice} />
              </SummaryRow>
              <SummaryRow label="Salida nueva">
                <MoneyText
                  value={detail.newSalePrice}
                  className="font-semibold"
                />
              </SummaryRow>
            </Card>
          </>
        ) : null}

        {detail.kind === "sale" ? (
          <>
            <Card className="gap-3">
              <AppText variant="title">Venta</AppText>
              <SummaryRow label="Cantidad">
                <AppText variant="body" className="font-semibold">
                  {formatQuantity(detail.quantity)} {detail.productUnit}
                </AppText>
              </SummaryRow>
              <SummaryRow label="Precio unitario">
                <MoneyText value={detail.unitPrice} className="font-semibold" />
              </SummaryRow>
              <SummaryRow label="Total">
                <MoneyText value={detail.total} className="font-semibold" />
              </SummaryRow>
            </Card>

            <Card className="gap-3">
              <AppText variant="title">Ganancia</AppText>
              <SummaryRow label="Costo congelado">
                <MoneyText value={detail.costPrice} />
              </SummaryRow>
              <SummaryRow label="Margen congelado">
                <AppText variant="body" className="font-semibold">
                  {formatPercent(detail.marginPercent)}
                </AppText>
              </SummaryRow>
              <SummaryRow label="Ganancia">
                <MoneyText
                  value={
                    detail.costPrice != null
                      ? roundMoney(
                          detail.quantity *
                            (detail.unitPrice - detail.costPrice),
                        )
                      : null
                  }
                  className="font-semibold"
                  style={{
                    color:
                      detail.costPrice == null
                        ? palette.contentMuted
                        : detail.unitPrice < detail.costPrice
                          ? palette.danger
                          : palette.success,
                  }}
                />
              </SummaryRow>
            </Card>
          </>
        ) : null}

        {detail.kind === "adjustment" ? (
          <Card className="gap-3">
            <AppText variant="title">Ajuste</AppText>
            <SummaryRow label="Cantidad ajustada">
              <AppText
                variant="body"
                className="font-semibold"
                style={{ color: deltaColor }}
              >
                {formatDelta(detail.quantityDelta)} {detail.productUnit}
              </AppText>
            </SummaryRow>
            <SummaryRow label="Stock antes">
              <AppText variant="body">
                {formatQuantity(detail.stockBefore)} {detail.productUnit}
              </AppText>
            </SummaryRow>
            <SummaryRow label="Stock después">
              <AppText variant="body" className="font-semibold">
                {formatQuantity(detail.stockAfter)} {detail.productUnit}
              </AppText>
            </SummaryRow>
            <SummaryRow label="Costo congelado">
              <MoneyText value={detail.unitCost} />
            </SummaryRow>
            <View className="gap-1">
              <AppText variant="muted">Motivo</AppText>
              <AppText>{detail.reason ?? "Sin motivo registrado."}</AppText>
            </View>
          </Card>
        ) : null}
      </Screen>
    </>
  );
}
