import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { AppText, Badge, Card, MoneyText } from "@/components/ui";
import type { Product } from "@/database/types";
import { formatQuantity } from "@/database/utils/quantity";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";

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
      <Card
        className={cn(
          "gap-4",
          isLowStock && "border-danger-border bg-danger-soft",
        )}
      >
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1 gap-2">
            <AppText
              variant="body"
              className="text-[18px] leading-6 font-semibold"
              numberOfLines={2}
            >
              {product.name}
            </AppText>
            <AppText
              variant="caption"
              className={isLowStock ? "text-danger" : undefined}
            >
              Mínimo {formatQuantity(product.minStock)} {product.unit}
            </AppText>
            {isLowStock ? (
              <Badge tone="danger" label="Stock bajo" className="self-start" />
            ) : null}
          </View>

          <View className="max-w-[45%] items-end">
            <AppText variant="eyebrow" className="text-content-muted">
              Stock
            </AppText>
            <AppText
              className="text-[30px] leading-[34px] font-extrabold"
              style={{
                color: isLowStock ? palette.danger : palette.content,
                fontVariant: ["tabular-nums"],
              }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {formatQuantity(product.stock)}
            </AppText>
            <AppText
              variant="caption"
              className={isLowStock ? "text-danger" : undefined}
            >
              {product.unit}
            </AppText>
          </View>
        </View>

        <View className="flex-row items-end justify-between gap-3 border-t border-border pt-3">
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
