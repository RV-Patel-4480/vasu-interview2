import { useRouter } from "expo-router";
import { Lock, Mail, User } from "lucide-react-native";
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
import { SPACING, TEXT_SIZE, TITLE_SIZE } from "@/theme/tokens";
import { z } from "zod";

import { registerApi } from "@/api/auth.api";
import Button from "@/components/Button";
import Input from "@/components/Input";
import KeyboardAvoidingViewWrapper from "@/components/KeyboardAvoidingViewWrapper";
import SegmentedControl from "@/components/SegmentedControl";
import Typography from "@/components/Typography";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignupScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { theme } = useAppTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [roleIndex, setRoleIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const RoleTabs = ["USER", "ADMIN"] as const;

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const schema = z
    .object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
      role: z.enum(["USER", "ADMIN"]),
    })
    .superRefine((val, ctx) => {
      if (val.password !== val.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    });

  const handleSignup = async () => {
    setLoading(true);
    setErrors({});

    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: RoleTabs[roleIndex],
    };

    const parse = schema.safeParse(payload);
    if (!parse.success) {
      const fieldErrors: Partial<Record<string, string>> = {};
      parse.error.issues.forEach((issue) => {
        const key = issue.path[0] as string | undefined;
        if (key) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await registerApi({
        username: payload.username,
        email: payload.email,
        password: payload.password,
        role: payload.role as any,
      });

      if (res.success) {
        Alert.alert("Success", "Account created successfully.");
        router.back();
      } else {
        const msg = res.message || "Registration failed";
        if (/username/i.test(msg) && /exist/i.test(msg)) {
          setErrors({ username: msg });
        } else {
          Alert.alert("Registration Error", msg);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const data: any = err.response.data;
        const message = data?.message || "Registration failed";

        if (data?.errors) {
          const fieldErrors: Partial<Record<string, string>> = {};
          if (Array.isArray(data.errors)) {
            data.errors.forEach((errObj: Record<string, string>) => {
              Object.entries(errObj).forEach(([field, msg]) => {
                fieldErrors[field] = msg;
              });
            });
          }

          setErrors(fieldErrors);
        } else if (
          err.response.status === 409 ||
          (/username/i.test(message) && /exist/i.test(message))
        ) {
          setErrors({ username: message });
        } else {
          Alert.alert("Registration Error", message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingViewWrapper style={styles.container}>
      {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color={theme.Label} />
      </TouchableOpacity> */}
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
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Join us and start your journey</Text>

            <SegmentedControl
              tabs={["USER", "ADMIN"]}
              currentIndex={roleIndex}
              onChange={setRoleIndex}
              containerStyle={styles.segmentControl}
            />
            <View style={styles.inputGroup}>
              <Input
                label="Username"
                placeholder="Enter your username"
                value={formData.username}
                onChangeText={(value) =>
                  handleFormDataChange("username", value)
                }
                autoCapitalize="none"
                icon={<User size={20} color={theme.SecondaryLabel} />}
                textContentType="username"
                error={errors.username}
              />

              <Input
                label="Email Address"
                placeholder="example@mail.com"
                value={formData.email}
                onChangeText={(value) => handleFormDataChange("email", value)}
                autoCapitalize="none"
                keyboardType="email-address"
                icon={<Mail size={20} color={theme.SecondaryLabel} />}
                textContentType="emailAddress"
                error={errors.email}
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) =>
                  handleFormDataChange("password", value)
                }
                secureTextEntry
                icon={<Lock size={20} color={theme.SecondaryLabel} />}
                textContentType="newPassword"
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleFormDataChange("confirmPassword", value)
                }
                secureTextEntry
                icon={<Lock size={20} color={theme.SecondaryLabel} />}
                error={errors.confirmPassword}
                textContentType="password"
                onSubmitEditing={handleSignup}
              />

              <Button
                title="Sign Up"
                onPress={handleSignup}
                loading={loading}
                containerStyle={styles.signupButton}
                variant="gradient"
              />
            </View>

            <View style={styles.footer}>
              <Typography variant="body" color={theme.SecondaryLabel}>
                Already have an account?{" "}
              </Typography>
              <TouchableOpacity onPress={() => router.back()}>
                <Typography
                  variant="body"
                  color={theme.Blue}
                  style={{ fontWeight: "700" }}
                >
                  Sign In
                </Typography>
              </TouchableOpacity>
            </View>
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
    segmentControl: {
      alignSelf: "center",
      marginVertical: SPACING.sm,
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
    },
    inputGroup: {
      gap: 14,
    },
    signupButton: {
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
