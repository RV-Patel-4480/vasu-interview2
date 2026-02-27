import { useAppTheme } from "@/hooks/useTheme";
import { BORDER_RADIUS, SPACING } from "@/theme/tokens";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const styles = useStyles();
  const { theme, mode } = useAppTheme();
  return (
    <View style={styles.wrapper}>
      <BlurView
        intensity={60}
        tint={mode === "dark" ? "dark" : "light"}
        style={styles.blur}
      >
        <View style={styles.container}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const Icon = options.tabBarIcon as any;

            return (
              <Pressable key={route.key} onPress={onPress} style={styles.item}>
                {isFocused ? (
                  <View style={styles.activePill}>
                    <Icon color={theme.white} size={22} />
                  </View>
                ) : (
                  <View style={styles.inactiveIcon}>
                    <Icon color={theme.Gray} size={22} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const useStyles = () => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  return StyleSheet.create({
    wrapper: {
      position: "absolute",
      bottom: insets.bottom,
      left: 16,
      right: 16,
    },
    blur: {
      borderRadius: BORDER_RADIUS.xxl,
      overflow: "hidden",
    },
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: SPACING.xs,
    },
    item: {
      flex: 1,
      alignItems: "center",
    },
    activePill: {
      backgroundColor: theme.Blue,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.xxl,
      shadowColor: theme.Indigo,
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 6,
    },
    inactiveIcon: {
      padding: SPACING.sm,
    },
  });
};
