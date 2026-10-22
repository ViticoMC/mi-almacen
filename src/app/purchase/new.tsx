import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { PurchaseForm } from "@/components/movements/purchase-form";
import { useDataRevision } from "@/database/data-context";
import {
  registerPurchase,
  type PurchaseInput,
} from "@/database/repositories/purchases.repository";
import { useProduct } from "@/hooks/use-products";
import { usePalette } from "@/theme/colors";

export default function NewPurchaseScreen() {
  const params = useLocalSearchParams<{ productId?: string }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const { refresh } = useDataRevision();
  const palette = usePalette();
  const { product, loading } = useProduct(params.productId);
  const [saving, setSaving] = useState(false);

  if (params.productId && loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  async function handleSubmit(input: PurchaseInput) {
    setSaving(true);
    try {
      await registerPurchase(db, input);
      refresh();
      router.back();
    } catch (cause) {
      Alert.alert(
        "No se pudo registrar",
        cause instanceof Error ? cause.message : "Intenta de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <PurchaseForm
      key={product?.id ?? "new"}
      initialProduct={product}
      submitting={saving}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
