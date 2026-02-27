import { Tabs } from "expo-router";
import { BookOpenText, Home, User } from "lucide-react-native";
import React from "react";

import CustomTabBar from "@/components/CustomTabBar";
import { HapticTab } from "@/components/haptic-tab";
import { useAppTheme } from "@/hooks/useTheme";
import { setParams } from "expo-router/build/global-state/routing";

export default function TabLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: theme.Blue,
        tabBarInactiveTintColor: theme.Gray,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.SystemBackground,
          borderTopColor: theme.Separator,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Instructors",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          headerShown: true,
          headerSearchBarOptions: {
            placeholder: "Search Instructors...",
            onChangeText: (event) => {
              setParams({ search: event.nativeEvent.text });
            },
          },
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({ color }) => <BookOpenText size={24} color={color} />,
          headerShown: true,
          headerSearchBarOptions: {
            placeholder: "Search Courses...",
            onChangeText: (event) => {
              setParams({ search: event.nativeEvent.text || "" });
            },
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
