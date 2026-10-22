import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert } from "react-native";
import { ProductForm } from "@/components/products/product-form";
import { useDataRevision } from "@/database/data-context";
import {
  createProduct,
  type UpdateProductInput,
} from "@/database/repositories/products.repository";

export default function NewProductScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { refresh } = useDataRevision();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(input: UpdateProductInput) {
    setSaving(true);
    try {
      await createProduct(db, input);
      refresh();
      router.back();
    } catch (cause) {
      Alert.alert(
        "No se pudo crear",
        cause instanceof Error ? cause.message : "Intenta de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProductForm
      mode="create"
      submitting={saving}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
