import {
    createProduct,
    type ProductRow,
    updateProduct
} from "@/database";
import { createId } from '@/database/utils/ids';
import {
    deleteProductImage, persistProductImage,
} from '@/database/utils/images';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { SQLiteDatabase } from "expo-sqlite";
import { useState } from 'react';
import {
    Modal, Platform, Pressable, ScrollView, Text, TextInput, View
} from 'react-native';

const emptyForm = {
    name: "",
    description: "",
    current_stock: "0",
    average_cost: "0",
    last_cost: "0",
    image_uri: null as string | null,

};

type ProductFormState = typeof emptyForm;

interface ProductFormProps {
    isFormOpen: boolean,
    closeForm: () => void
    palette: any
    product: ProductRow | null
    db: SQLiteDatabase
    loadProducts: () => Promise<void>
}

export default function ProductForm({
    isFormOpen,
    closeForm,
    palette,
    product,
    db,
    loadProducts,
}: ProductFormProps) {

    const initialForm = product
        ? {
            name: product.name,
            description: product.description ?? "",
            current_stock: String(product.current_stock),
            average_cost: String(product.average_cost),
            last_cost: String(product.last_cost),
            image_uri: product.image_path,
        }
        : emptyForm;

    const [form, setForm] = useState<ProductFormState>(initialForm);
    const [isSourcePickerOpen, setIsSourcePickerOpen] = useState(false);
    const [draftProductId] = useState<string>(() => product?.id ?? createId("product"));
    const [originalImagePath] = useState<string | null>(() => product?.image_path ?? null);



    const persistFormImage = async (sourceUri: string) => {
        const productId = draftProductId;
        const previousImage = form.image_uri;
        const nextImage = await persistProductImage(sourceUri, productId);

        if (
            previousImage &&
            previousImage !== originalImagePath &&
            previousImage !== nextImage
        ) {
            await deleteProductImage(previousImage);
        }

        setForm((prev) => ({ ...prev, image_uri: nextImage }));
    };

    const removeFormImage = async () => {
        const currentImage = form.image_uri;

        setForm((prev) => ({ ...prev, image_uri: null }));

        if (currentImage && currentImage !== originalImagePath) {
            await deleteProductImage(currentImage);
        }
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
            await persistFormImage(result.assets[0].uri);
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
            await persistFormImage(result.assets[0].uri);
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
            const productId = product?.id ?? draftProductId;
            let imagePath: string | null = null;

            if (form.image_uri) {
                imagePath = form.image_uri;
            }

            if (originalImagePath && originalImagePath !== imagePath) {
                await deleteProductImage(originalImagePath);
            }

            if (product) {
                await updateProduct(db, product.id, {
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


    return (
        <Modal transparent visible={isFormOpen} animationType="slide" onRequestClose={closeForm}>
            <View className="flex-1 justify-end bg-[rgba(15,23,42,0.45)]">
                <View className="rounded-t-[28px] border pt-[18px] px-[18px] pb-6 min-h-[70%] bg-surface border-border">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-section-title text-content">
                            {product ? "Editar producto" : "Nuevo producto"}
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
                                        style={{
                                            width: "100%",
                                            height: 192,
                                            backgroundColor: palette.border,
                                        }}
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
                                        onPress={() => {
                                            void removeFormImage();
                                        }}
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
    )
}