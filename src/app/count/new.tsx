import { CountForm } from "@/components/counts/count-form";
import { useDataRevision } from "@/database/data-context";
import { registerCount } from "@/database/repositories/counts.repository";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert } from "react-native";

export default function CountNewScreen() {
    const router = useRouter();
    const db = useSQLiteContext();
    const { refresh } = useDataRevision();
    const [saving, setSaving] = useState(false);

    async function handleSubmit(entries: { productId: string; counted: number | null }[]) {
        setSaving(true);

        try {
            const result = await registerCount(db, { entries });
            refresh();
            Alert.alert("Conteo registrado", `Se guardó el conteo con ${result.itemCount} movimientos.`);
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
        <CountForm
            submitting={saving}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
        />
    );
}
