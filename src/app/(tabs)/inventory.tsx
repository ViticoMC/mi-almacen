import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDeferredValue, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { ProductRow } from "@/components/products/product-row";
import { AppText, Button, EmptyState, TextField } from "@/components/ui";
import { useProducts } from "@/hooks/use-products";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";

type Filter = "all" | "low";

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
        className={cn("font-semibold", active ? "text-accent" : "text-content-muted")}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export default function InventoryScreen() {
  const router = useRouter();
  const palette = usePalette();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const deferredSearch = useDeferredValue(search);

  const { products, loading, error } = useProducts({
    search: deferredSearch,
    lowStockOnly: filter === "low",
  });

  const hasSearch = search.trim().length > 0;
  const emptyTitle = hasSearch
    ? "Sin resultados"
    : filter === "low"
      ? "Sin productos por agotarse"
      : "Inventario vacío";
  const emptyDescription = hasSearch
    ? "Prueba con otro nombre."
    : filter === "low"
      ? "Los productos con stock bajo aparecerán aquí."
      : "Crea tu primer producto para empezar a controlar el stock.";

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 96, gap: 12 }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-3 pb-1">
            <TextField
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nombre"
              autoCapitalize="none"
              returnKeyType="search"
            />
            <View className="flex-row gap-2">
              <FilterChip
                label="Todos"
                active={filter === "all"}
                onPress={() => setFilter("all")}
              />
              <FilterChip
                label="Stock bajo"
                active={filter === "low"}
                onPress={() => setFilter("low")}
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
          <ProductRow
            product={item}
            onPress={() =>
              router.push({ pathname: "/product/[id]", params: { id: item.id } })
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
              icon={
                hasSearch
                  ? "magnify"
                  : filter === "low"
                    ? "check-circle-outline"
                    : "package-variant-closed"
              }
              title={emptyTitle}
              description={emptyDescription}
              action={
                !hasSearch && filter === "all" ? (
                  <Button
                    label="Crear producto"
                    onPress={() => router.push("/product/new")}
                  />
                ) : undefined
              }
            />
          )
        }
        ListFooterComponent={
          loading && products.length > 0 ? (
            <ActivityIndicator color={palette.accent} style={{ marginTop: 12 }} />
          ) : null
        }
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nuevo producto"
        onPress={() => router.push("/product/new")}
        className="absolute bottom-6 right-4 h-14 w-14 items-center justify-center rounded-full bg-accent"
        style={({ pressed }) => [
          { boxShadow: "0 8px 20px rgba(116, 92, 66, 0.28)" },
          pressed ? { opacity: 0.85, transform: [{ scale: 0.96 }] } : null,
        ]}
      >
        <MaterialCommunityIcons name="plus" size={26} color={palette.onAccent} />
      </Pressable>
    </View>
  );
}
