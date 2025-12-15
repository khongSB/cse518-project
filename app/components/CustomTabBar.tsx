import { Colors } from "@/app/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function CustomTabBar({ state, descriptors, navigation }: any) {
  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    return (
      <TouchableOpacity
        key={index}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        style={[styles.tabItem, isFocused && styles.tabItemFocused]}
      >
        <Text
          style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.mainTabs}>
        {state.routes
          .slice(0, 3)
          .map((route: any, index: number) => renderTab(route, index))}
      </View>
      <View style={styles.secondaryTabs}>
        {state.routes
          .slice(3)
          .map((route: any, index: number) => renderTab(route, index + 3))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    gap: 10,
  },
  mainTabs: {
    flexGrow: 3,
    flexShrink: 1,
    flexBasis: "auto",
    flexDirection: "row",
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  secondaryTabs: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    flexDirection: "row",
    backgroundColor: Colors.lightGray,
    borderRadius: 16,
    padding: 4,
    justifyContent: "center",
  },
  tabItem: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabItemFocused: {
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  tabLabelFocused: {
    color: Colors.text,
    fontWeight: "600",
  },
});
