import { AppText } from "@/components/ui";
import { usePalette } from "@/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import type { ComponentProps } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type ColorValue,
} from "react-native";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

function tabIcon(name: IconName) {
  return function TabBarIcon({ color, size }: { color: ColorValue; size: number }) {
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  };
}

function AppTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const palette = usePalette();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label = options.title ?? route.name;
        const color = focused ? palette.accent : palette.contentMuted;

        function handlePress() {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }

        function handleLongPress() {
          navigation.emit({ type: "tabLongPress", target: route.key });
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={handlePress}
            onLongPress={handleLongPress}
            style={styles.item}
          >
            <View
              style={[
                styles.tabBackground,
                {
                  backgroundColor: focused ? palette.accentSoft : "transparent",
                },
              ]}
            >
              {options.tabBarIcon?.({ focused, color, size: 22 })}
              <AppText
                variant="caption"
                style={[styles.label, { color }]}
                numberOfLines={1}
              >
                {label}
              </AppText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flex: 1,
    marginHorizontal: 3,
    marginBottom: 4,
  },
  tabBackground: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 6,
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

export default function TabsLayout() {
  const palette = usePalette();

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: palette.background },
        headerTintColor: palette.content,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: true,
        sceneStyle: { backgroundColor: palette.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Inicio", tabBarIcon: tabIcon("view-dashboard-outline") }}
      />
      <Tabs.Screen
        name="inventory"
        options={{ title: "Inventario", tabBarIcon: tabIcon("package-variant-closed") }}
      />
      <Tabs.Screen
        name="movements"
        options={{ title: "Movimientos", tabBarIcon: tabIcon("swap-horizontal") }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: "Historial", tabBarIcon: tabIcon("history") }}
      />
    </Tabs>
  );
}
