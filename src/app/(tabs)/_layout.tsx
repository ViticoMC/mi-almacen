import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, useColorScheme, useWindowDimensions, View } from "react-native";

export default function TabsLayout() {
    const scheme = useColorScheme();
    const theme = Colors[scheme === "dark" ? "dark" : "light"];
    const { height } = useWindowDimensions();
    const isCompactHeight = height < 780;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                animation: "shift",
                lazy: true,
                freezeOnBlur: true,
                sceneStyle: {
                    backgroundColor: theme.background,
                },
                tabBarActiveTintColor: theme.text,
                tabBarInactiveTintColor: theme.textMuted,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "700",
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                    marginTop: 4,
                    lineHeight: 12,
                },
                tabBarStyle: {
                    position: "absolute",
                    left: isCompactHeight ? 14 : 16,
                    right: isCompactHeight ? 14 : 16,
                    bottom: isCompactHeight ? 10 : 16,
                    height: isCompactHeight ? 74 : 80,
                    borderRadius: 30,
                    borderTopWidth: 0,
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    borderWidth: 1,
                    shadowColor: theme.shadow,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: scheme === "dark" ? 0.3 : 0.1,
                    shadowRadius: 22,
                    elevation: 16,
                    paddingTop: 8,
                    paddingBottom: isCompactHeight ? 6 : 8,
                    paddingHorizontal: 6,
                },
                tabBarItemStyle: {
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingHorizontal: 4,
                },
                tabBarLabelPosition: "below-icon",
                tabBarShowLabel: true,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={[styles.iconBubble, focused && styles.iconBubbleFocused]}>
                            <MaterialCommunityIcons
                                name="view-dashboard-outline"
                                size={(size ?? 22) - 1}
                                color={focused ? "#FFFFFF" : color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen

                name="inventory"
                options={{
                    title: "Inventario",
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={[styles.iconBubble, focused && styles.iconBubbleFocused]}>
                            <MaterialCommunityIcons
                                name="warehouse"
                                size={(size ?? 22) - 1}
                                color={focused ? "#FFFFFF" : color}

                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="movements"
                options={{
                    title: "Movimientos",
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={[styles.iconBubble, focused && styles.iconBubbleFocused]}>
                            <MaterialCommunityIcons
                                name="swap-horizontal"
                                size={(size ?? 22) - 1}
                                color={focused ? "#FFFFFF" : color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    title: "Estadisticas",
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={[styles.iconBubble, focused && styles.iconBubbleFocused]}>
                            <MaterialCommunityIcons
                                name="chart-box-outline"
                                size={(size ?? 22) - 1}
                                color={focused ? "#FFFFFF" : color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconBubble: {
        width: 36,
        height: 36,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
        backgroundColor: "rgba(100, 116, 139, 0.12)",
    },
    iconBubbleFocused: {
        backgroundColor: "#0A5FD8",
    },
});