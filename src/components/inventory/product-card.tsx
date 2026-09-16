import type { ThemePalette } from "@/components/index/types";
import {
    updateProduct,
    type ProductWithMetrics
} from "@/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { SQLiteDatabase } from "expo-sqlite";
import { memo } from "react";
import {
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
    const hasCosts =
        Number(product.average_cost || 0) > 0 || Number(product.last_cost || 0) > 0;

    const formatCost = (value: number) => {
        return hasCosts ? `$${Number(value || 0).toFixed(2)}` : "—";
    };

    const changueActived = async () => {
        let { active, id: productId } = product;
        try {
            active = active === 0 ? 1 : 0
            await updateProduct(db, productId, {
                active
            });
            await loadProducts();
        } catch (error) {
            console.warn("No se pudo desactivar el producto:", error);
        }
    };

    return (
        <View className="rounded-[20px] border p-4 gap-3.5 bg-surface border-border">
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
                <View className="rounded-full px-2.5 py-1.5 self-start bg-accent-soft">
                    <Text className="text-chip uppercase text-accent">
                        {Number(product.current_stock || 0)} u.
                    </Text>
                </View>
            </View>

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
                <Pressable
                    onPress={() => changueActived()}
                    hitSlop={8}
                    pressRetentionOffset={12}
                    className="flex-1 rounded-xl py-3 items-center justify-center min-h-[44px] bg-danger/12"
                    style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
                >
                    <Text className="text-chip uppercase text-danger">{product.active === 0 ? "Activar" : "Desactivar"}</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default memo(ProductCard);