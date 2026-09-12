import { Colors } from "@/constants/theme";
import {
    createProduct,
    listProducts,
    type ProductRow,
    updateProduct
} from "@/database";
import { createId } from "@/database/utils/ids";
import {
    deleteProductImage,
    persistProductImage,
} from "@/database/utils/images";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    useColorScheme,
    View,
} from "react-native";

const emptyForm = {
    name: "",
    description: "",
    current_stock: "0",
    average_cost: "0",
    last_cost: "0",
    image_uri: null as string | null,
};

type ProductFormState = typeof emptyForm;

export default function InventoryScreen() {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const db = useSQLiteContext();
    const [products, setProducts] = useState<ProductRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSourcePickerOpen, setIsSourcePickerOpen] = useState(false);
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [originalImagePath, setOriginalImagePath] = useState<string | null>(null);
    const [form, setForm] = useState<ProductFormState>(emptyForm);

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
        setEditingId(null);
        setOriginalImagePath(null);
        setForm(emptyForm);
        setIsFormOpen(true);
    };

    const openEditForm = (product: ProductRow) => {
        setEditingId(product.id);
        setOriginalImagePath(product.image_path);
        setForm({
            name: product.name,
            description: product.description ?? "",
            current_stock: String(product.current_stock),
            average_cost: String(product.average_cost),
            last_cost: String(product.last_cost),
            image_uri: product.image_path,
        });
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setEditingId(null);
        setOriginalImagePath(null);
        setForm(emptyForm);
        setIsFormOpen(false);
    };

    const openImagePicker = () => {
        if (Platform.OS === "web") {
            pickFromLibrary();
            return;
        }

        setIsSourcePickerOpen(true);
    };

    const takePhoto = async () => {
        setIsSourcePickerOpen(false);
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setForm((prev) => ({ ...prev, image_uri: result.assets[0].uri }));
        }
    };

    const pickFromLibrary = async () => {
        setIsSourcePickerOpen(false);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setForm((prev) => ({ ...prev, image_uri: result.assets[0].uri }));
        }
    };

    const handleSave = async () => {
        const nextProduct = {
            name: form.name.trim(),
            description: form.description.trim() || null,
            current_stock: Number(form.current_stock) || 0,
            average_cost: Number(form.average_cost) || 0,
            last_cost: Number(form.last_cost) || 0,
        };

        if (!nextProduct.name) {
            return;
        }

        try {
            const productId = editingId ?? createId("product");
            let imagePath: string | null = null;

            if (form.image_uri) {
                imagePath =
                    form.image_uri === originalImagePath
                        ? form.image_uri
                        : await persistProductImage(form.image_uri, productId);
            }

            if (originalImagePath && originalImagePath !== imagePath) {
                deleteProductImage(originalImagePath);
            }

            if (editingId) {
                await updateProduct(db, editingId, {
                    ...nextProduct,
                    image_path: imagePath,
                });
            } else {
                await createProduct(db, {
                    ...nextProduct,
                    id: productId,
                    image_path: imagePath,
                });
            }
            await loadProducts();
            closeForm();
        } catch (error) {
            console.warn("No se pudo guardar el producto:", error);
        }
    };

    const changueActived = async (productId: string, active: number) => {
        try {
            active = active === 0 ? 1 : 2
            await updateProduct(db, productId, {
                active
            });
            await loadProducts();
        } catch (error) {
            console.warn("No se pudo desactivar el producto:", error);
        }
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
                    <Text className="text-button-label text-accent">
                        Nuevo
                    </Text>
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
                <View className="rounded-[22px] border p-6 items-center gap-2.5 mt-2 bg-surface border-border">
                    <Text className="text-button-label text-content">Cargando inventario...</Text>
                </View>
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
                        <View key={product.id} className="rounded-[20px] border p-4 gap-3.5 bg-surface border-border">
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
                                            className="w-14 h-14 rounded-2xl bg-border"
                                            contentFit="cover"
                                            transition={150}
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

                            <View className="flex-row justify-between gap-2">
                                <View>
                                    <Text className="text-body-muted text-content-muted">Costo medio</Text>
                                    <Text className="text-button-label text-content">${Number(product.average_cost || 0).toFixed(2)}</Text>
                                </View>
                                <View>
                                    <Text className="text-body-muted text-content-muted">Ultimo costo</Text>
                                    <Text className="text-button-label text-content">${Number(product.last_cost || 0).toFixed(2)}</Text>
                                </View>
                            </View>

                            <View className="flex-row gap-3">
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
                                    onPress={() => changueActived(product.id, product.active)}
                                    hitSlop={8}
                                    pressRetentionOffset={12}
                                    className="flex-1 rounded-xl py-3 items-center justify-center min-h-[44px] bg-danger/12"
                                    style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
                                >
                                    <Text className="text-chip uppercase text-accent">{product.active === 0 ? "Activar" : "Desactivar"}</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            <Modal transparent visible={isFormOpen} animationType="slide" onRequestClose={closeForm}>
                <View className="flex-1 justify-end bg-[rgba(15,23,42,0.45)]">
                    <View className="rounded-t-[28px] border pt-[18px] px-[18px] pb-6 min-h-[70%] bg-surface border-border">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-section-title text-content">
                                {editingId ? "Editar producto" : "Nuevo producto"}
                            </Text>
                            <Pressable onPress={closeForm}>
                                <MaterialCommunityIcons name="close" size={22} color={palette.text} />
                            </Pressable>
                        </View>

                        <ScrollView contentContainerClassName="gap-4 pb-3" keyboardShouldPersistTaps="handled">
                            <View className="gap-2">
                                <Text className="text-body-muted text-content-muted">Foto del producto</Text>
                                <Pressable
                                    onPress={openImagePicker}
                                    className="rounded-[22px] overflow-hidden bg-accent-soft border border-dashed border-border"
                                    style={({ pressed }) => pressed ? { opacity: 0.85 } : undefined}
                                >
                                    {form.image_uri ? (
                                        <Image
                                            source={{ uri: form.image_uri }}
                                            className="w-full h-48 bg-border"
                                            contentFit="cover"
                                            transition={200}
                                        />
                                    ) : (
                                        <View className="w-full h-48 items-center justify-center gap-2.5">
                                            <MaterialCommunityIcons name="image-plus" size={40} color={palette.accent} />
                                            <Text className="text-body-muted text-content-muted">
                                                Toca para agregar foto del producto
                                            </Text>
                                        </View>
                                    )}
                                </Pressable>
                                {form.image_uri ? (
                                    <View className="flex-row gap-3">
                                        <Pressable
                                            onPress={openImagePicker}
                                            className="flex-1 rounded-xl py-3 items-center bg-accent-soft"
                                            style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
                                        >
                                            <Text className="text-chip uppercase text-accent">Cambiar</Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => setForm((prev) => ({ ...prev, image_uri: null }))}
                                            className="flex-1 rounded-xl py-3 items-center bg-danger/12"
                                            style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
                                        >
                                            <Text className="text-chip uppercase text-danger">Quitar</Text>
                                        </Pressable>
                                    </View>
                                ) : null}
                            </View>

                            <View className="gap-2">
                                <Text className="text-body-muted text-content-muted">Nombre</Text>
                                <TextInput
                                    value={form.name}
                                    onChangeText={(value) => setForm((prev) => ({ ...prev, name: value }))}
                                    placeholder="Ej. Arroz Premium"
                                    placeholderTextColor={palette.textMuted}
                                    className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                                />
                            </View>

                            <View className="gap-2">
                                <Text className="text-body-muted text-content-muted">Descripcion</Text>
                                <TextInput
                                    value={form.description}
                                    onChangeText={(value) => setForm((prev) => ({ ...prev, description: value }))}
                                    placeholder="Descripcion breve"
                                    placeholderTextColor={palette.textMuted}
                                    multiline
                                    className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background min-h-[90px]"
                                    style={{ textAlignVertical: "top" }}
                                />
                            </View>

                            <View className="flex-row gap-3">
                                <View className="flex-1 gap-2">
                                    <Text className="text-body-muted text-content-muted">Stock</Text>
                                    <TextInput
                                        value={form.current_stock}
                                        onChangeText={(value) => setForm((prev) => ({ ...prev, current_stock: value }))}
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor={palette.textMuted}
                                        className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                                    />
                                </View>
                                <View className="flex-1 gap-2">
                                    <Text className="text-body-muted text-content-muted">Costo medio</Text>
                                    <TextInput
                                        value={form.average_cost}
                                        onChangeText={(value) => setForm((prev) => ({ ...prev, average_cost: value }))}
                                        keyboardType="decimal-pad"
                                        placeholder="0"
                                        placeholderTextColor={palette.textMuted}
                                        className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                                    />
                                </View>
                            </View>

                            <View className="gap-2">
                                <Text className="text-body-muted text-content-muted">Ultimo costo</Text>
                                <TextInput
                                    value={form.last_cost}
                                    onChangeText={(value) => setForm((prev) => ({ ...prev, last_cost: value }))}
                                    keyboardType="decimal-pad"
                                    placeholder="0"
                                    placeholderTextColor={palette.textMuted}
                                    className="border border-border rounded-[14px] px-3 py-3 text-[15px] text-content bg-background"
                                />
                            </View>
                        </ScrollView>

                        <View className="flex-row gap-3 mt-4">
                            <Pressable onPress={closeForm} className="flex-1 border rounded-[14px] py-3 items-center border-border">
                                <Text className="text-button-label text-content">Cancelar</Text>
                            </Pressable>
                            <Pressable onPress={handleSave} className="flex-1 rounded-2xl px-3.5 py-3 items-center bg-accent">
                                <Text className="text-button-label text-accent">Guardar</Text>
                            </Pressable>
                        </View>
                    </View>

                    {isSourcePickerOpen && (
                        <View className="absolute inset-0 bg-[rgba(15,23,42,0.55)]">
                            <Pressable className="flex-1" onPress={() => setIsSourcePickerOpen(false)} />
                            <View className="rounded-t-[28px] border-t px-[18px] pt-[18px] pb-6 gap-3 bg-surface border-border">
                                <Text className="text-section-title text-content mb-1">Foto del producto</Text>
                                <Pressable
                                    onPress={takePhoto}
                                    className="flex-row items-center gap-3 rounded-2xl p-4 bg-accent-soft"
                                    style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
                                >
                                    <MaterialCommunityIcons name="camera-outline" size={20} color={palette.accent} />
                                    <Text className="text-button-label text-content">Tomar foto</Text>
                                </Pressable>
                                <Pressable
                                    onPress={pickFromLibrary}
                                    className="flex-row items-center gap-3 rounded-2xl p-4 bg-accent-soft"
                                    style={({ pressed }) => pressed ? { opacity: 0.8 } : undefined}
                                >
                                    <MaterialCommunityIcons name="image-multiple-outline" size={20} color={palette.accent} />
                                    <Text className="text-button-label text-content">Elegir de la galeria</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setIsSourcePickerOpen(false)}
                                    className="rounded-2xl py-4 items-center border border-border"
                                >
                                    <Text className="text-button-label text-content">Cancelar</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>

            <Modal
                transparent
                visible={previewUri !== null}
                animationType="fade"
                onRequestClose={() => setPreviewUri(null)}
            >
                <Pressable
                    className="flex-1 items-center justify-center bg-[rgba(15,23,42,0.85)]"
                    onPress={() => setPreviewUri(null)}
                >
                    {previewUri ? (
                        <Image
                            source={{ uri: previewUri }}
                            className="w-[86%] max-w-[420px] aspect-square rounded-3xl bg-border"
                            contentFit="cover"
                            transition={200}
                        />
                    ) : null}
                    <View className="absolute top-12 right-6">
                        <MaterialCommunityIcons name="close" size={28} color="#fff" />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}