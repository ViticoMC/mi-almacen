import type { ThemePalette } from "@/components/index/types";
import Loading from "@/components/inventory/loading";
import ProductCard from "@/components/inventory/product-card";
import type { ProductWithMetrics } from "@/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { SQLiteDatabase } from "expo-sqlite";
import { useCallback } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";

type ProductListProps = {
    products: ProductWithMetrics[];
    loading: boolean;
    db: SQLiteDatabase;
    palette: ThemePalette;
    onEditProduct: (product: ProductWithMetrics) => void;
    onPreviewImage: (uri: string | null) => void;
    onReloadProducts: () => Promise<void>;
};

export default function ProductList({
    products,
    loading,
    db,
    palette,
    onEditProduct,
    onPreviewImage,
    onReloadProducts,
}: ProductListProps) {
    const renderProductItem = useCallback(
        ({ item }: { item: ProductWithMetrics }) => (
            <ProductCard
                product={item}
                db={db}
                palette={palette}
                setPreviewUri={onPreviewImage}
                openEditForm={onEditProduct}
                loadProducts={onReloadProducts}
            />
        ),
        [db, onEditProduct, onPreviewImage, onReloadProducts, palette],
    );

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
                loading ? (
                    <Loading text="Cargando productos..." />
                ) : (
                    <View className="rounded-[22px] border p-6 items-center gap-2.5 mt-2 bg-surface border-border">
                        <MaterialCommunityIcons name="package-variant-closed" size={28} color={palette.accent} />
                        <Text className="text-button-label text-content">No hay productos activos</Text>
                        <Text className="text-body-muted text-content-muted">
                            Crea tu primer producto para sincronizar el inventario con el dashboard.
                        </Text>
                    </View>
                )
            }
            contentContainerStyle={products.length === 0 ? styles.emptyContent : styles.content}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            updateCellsBatchingPeriod={80}
            windowSize={5}
            removeClippedSubviews={Platform.OS === "android"}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    content: {
        paddingBottom: 112,
    },
    emptyContent: {
        flexGrow: 1,
        paddingBottom: 112,
    },
    separator: {
        height: 14,
    },
});
