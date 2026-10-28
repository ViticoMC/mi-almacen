import {
  AppText,
  Badge,
  Button,
  Card,
  EmptyState,
  MoneyText,
  Screen,
} from "@/components/ui";
import { useDataRevision } from "@/database/data-context";
import { archiveProduct } from "@/database/repositories/products.repository";
import { effectiveMargin, formatPercent } from "@/database/utils/money";
import { formatQuantity } from "@/database/utils/quantity";
import { useProduct } from "@/hooks/use-products";
import { usePalette } from "@/theme/colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ActivityIndicator, Alert, View } from "react-native";

function SummaryRow({ label, value }: { label: string; value: number | null }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <AppText variant="muted">{label}</AppText>
      <MoneyText value={value} />
    </View>
  );
}

export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const { refresh } = useDataRevision();
  const palette = usePalette();
  const { product, loading, error } = useProduct(params.id);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  if (!product) {
    return (
      <Screen>
        <EmptyState
          icon="package-variant"
          title="Producto no encontrado"
          description={error ?? "Puede que haya sido archivado."}
          action={
            <Button label="Volver" variant="outline" onPress={() => router.back()} />
          }
        />
      </Screen>
    );
  }

  const isLowStock = product.minStock > 0 && product.stock <= product.minStock;
  const margin =
    product.currentPrice != null && product.salePrice != null
      ? effectiveMargin(product.currentPrice, product.salePrice)
      : null;
  const costValue =
    product.currentPrice != null ? product.stock * product.currentPrice : null;
  const saleValue =
    product.salePrice != null ? product.stock * product.salePrice : null;

  const productId = product.id;
  const stock = product.stock;
  const unit = product.unit;

  function handleArchive() {
    if (stock > 0) {
      Alert.alert(
        "No se puede archivar",
        `Este producto todavía tiene ${formatQuantity(stock)} ${unit} en stock. Ajusta el stock a cero antes de archivarlo.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Ajustar stock",
            onPress: () =>
              router.push({
                pathname: "/adjustment/new",
                params: { productId },
              }),
          },
        ],
      );
      return;
    }

    Alert.alert(
      "Archivar producto",
      "Dejará de aparecer en el inventario, pero su historial se conserva.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Archivar",
          style: "destructive",
          onPress: async () => {
            try {
              await archiveProduct(db, productId);
              refresh();
              router.back();
            } catch (cause) {
              Alert.alert(
                "No se pudo archivar",
                cause instanceof Error ? cause.message : "Intenta de nuevo.",
              );
            }
          },
        },
      ],
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />
      <Screen>
        <Card className="gap-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <AppText variant="hero">{product.name}</AppText>
              <AppText variant="muted">Unidad: {product.unit}</AppText>
            </View>
            {isLowStock ? (
              <Badge tone="warning" label="Stock bajo" />
            ) : (
              <Badge tone="success" label="Disponible" />
            )}
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 gap-0.5 rounded-xl bg-background p-3">
              <AppText variant="caption">Stock actual</AppText>
              <AppText variant="metric" style={{ fontVariant: ["tabular-nums"] }}>
                {formatQuantity(product.stock)}
              </AppText>
              <AppText variant="caption">{product.unit}</AppText>
            </View>
            <View className="flex-1 gap-0.5 rounded-xl bg-background p-3">
              <AppText variant="caption">Stock mínimo</AppText>
              <AppText variant="metric" style={{ fontVariant: ["tabular-nums"] }}>
                {formatQuantity(product.minStock)}
              </AppText>
              <AppText variant="caption">
                {product.minStock > 0 ? "Alerta activa" : "Sin alerta"}
              </AppText>
            </View>
          </View>
        </Card>

        <Card className="gap-3">
          <AppText variant="title">Precios</AppText>
          {product.currentPrice == null ? (
            <AppText variant="muted">
              El precio se define al registrar la primera compra.
            </AppText>
          ) : (
            <>
              <SummaryRow label="Costo actual" value={product.currentPrice} />
              <SummaryRow label="Último costo" value={product.lastPrice} />
              <SummaryRow label="Precio de venta" value={product.salePrice} />
              <View className="flex-row items-center justify-between gap-3">
                <AppText variant="muted">Margen efectivo</AppText>
                <AppText variant="body" className="font-semibold text-success">
                  {formatPercent(margin)}
                </AppText>
              </View>
            </>
          )}
        </Card>

        <Card className="gap-3">
          <AppText variant="title">Valor en stock</AppText>
          <SummaryRow label="A costo" value={costValue} />
          <SummaryRow label="A venta" value={saleValue} />
        </Card>

        <View className="gap-3">
          <Button
            label="Registrar compra"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: "/purchase/new",
                params: { productId: productId },
              })
            }
          />
          <Button
            label="Ajustar stock"
            variant="outline"
            onPress={() =>
              router.push({
                pathname: "/adjustment/new",
                params: { productId: productId },
              })
            }
          />
          <Button
            label="Editar producto"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: "/product/[id]/edit",
                params: { id: product.id },
              })
            }
          />
          <Button label="Archivar producto" variant="outline" onPress={handleArchive} />
        </View>
      </Screen>
    </>
  );
}
