import { AppText } from "@/components/ui";
import { usePalette } from "@/theme/colors";
import { cn } from "@/utils/cn";
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
              className={cn(
                "items-center justify-center gap-0.5 rounded-full py-1.5",
                focused ? "bg-accent-soft" : "bg-transparent",
              )}
              style={styles.pill}
            >
              {options.tabBarIcon?.({ focused, color, size: 22 })}
              <AppText
                variant="caption"
                className={cn(
                  "text-[10px] font-semibold",
                  focused ? "text-accent" : "text-content-muted",
                )}
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
  pill: {
    borderRadius: 16,
    borderCurve: "continuous",
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
        headerShadowVisible: false,
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
