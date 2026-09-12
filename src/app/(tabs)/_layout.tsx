import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";

export default function TabsLayout() {
    const scheme = useColorScheme();
    const theme = Colors[scheme === "dark" ? "dark" : "light"];

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
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
                    marginTop: -2,
                },
                tabBarStyle: {
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 16,
                    height: 80,
                    borderRadius: 28,
                    borderTopWidth: 0,
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    shadowColor: theme.shadow,
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: scheme === "dark" ? 0.35 : 0.12,
                    shadowRadius: 24,
                    elevation: 18,
                },
                tabBarItemStyle: {
                    paddingTop: 8,
                    paddingBottom: 10,
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
                                size={size ?? 22}
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
                                size={size ?? 22}
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
                                size={size ?? 22}
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
        width: 34,
        height: 34,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(100, 116, 139, 0.12)",
    },
    iconBubbleFocused: {
        backgroundColor: "#0A5FD8",
    },
});