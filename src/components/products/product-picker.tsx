import { useDeferredValue, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText, EmptyState, TextField } from "@/components/ui";
import type { Product } from "@/database/types";
import { formatMoney } from "@/database/utils/money";
import { formatQuantity } from "@/database/utils/quantity";
import { useProducts } from "@/hooks/use-products";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";

export function ProductPicker({
  visible,
  selectedId,
  onClose,
  onSelect,
}: {
  visible: boolean;
  selectedId?: string;
  onClose: () => void;
  onSelect: (product: Product) => void;
}) {
  const palette = usePalette();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const { products, loading } = useProducts({ search: deferredSearch });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
        <View className="flex-row items-center justify-between gap-3 border-b border-border px-4 py-3">
          <AppText variant="title">Elegir producto</AppText>
          <Pressable accessibilityRole="button" onPress={onClose}>
            <AppText className="font-semibold text-accent">Cerrar</AppText>
          </Pressable>
        </View>

        <View className="px-4 pt-3">
          <TextField
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nombre"
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: item.id === selectedId }}
              onPress={() => onSelect(item)}
              className={cn(
                "gap-1 rounded-xl border p-3",
                item.id === selectedId
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-surface",
              )}
            >
              <AppText className="font-semibold">{item.name}</AppText>
              <AppText variant="caption">
                {formatQuantity(item.stock)} {item.unit} · costo{" "}
                {formatMoney(item.currentPrice)}
              </AppText>
            </Pressable>
          )}
          ListEmptyComponent={
            loading ? (
              <View className="items-center py-10">
                <ActivityIndicator color={palette.accent} />
              </View>
            ) : (
              <EmptyState
                icon="package-variant-closed"
                title={search ? "Sin resultados" : "Sin productos"}
                description={
                  search
                    ? "Prueba con otro nombre."
                    : "Crea un producto antes de registrar movimientos."
                }
              />
            )
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
