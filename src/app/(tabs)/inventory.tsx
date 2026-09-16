import InventoryFilterBar from "@/components/inventory/inventory-filter-bar";
import ModalPreviewImage from "@/components/inventory/modal-preview-image";
import ProductForm from "@/components/inventory/product-form";
import ProductList from "@/components/inventory/product-list";
import { Colors } from "@/constants/theme";
import type { ProductWithMetrics } from "@/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import { useProducts } from "@/hooks/useProducts";
import { filterProducts, isLowStock, type InventoryFilter } from "@/utils/inventory-filters";

export default function InventoryScreen() {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const db = useSQLiteContext();
    const router = useRouter();
    const params = useLocalSearchParams<{ openForm?: string; filter?: string }>();
    const { products, loading, reloadProducts } = useProducts(db);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductWithMetrics | null>(null);
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [filter, setFilter] = useState<InventoryFilter>("ALL");
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (params.openForm !== "true") {
            return;
        }

        router.setParams({ openForm: undefined });

        Promise.resolve().then(() => {
            setEditingProduct(null);
            setIsFormOpen(true);
        });
    }, [params.openForm, router]);

    useEffect(() => {
        if (params.filter !== "low-stock") {
            return;
        }

        router.setParams({ filter: undefined });

        Promise.resolve().then(() => {
            setFilter("LOW_STOCK");
        });
    }, [params.filter, router]);

    const totalStock = useMemo(
        () => products.reduce((sum, product) => sum + Number(product.current_stock || 0), 0),
        [products],
    );

    const lowStockCount = useMemo(
        () => products.filter((product) => isLowStock(product)).length,
        [products],
    );

    const filteredProducts = useMemo(
        () => filterProducts(products, filter, query),
        [products, filter, query],
    );

    const filterOptions = useMemo(
        () => [
            { value: "ALL" as InventoryFilter, label: "Todos", count: products.length },
            { value: "LOW_STOCK" as InventoryFilter, label: "Bajo stock", count: lowStockCount },
        ],
        [products.length, lowStockCount],
    );

    const openCreateForm = useCallback(() => {
        setEditingProduct(null);
        setIsFormOpen(true);
    }, []);

    const openEditForm = useCallback((product: ProductWithMetrics) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    }, []);

    const closeForm = useCallback(() => {
        setEditingProduct(null);
        setIsFormOpen(false);
    }, []);

    return (
        <View className="flex-1 px-5 pt-6 bg-background">
            <StatusBar style={scheme === "dark" ? "light" : "dark"} />
            <View className="flex-row items-center justify-between mb-5 gap-3">
                <View className="flex-1">
                    <Text className="text-eyebrow uppercase text-accent">
                        Catalogo
                    </Text>
                    <Text className="text-title text-content">
                        Inventario
                    </Text>
                </View>
                <Pressable
                    onPress={openCreateForm}
                    className="flex-row items-center gap-2 rounded-2xl px-3.5 py-2.5 bg-accent"
                    style={({ pressed }) => pressed ? { opacity: 0.9 } : undefined}
                >
                    <MaterialCommunityIcons name="plus" size={18} color={palette.onAccent} />

                </Pressable>
            </View>

            <View className="flex-row gap-3 mb-[18px]">
                <View className="flex-1 p-4 rounded-[18px] border bg-surface border-border">
                    <Text className="text-body-muted text-content-muted">Productos</Text>
                    <Text className="text-metric-value text-content">{products.length}</Text>
                </View>
                <View className="flex-1 p-4 rounded-[18px] border bg-surface border-border">
                    <Text className="text-body-muted text-content-muted">Stock total</Text>
                    <Text className="text-metric-value text-content">{totalStock}</Text>
                </View>
            </View>

            <View className="flex-row items-center gap-2 mb-3 px-4 py-1 rounded-2xl border bg-surface border-border">
                <MaterialCommunityIcons name="magnify" size={18} color={palette.textMuted} />
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Buscar por nombre..."
                    placeholderTextColor={palette.textMuted}
                    className="flex-1 py-3 text-[15px] text-content"
                    returnKeyType="search"
                    accessibilityLabel="Buscar productos por nombre"
                />
                {query.length > 0 ? (
                    <Pressable
                        onPress={() => setQuery("")}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel="Limpiar búsqueda"
                    >
                        <MaterialCommunityIcons name="close-circle-outline" size={18} color={palette.textMuted} />
                    </Pressable>
                ) : null}
            </View>

            <InventoryFilterBar
                filter={filter}
                options={filterOptions}
                onSelect={setFilter}
                palette={palette}
            />

            <ProductList
                products={filteredProducts}
                loading={loading}
                db={db}
                palette={palette}
                filter={filter}
                searchQuery={query}
                onEditProduct={openEditForm}
                onPreviewImage={setPreviewUri}
                onReloadProducts={reloadProducts}
            />

            {isFormOpen ? (
                <ProductForm
                    key={editingProduct?.id ?? "new"}
                    closeForm={closeForm}
                    db={db}
                    isFormOpen={isFormOpen}
                    loadProducts={reloadProducts}
                    product={editingProduct}
                    palette={palette}
                />
            ) : null}

            {previewUri ? (
                <ModalPreviewImage previewUri={previewUri} setPreviewUri={setPreviewUri} palette={palette} />
            ) : null}
        </View>
    );
}
