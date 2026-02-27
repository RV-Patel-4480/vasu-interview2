import { useNavigationTheme } from "@/hooks/useNavigatonTheme";
import { KeyboardProvider } from "react-native-keyboard-controller";

import {
  cancelAllNotifications,
  onNotificationReceive,
  onNotificationResponse,
  scheduleInactivityReminder,
} from "@/services/notification.service";
import { StorageKeys, StorageService } from "@/services/storage.service";
import { useAuthStore } from "@/stores/auth.store";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { ThemeProvider } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState, LogBox, View } from "react-native";
import "react-native-reanimated";

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const navigationTheme = useNavigationTheme();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  useEffect(() => {
    const receiveSubscription = onNotificationReceive((notification) => {
      console.log("Received notification in foreground:", notification);
    });

    const responseSubscription = onNotificationResponse((response) => {
      console.log("User interacted with notification:", response);
      const data = response.notification.request.content.data;

      if (data?.type === "BOOKMARK_MILESTONE") {
        router.push("/(tabs)/courses");
      }
      if (data?.type === "INACTIVITY_REMINDER") {
        router.push("/");
      }
    });
    return () => {
      receiveSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  useEffect(() => {
    let currentState: string = "active";

    AppState.addEventListener("change", async (nextState) => {
      if (currentState.match(/inactive|background/) && nextState === "active") {
        await cancelAllNotifications();
        await StorageService.setString(
          StorageKeys.LAST_APP_OPEN,
          new Date().toISOString(),
        );
      }

      if (["background", "inactive"].includes(nextState)) {
        await scheduleInactivityReminder();
      }

      currentState = nextState;
    });
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <View
        style={{ flex: 1, backgroundColor: navigationTheme.colors.background }}
      />
    );
  }

  return (
    <KeyboardProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="course/[id]"
              options={{
                presentation: "formSheet",
                headerShown: false,
                sheetCornerRadius: 16,
                sheetAllowedDetents: [0.5, 1],
                sheetInitialDetentIndex: 0,
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="instructor/[id]"
              options={{
                presentation: "formSheet",
                headerShown: false,
                sheetCornerRadius: 16,
                sheetAllowedDetents: [0.5],
                sheetInitialDetentIndex: 0,
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="webview/[id]"
              options={{ headerShown: true, title: "Web View" }}
            />
          </Stack.Protected>
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </KeyboardProvider>
  );
}
