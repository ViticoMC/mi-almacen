import type { ThemePalette } from "@/components/index/types";
import {
    deleteProduct,
    type ProductWithMetrics
} from "@/database";
import { deleteProductImage } from "@/database/utils/images";
import { notifyProductsChanged } from "@/data/products-store";
import { cn } from "@/utils/cn";
import { getStockStatus } from "@/utils/inventory-filters";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { SQLiteDatabase } from "expo-sqlite";
import { memo, useState } from "react";
import {
    Alert,
    Pressable,
    Text,
    View
} from "react-native";
import { useRouter } from "expo-router";

interface ProductCardProps {
    product: ProductWithMetrics;
    setPreviewUri: (uri: string | null) => void;
    openEditForm: (product: ProductWithMetrics) => void;
    loadProducts: () => Promise<void>;
    palette: ThemePalette;
    db: SQLiteDatabase;
}



function ProductCard({ product, setPreviewUri, openEditForm, palette, db, loadProducts }: ProductCardProps) {
    const router = useRouter();
    const stockStatus = getStockStatus(product);
    const stockValue = Number(product.current_stock || 0);
    const [deleting, setDeleting] = useState(false);
    const hasCosts =
        Number(product.average_cost || 0) > 0 || Number(product.last_cost || 0) > 0;

    const formatCost = (value: number) => {
        return hasCosts ? `$${Number(value || 0).toFixed(2)}` : "—";
    };

    const deleteProductAndImage = async () => {
        if (deleting) {
            return;
        }

        // Defensa extra: el botón solo se muestra sin stock, pero no se
        // permite borrar con existencias bajo ninguna circunstancia.
        if (Number(product.current_stock || 0) > 0) {
            return;
        }

        setDeleting(true);

        try {
            // Libera espacio: la foto no forma parte del historial.
            await deleteProductImage(product.image_path);
            // Borrado lógico: la fila y sus movimientos se conservan.
            await deleteProduct(db, product.id);
            await loadProducts();
            notifyProductsChanged();
        } catch (error) {
            Alert.alert(
                "No se pudo eliminar",
                error instanceof Error ? error.message : "Inténtalo de nuevo.",
            );
        } finally {
            setDeleting(false);
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Eliminar producto",
            `"${product.name}" saldrá del inventario y se borrará su foto. Su historial de movimientos se conserva. Esta acción no se puede deshacer.`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: () => void deleteProductAndImage(),
                },
            ],
        );
    };

    return (
        <View
            className={cn(
                "rounded-[20px] border p-4 gap-3.5 bg-surface",
                stockStatus === "out" && "border-danger",
                stockStatus === "low" && "border-warning",
                stockStatus === "ok" && "border-border",
            )}
            style={stockStatus !== "ok" ? { borderWidth: 1.5 } : undefined}
        >
            <View className="flex-row items-center gap-3">
                {product.image_path ? (
                    <Pressable
                        onPress={() => setPreviewUri(product.image_path)}
                        hitSlop={4}
                        accessibilityRole="imagebutton"
                        accessibilityLabel={`Ver foto de ${product.name}`}
                    >
                        <Image
                            source={{ uri: product.image_path }}
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                backgroundColor: palette.border,
                            }}
                            transition={150}
                            contentFit="cover"
                        />
                    </Pressable>
                ) : (
                    <View className="w-14 h-14 rounded-2xl items-center justify-center bg-accent-soft">
                        <MaterialCommunityIcons name="image-outline" size={22} color={palette.accent} />
                    </View>
                )}
                <View className="flex-1 gap-1">
                    <Text className="text-button-label text-content">{product.name}</Text>
                    <Text className="text-body-muted text-content-muted">
                        {product.description ?? "Sin descripcion"}
                    </Text>
                </View>
                <View
                    className={cn(
                        "rounded-full px-2.5 py-1.5 self-start",
                        stockStatus === "out" && "bg-danger/10",
                        stockStatus === "low" && "bg-warning/15",
                        stockStatus === "ok" && "bg-accent-soft",
                    )}
                >
                    <Text
                        className={cn(
                            "text-chip uppercase",
                            stockStatus === "out" && "text-danger",
                            stockStatus === "low" && "text-warning",
                            stockStatus === "ok" && "text-accent",
                        )}
                    >
                        {stockValue} u.
                    </Text>
                </View>
            </View>

            {stockStatus !== "ok" ? (
                <View
                    className={cn(
                        "flex-row items-center gap-2 rounded-xl px-3 py-2",
                        stockStatus === "out" && "bg-danger/10",
                        stockStatus === "low" && "bg-warning/15",
                    )}
                >
                    <MaterialCommunityIcons
                        name={stockStatus === "out" ? "alert-octagon-outline" : "alert-outline"}
                        size={16}
                        color={stockStatus === "out" ? "#DC2626" : "#F59E0B"}
                    />
                    <Text
                        className={cn(
                            "text-body-muted flex-1",
                            stockStatus === "out" && "text-danger",
                            stockStatus === "low" && "text-warning",
                        )}
                    >
                        {stockStatus === "out"
                            ? "Sin stock — requiere reposición"
                            : "Bajo stock — reponer pronto"}
                    </Text>
                </View>
            ) : null}

            <View className="flex-row items-end justify-between gap-2">
                <View className="flex-1">
                    <Text className="text-body-muted text-content-muted">Costo medio</Text>
                    <Text className="text-button-label text-content">
                        {formatCost(Number(product.average_cost || 0))}
                    </Text>
                </View>
                <View className="flex-1 items-end">
                    <Text className="text-body-muted text-content-muted">Ultimo costo</Text>
                    <Text className="text-[18px] font-bold text-accent">
                        {formatCost(Number(product.last_cost || 0))}
                    </Text>
                </View>
            </View>

            <View className="flex-row gap-3">
                <Pressable
                    onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } } as never)}
                    hitSlop={8}
                    pressRetentionOffset={12}
                    className="flex-1 rounded-xl py-3 items-center justify-center min-h-[44px] bg-accent"
                    style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
                >
                    <Text className="text-chip uppercase text-on-accent">Ficha</Text>
                </Pressable>
                <Pressable
                    onPress={() => openEditForm(product)}
                    hitSlop={8}
                    pressRetentionOffset={12}
                    className="flex-1 rounded-xl py-3 items-center justify-center min-h-[44px] bg-accent-soft"
                    style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
                >
                    <Text className="text-chip uppercase text-accent">Editar</Text>
                </Pressable>
                {stockStatus === "out" ? (
                    <Pressable
                        onPress={confirmDelete}
                        disabled={deleting}
                        hitSlop={8}
                        pressRetentionOffset={12}
                        className="flex-1 rounded-xl py-3 items-center justify-center min-h-[44px] bg-danger/12"
                        style={({ pressed }) => pressed || deleting ? { opacity: 0.8 } : undefined}
                    >
                        <Text className="text-chip uppercase text-danger">
                            {deleting ? "Eliminando..." : "Eliminar"}
                        </Text>
                    </Pressable>
                ) : null}
            </View>
        </View>
    )
}

export default memo(ProductCard);