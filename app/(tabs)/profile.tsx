import { updateAvatarApi } from "@/api/user.api";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useAppTheme } from "@/hooks/useTheme";
import {
  scheduleLocalNotification,
  sendLocalNotification,
} from "@/services/notification.service";
import { useAuthStore } from "@/stores/auth.store";
import { FONTS } from "@/theme/fonts";
import { BORDER_RADIUS, SPACING } from "@/theme/tokens";
import { pickImageFromGallery } from "@/utils/imagePicker.util";
import { Image } from "expo-image";
import {
  BellRing,
  Calendar,
  Camera,
  Clock2,
  LogOut,
  Mail,
  Shield,
  User as UserIcon,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const blurhash = "|rF?hV%2WCj[ayj[a|j[ayj[fQj[fQfQfQfQfQfQfQfQfQfQfQfQ";
export default function ProfileScreen() {
  const styles = useStyles();
  const { user, logout, setAuth, token } = useAuthStore();
  const { theme } = useAppTheme();
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() },
    ]);
  };

  const pickImage = async () => {
    const image = await pickImageFromGallery({
      aspect: [1, 1],
      quality: 0.7,
      allowsEditing: true,
    });

    console.log('image========>', image);


    if (!image) return;

    uploadAvatar(image.uri);
  };

  const uploadAvatar = async (uri: string) => {
    setUpdatingAvatar(true);
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // @ts-ignore
      formData.append("avatar", { uri, name: filename, type });
      console.log("payload", JSON.stringify(formData));

      const response = await updateAvatarApi(formData);
      console.log(response);

      if (response.success && response.data) {
        if (token) {
          await setAuth(token, response.data);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const profileItems = useMemo(
    () => [
      {
        icon: <UserIcon size={20} color={theme.Blue} />,
        label: "Username",
        value: user?.username,
        onPress: undefined,
      },
      {
        icon: <Mail size={20} color={theme.Blue} />,
        label: "Email",
        value: user?.email,
        onPress: undefined,
      },
      {
        icon: <Shield size={20} color={theme.Blue} />,
        label: "Role",
        value: user?.role,
        onPress: undefined,
      },
      {
        icon: (
          <Shield
            size={20}
            color={user?.isEmailVerified ? theme.Green : theme.Red}
          />
        ),
        label: "Verified",
        value: user?.isEmailVerified ? "Yes" : "No",
        onPress: undefined,
      },
      {
        icon: <Calendar size={20} color={theme.Blue} />,
        label: "Joined",
        value: user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "Unknown",
        onPress: undefined,
      },
      {
        icon: <BellRing size={20} color={theme.Blue} />,
        label: "Test Notification",
        value: "Press me",
        onPress: () => {
          sendLocalNotification({
            title: "Test Notification",
            body: "Did you see the notification?",
            data: { type: "TEST" },
          });
        },
      },
      {
        icon: <Clock2 size={20} color={theme.Blue} />,
        label: "Scheduled Notification",
        value: "15 seconds",
        onPress: () => {
          const triggerDate = new Date(Date.now() + 15000);
          scheduleLocalNotification(
            {
              title: "Scheduled ",
              body: "This notification was scheduled 15 seconds ago",
              data: { type: "TEST" },
            },
            {
              date: triggerDate,
              type: "date",
              repeat: false,
              channelId: "default",
            },
          );
        },
      },
    ],
    [user, theme],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.avatar?.url ? (
            <Image
              source={{
                uri: user.avatar.url.startsWith("http://")
                  ? user.avatar.url.replace("http://", "https://")
                  : user.avatar.url,
              }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
              placeholder={blurhash}
              cachePolicy="disk"
            />
          ) : (
            <Text style={styles.avatarInitials}>
              {user?.username?.slice(0, 2).toUpperCase()}
            </Text>
          )}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={pickImage}
            disabled={updatingAvatar}
          >
            {updatingAvatar ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Camera size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Typography variant="h2" style={styles.name}>
          {user?.username}
        </Typography>
        <Typography variant="body" color={theme.SecondaryLabel}>
          {user?.email}
        </Typography>
      </View>

      <View style={styles.section}>
        {profileItems.map((item, index) => (
          <Pressable
            key={`ProfileItem-${index}`}
            style={[
              styles.infoItem,
              index !== profileItems.length - 1 && {
                borderBottomWidth: 0.5,
                borderBottomColor: theme.Separator,
              },
            ]}
            onPress={() => item.onPress?.()}
          >
            <View style={styles.infoLabelContainer}>
              {item.icon}
              <Typography variant="body" style={styles.infoLabel}>
                {item.label}
              </Typography>
            </View>
            <Typography
              variant="body"
              color={theme.SecondaryLabel}
              style={styles.infoValue}
            >
              {item.value}
            </Typography>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          variant="destructive"
          title="Logout"
          onPress={handleLogout}
          icon={<LogOut size={20} color={theme.Red} />}
          containerStyle={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
}

const useStyles = () => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      backgroundColor: theme.SystemBackground,
    },
    header: {
      alignItems: "center",
      paddingBottom: SPACING.xxl,
    },
    avatarContainer: {
      position: "relative",
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: "white",
      marginBottom: SPACING.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.SecondarySystemBackground,
    },
    avatarInitials: {
      fontSize: 40,
      fontFamily: FONTS.SEMIBOLD,
      color: theme.Label,
    },
    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: 60,
    },
    cameraButton: {
      backgroundColor: theme.Blue,
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: "white",
    },
    name: {
      marginTop: SPACING.sm,
      fontWeight: "bold",
    },
    section: {
      backgroundColor: theme.SecondarySystemBackground,
      marginHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.xl,
      overflow: "hidden",
    },
    infoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: SPACING.md,
    },
    infoLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    infoLabel: {
      fontWeight: "500",
    },
    infoValue: {
      flex: 1,
      textAlign: "right",
    },
    footer: {
      padding: SPACING.xl,
      paddingBottom: SPACING.xxl,
    },
    logoutButton: {
      marginTop: SPACING.xl,
    },
    contentContainer: {
      paddingBottom: SPACING.xxl
    }
  });
};
