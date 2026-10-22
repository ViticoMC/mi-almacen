import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { ProductForm } from "@/components/products/product-form";
import { Button, EmptyState, Screen } from "@/components/ui";
import { useDataRevision } from "@/database/data-context";
import {
  updateProduct,
  type UpdateProductInput,
} from "@/database/repositories/products.repository";
import { useProduct } from "@/hooks/use-products";
import { usePalette } from "@/theme/colors";

export default function EditProductScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const { refresh } = useDataRevision();
  const palette = usePalette();
  const { product, loading } = useProduct(params.id);
  const [saving, setSaving] = useState(false);

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
          description="Puede que haya sido archivado."
          action={
            <Button label="Volver" variant="outline" onPress={() => router.back()} />
          }
        />
      </Screen>
    );
  }

  const productId = product.id;

  async function handleSubmit(input: UpdateProductInput) {
    setSaving(true);
    try {
      await updateProduct(db, productId, input);
      refresh();
      router.back();
    } catch (cause) {
      Alert.alert(
        "No se pudo guardar",
        cause instanceof Error ? cause.message : "Intenta de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProductForm
      mode="edit"
      product={product}
      submitting={saving}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
