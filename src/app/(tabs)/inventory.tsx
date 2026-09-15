import Loading from "@/components/inventory/loading";
import ModalPreviewImage from "@/components/inventory/modal-preview-image";
import ProductCard from "@/components/inventory/product-card";
import ProductForm from "@/components/inventory/product-form";
import { Colors } from "@/constants/theme";
import {
    listProducts,
    type ProductRow
} from "@/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    useColorScheme,
    View
} from "react-native";



export default function InventoryScreen() {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const db = useSQLiteContext();
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
    const [previewUri, setPreviewUri] = useState<string | null>(null);


    const loadProducts = async () => {
        try {
            const rows = await listProducts(db);
            setProducts(rows);
        } catch (error) {
            console.warn("No se pudieron cargar los productos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        listProducts(db)
            .then((rows) => {
                if (isMounted) {
                    setProducts(rows);
                }
            })
            .catch((error) => {
                console.warn("No se pudieron cargar los productos:", error);
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [db]);

    const openCreateForm = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const openEditForm = (product: ProductRow) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setEditingProduct(null);
        setIsFormOpen(false);
    };




    return (
        <View className="flex-1 px-5 pt-6 pb-[90px] bg-background">
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
                    <MaterialCommunityIcons name="plus" size={18} color="#fff" />

                </Pressable>
            </View>

            <View className="flex-row gap-3 mb-[18px]">
                <View className="flex-1 p-4 rounded-[18px] border bg-surface border-border">
                    <Text className="text-body-muted text-content-muted">Productos</Text>
                    <Text className="text-metric-value text-content">{products.length}</Text>
                </View>
                <View className="flex-1 p-4 rounded-[18px] border bg-surface border-border">
                    <Text className="text-body-muted text-content-muted">Stock total</Text>
                    <Text className="text-metric-value text-content">{products.reduce((sum, product) => sum + Number(product.current_stock || 0), 0)}</Text>
                </View>
            </View>

            {loading ? (
                <Loading text="Cargando productos..." />
            ) : products.length === 0 ? (
                <View className="rounded-[22px] border p-6 items-center gap-2.5 mt-2 bg-surface border-border">
                    <MaterialCommunityIcons name="package-variant-closed" size={28} color={palette.accent} />
                    <Text className="text-button-label text-content">No hay productos activos</Text>
                    <Text className="text-body-muted text-content-muted">
                        Crea tu primer producto para sincronizar el inventario con el dashboard.
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerClassName="gap-3.5 pb-5" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} db={db} setPreviewUri={setPreviewUri} openEditForm={openEditForm} palette={palette} loadProducts={loadProducts} />
                    ))}
                </ScrollView>
            )}

            <ProductForm
                key={isFormOpen ? editingProduct?.id ?? "new" : "closed"}
                closeForm={closeForm}
                db={db}
                isFormOpen={isFormOpen}
                loadProducts={loadProducts}
                product={editingProduct}
                palette={palette}
            />

            <ModalPreviewImage previewUri={previewUri} setPreviewUri={setPreviewUri} palette={palette} />
        </View>
    );
}