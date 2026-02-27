import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { StorageKeys, StorageService } from "./storage.service";

export type LocalNotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, any>;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const isSameDay = (a: Date, b: Date) => {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
};

let initialized = false;

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
};

export const setupNotificationChannels = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });

    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Reminders",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  if (Platform.OS === "ios") {
    await Notifications.setNotificationCategoryAsync("default", []);
  }
};

export const initNotifications = async (): Promise<void> => {
  if (initialized) return;

  try {
    await requestNotificationPermissions();
    await setupNotificationChannels();
    initialized = true;
  } catch (e) {
    console.error("[NotificationService:init]", e);
  }
};

export const sendLocalNotification = async (
  payload: LocalNotificationPayload,
) => {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
      sound: "default",
    },
    trigger: null,
  });
};

export const scheduleLocalNotification = async (
  payload: LocalNotificationPayload,
  trigger: Notifications.NotificationTriggerInput,
) => {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
      sound: "default",
    },
    trigger: trigger,
  });
};

export const notifyBookmarkMilestone = async (count: number) => {
  if (count === 5) {
    await sendLocalNotification({
      title: "Nice work! ⭐",
      body: "You have bookmarked 5 courses. Keep learning!",
      data: { type: "BOOKMARK_MILESTONE" },
    });
  }
};
export const scheduleInactivityReminder = async () => {
  const now = new Date();

  const lastOpenStr = await StorageService.getString(StorageKeys.LAST_APP_OPEN);
  const lastNotifyStr = await StorageService.getString(
    StorageKeys.LAST_INACTIVITY_NOTIFICATION,
  );

  const lastOpen = lastOpenStr ? new Date(lastOpenStr) : null;
  const lastNotify = lastNotifyStr ? new Date(lastNotifyStr) : null;

  // ✅ If user opened app today → don't schedule
  if (lastOpen) {
    const diffFromLastOpen = now.getTime() - lastOpen.getTime();
    if (diffFromLastOpen < 24 * 60 * 60 * 1000) {
      return;
    }
  }

  // ✅ If already notified today → don't notify again
  if (lastNotify) {
    const diffFromLastNotify = now.getTime() - lastNotify.getTime();
    if (diffFromLastNotify < 24 * 60 * 60 * 1000) {
      return;
    }
  }

  // 🔔 Schedule after 24 hours of inactivity
  const triggerDate = new Date(
    (lastOpen ?? now).getTime() + 24 * 60 * 60 * 1000,
  );

  await scheduleLocalNotification(
    {
      title: "We miss you 👋",
      body: "Continue your learning journey today!",
      data: { type: "INACTIVITY_REMINDER" },
    },
    {
      date: triggerDate,
      type: "date",
      repeat: false,
      channelId: "default",
    },
  );

  // save last notification time
  await StorageService.setString(
    StorageKeys.LAST_INACTIVITY_NOTIFICATION,
    now.toISOString(),
  );
};
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const onNotificationReceive = (
  cb: (n: Notifications.Notification) => void,
) => {
  return Notifications.addNotificationReceivedListener(cb);
};

export const onNotificationResponse = (
  cb: (r: Notifications.NotificationResponse) => void,
) => {
  return Notifications.addNotificationResponseReceivedListener(cb);
};
