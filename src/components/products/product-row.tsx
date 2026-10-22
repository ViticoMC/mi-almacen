import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { AppText, Badge, Card, MoneyText } from "@/components/ui";
import type { Product } from "@/database/types";
import { formatQuantity } from "@/database/utils/quantity";
import { usePalette } from "@/theme/colors";

export function ProductRow({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  const palette = usePalette();
  const isLowStock = product.minStock > 0 && product.stock <= product.minStock;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatQuantity(product.stock)} ${product.unit}`}
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
    >
      <Card className="gap-3">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <AppText variant="body" className="font-semibold">
              {product.name}
            </AppText>
            <AppText variant="caption">
              {formatQuantity(product.stock)} {product.unit} · mínimo{" "}
              {formatQuantity(product.minStock)}
            </AppText>
          </View>
          {isLowStock ? (
            <Badge tone="warning" label="Stock bajo" />
          ) : (
            <Badge tone="neutral" label={product.unit} />
          )}
        </View>

        <View className="flex-row items-end justify-between gap-3">
          <View className="gap-0.5">
            <AppText variant="caption">Costo</AppText>
            <MoneyText value={product.currentPrice} />
          </View>
          <View className="items-end gap-0.5">
            <AppText variant="caption">Venta</AppText>
            <MoneyText value={product.salePrice} className="font-semibold" />
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={palette.contentMuted}
          />
        </View>
      </Card>
    </Pressable>
  );
}
