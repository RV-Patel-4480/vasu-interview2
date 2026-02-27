import { Link, useRouter } from "expo-router";
import { Lock, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/stores/auth.store";
import { SPACING, TEXT_SIZE, TITLE_SIZE } from "@/theme/tokens";
import { z } from "zod";

import { loginApi } from "@/api/auth.api";
import Button from "@/components/Button";
import Input from "@/components/Input";
import KeyboardAvoidingViewWrapper from "@/components/KeyboardAvoidingViewWrapper";
import Typography from "@/components/Typography";
import { initNotifications } from "@/services/notification.service";
import { StorageService } from "@/services/storage.service";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { theme } = useAppTheme();
  const { setAuth } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const handleLogin = async () => {
    setLoading(true);
    setErrors({});

    const payload = { username: username.trim(), password };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<string, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string | undefined;
        if (key) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await loginApi({
        username: payload.username,
        password: payload.password,
      });

      if (res.success && res.data) {
        const { user, accessToken, refreshToken } = res.data;
        await StorageService.setRefreshToken(refreshToken);
        await setAuth(accessToken, user as any);

        router.replace("/");
        await initNotifications();
      } else {
        const msg = res.message || "Login failed";
        Alert.alert("Login Error", msg);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data: any = err.response.data;
        const message = data?.message || "Login failed";
        Alert.alert("Login Error", message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingViewWrapper style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logoImage}
            />
          </View>
          <Typography variant="h1" color={theme.white} style={styles.appName}>
            {`Vasu's Interview`}
          </Typography>
          <Typography variant="body" color={theme.white}>
            Expo app demo for interview
          </Typography>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formTopContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputGroup}>
              <Input
                label="User name"
                placeholder="Enter your username"
                value={username}
                onChangeText={(t) => {
                  setUsername(t);
                  setErrors((prev) => ({ ...prev, username: "" }));
                }}
                autoCapitalize="none"
                icon={<User size={20} color={theme.SecondaryLabel} />}
                error={errors.username}
                textContentType="username"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                secureTextEntry
                icon={<Lock size={20} color={theme.SecondaryLabel} />}
                error={errors.password}
                onSubmitEditing={handleLogin}
                textContentType="password"
              />
            </View>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              containerStyle={styles.loginButton}
              variant="gradient"
            />
          </View>

          <View style={styles.footer}>
            <Typography variant="body" color={theme.SecondaryLabel}>
              {`Don't have an account? `}
            </Typography>
            <Link href={"/signup"} asChild>
              <TouchableOpacity>
                <Typography
                  variant="body"
                  color={theme.Blue}
                  style={{ fontWeight: "700" }}
                >
                  Create Account
                </Typography>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingViewWrapper>
  );
}

const useStyles = () => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      backgroundColor: theme.Indigo,
      paddingTop: insets.top,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      alignItems: "center",
      paddingTop: 40,
      paddingBottom: 20,
      paddingHorizontal: SPACING.lg,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.sm,
    },
    logoImage: {
      width: 74,
      height: 74,
      borderRadius: 20,
      resizeMode: "contain",
    },
    appName: {
      marginBottom: SPACING.xs,
    },

    formContainer: {
      flex: 1,
      backgroundColor: theme.SecondarySystemGroupedBackground,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.lg,
    },
    formTopContainer: {
      flex: 1,
    },
    welcomeText: {
      fontSize: TITLE_SIZE.h2,
      fontWeight: "700",
      color: theme.Label,
    },
    subtitle: {
      fontSize: TEXT_SIZE.md,
      color: theme.SecondaryLabel,
      marginBottom: SPACING.xl,
    },
    inputGroup: {
      gap: 14,
    },
    loginButton: {
      marginVertical: SPACING.lg,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: insets.bottom,
    },
  });
};
