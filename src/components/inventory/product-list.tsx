import type { ThemePalette } from "@/components/index/types";
import Loading from "@/components/inventory/loading";
import ProductCard from "@/components/inventory/product-card";
import type { ProductWithMetrics } from "@/database";
import type { InventoryFilter } from "@/utils/inventory-filters";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { SQLiteDatabase } from "expo-sqlite";
import { useCallback } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";

type ProductListProps = {
    products: ProductWithMetrics[];
    loading: boolean;
    db: SQLiteDatabase;
    palette: ThemePalette;
    filter: InventoryFilter;
    searchQuery: string;
    onEditProduct: (product: ProductWithMetrics) => void;
    onPreviewImage: (uri: string | null) => void;
    onReloadProducts: () => Promise<void>;
};

export default function ProductList({
    products,
    loading,
    db,
    palette,
    filter,
    searchQuery,
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

    const hasSearch = searchQuery.trim().length > 0;

    const emptyTitle = hasSearch
        ? `Sin resultados para "${searchQuery.trim()}"`
        : filter === "LOW_STOCK"
            ? "Sin productos en bajo stock"
            : "No hay productos activos";

    const emptyDescription = hasSearch
        ? "Prueba con otro nombre o limpia la búsqueda para ver todo el inventario."
        : filter === "LOW_STOCK"
            ? "Todos los productos están por encima del mínimo (10 u.). Buen nivel de inventario."
            : "Crea tu primer producto para sincronizar el inventario con el dashboard.";

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
                        <MaterialCommunityIcons
                            name={filter === "LOW_STOCK" && !hasSearch ? "check-circle-outline" : "package-variant-closed"}
                            size={28}
                            color={palette.accent}
                        />
                        <Text className="text-button-label text-content text-center">{emptyTitle}</Text>
                        <Text className="text-body-muted text-content-muted text-center">
                            {emptyDescription}
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
