import MovementDetail from "@/components/movements/movement-detail";
import { Colors } from "@/constants/theme";
import { getReferenceLabel } from "@/utils/movement-presentation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, useColorScheme, View } from "react-native";

export default function MovementDocumentScreen() {
    const { referenceType, referenceId } = useLocalSearchParams<{
        referenceType: string;
        referenceId: string;
    }>();
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];
    const db = useSQLiteContext();
    const router = useRouter();

    const type = Array.isArray(referenceType) ? referenceType[0] : referenceType;
    const id = Array.isArray(referenceId) ? referenceId[0] : referenceId;

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style={scheme === "dark" ? "light" : "dark"} />
            <ScrollView contentContainerClassName="gap-4 px-5 pt-12 pb-12">
                <View className="flex-row items-center gap-3">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-11 h-11 rounded-full items-center justify-center border bg-surface border-border"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={20} color={palette.text} />
                    </Pressable>
                    <View className="flex-1">
                        <Text className="text-eyebrow uppercase text-accent">Ficha de movimiento</Text>
                        <Text className="text-title text-content" numberOfLines={1}>
                            {type ? getReferenceLabel(type) : "Detalle"}
                        </Text>
                    </View>
                </View>

                {type && id ? (
                    <MovementDetail
                        db={db}
                        documentRef={{ referenceType: type, referenceId: id }}
                        palette={palette}
                    />
                ) : (
                    <View className="rounded-[22px] border p-6 items-center gap-2 bg-surface border-border">
                        <MaterialCommunityIcons
                            name="alert-octagon-outline"
                            size={26}
                            color="#DC2626"
                        />
                        <Text className="text-button-label text-content text-center">
                            No se encontró el documento.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
