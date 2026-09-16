import { Colors } from "@/constants/theme";
import type { ReactElement } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MovementRow from "@/components/movements/movement-row";
import type { MovementView } from "@/utils/movement-presentation";

type MovementListProps = {
    header: ReactElement;
    views: MovementView[];
    loading: boolean;
    loadingMore: boolean;
    canLoadMore: boolean;
    onLoadMore: () => void;
};

function renderMovementItem({ item }: { item: MovementView }) {
    return <MovementRow movement={item} />;
}

export default function MovementList({
    header,
    views,
    loading,
    loadingMore,
    canLoadMore,
    onLoadMore,
}: MovementListProps) {
    const scheme = useColorScheme();
    const palette = Colors[scheme === "dark" ? "dark" : "light"];

    return (
        <FlatList
            data={views}
            keyExtractor={(item) => item.id}
            renderItem={renderMovementItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={header}
            ListEmptyComponent={
                loading ? (
                    <View className="rounded-[24px] border p-5 items-center bg-surface border-border">
                        <Text className="text-body-muted text-content-muted">Cargando movimientos...</Text>
                    </View>
                ) : (
                    <View className="rounded-[24px] border p-6 items-center gap-2.5 bg-surface border-border">
                        <MaterialCommunityIcons name="swap-horizontal" size={28} color={palette.accent} />
                        <Text className="text-button-label text-content">No hay movimientos para este filtro</Text>
                        <Text className="text-body-muted text-content-muted text-center">
                            Registra una operacion manual o cambia el filtro para ver mas actividad.
                        </Text>
                    </View>
                )
            }
            ListFooterComponent={
                loadingMore ? (
                    <View className="rounded-[24px] border p-4 items-center bg-surface border-border">
                        <Text className="text-body-muted text-content-muted">Cargando mas movimientos...</Text>
                    </View>
                ) : canLoadMore ? (
                    <Pressable
                        onPress={onLoadMore}
                        className="rounded-[24px] border p-4 items-center bg-surface border-border"
                    >
                        <Text className="text-button-label text-accent">Mostrar mas movimientos</Text>
                    </Pressable>
                ) : null
            }
            ListFooterComponentStyle={canLoadMore || loadingMore ? styles.footer : undefined}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
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
    separator: {
        height: 12,
    },
    footer: {
        marginTop: 12,
    },
});
