import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, View } from "react-native";
import {
  AppText,
  Badge,
  Button,
  Card,
  EmptyState,
  MoneyText,
} from "@/components/ui";
import { formatDateTime } from "@/database/utils/dates";
import { formatQuantity } from "@/database/utils/quantity";
import { usePurchases } from "@/hooks/use-purchases";
import { usePalette } from "@/theme/colors";

export default function MovementsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { purchases, loading, error } = usePurchases();

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-3 pb-1">
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 gap-1">
                <AppText variant="title">Compras</AppText>
                <AppText variant="muted">
                  {purchases.length === 1
                    ? "1 compra registrada"
                    : `${purchases.length} compras registradas`}
                </AppText>
              </View>
              <Button
                label="Nueva compra"
                size="sm"
                onPress={() => router.push("/purchase/new")}
              />
            </View>
            {error ? (
              <AppText variant="caption" className="text-danger">
                {error}
              </AppText>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <Card className="gap-3">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 gap-1">
                <AppText className="font-semibold">{item.productName}</AppText>
                <AppText variant="caption">
                  {formatQuantity(item.quantity)} {item.productUnit} ·{" "}
                  {formatDateTime(item.createdAt)}
                </AppText>
              </View>
              <Badge tone="accent" label="Compra" />
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
        )}
        ListEmptyComponent={
          loading ? (
            <View className="items-center py-12">
              <ActivityIndicator color={palette.accent} />
            </View>
          ) : (
            <EmptyState
              icon="cart-arrow-down"
              title="Sin compras"
              description="Registra tu primera compra para actualizar el stock y los precios."
              action={
                <Button
                  label="Registrar compra"
                  onPress={() => router.push("/purchase/new")}
                />
              }
            />
          )
        }
      />
    </View>
  );
}
