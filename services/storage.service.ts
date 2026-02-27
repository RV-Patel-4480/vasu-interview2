import * as SecureStore from "expo-secure-store";
import { createMMKV } from "react-native-mmkv";

const mmkv = createMMKV({
  id: "vasu-interview",
  encryptionKey: "vasu-interview-secret-key",
});

export const StorageService = {
  // SecureStore (Sensitive)
  setToken: (token: string) => SecureStore.setItemAsync("auth_token", token),

  getToken: () => SecureStore.getItemAsync("auth_token"),

  removeToken: () => SecureStore.deleteItemAsync("auth_token"),

  setRefreshToken: (token: string) =>
    SecureStore.setItemAsync("refresh_token", token),

  getRefreshToken: () => SecureStore.getItemAsync("refresh_token"),

  // MMKV (Fast app data)
  // setUser: (user: any) =>
  //     mmkv.set('user', JSON.stringify(user)),

  // getUser: () => {
  //     const data = mmkv.getString('user')
  //     return data ? JSON.parse(data) : null
  // },

  //   setBookmarks: (data: any[]) => mmkv.set("bookmarks", JSON.stringify(data)),

  //   getBookmarks: () => {
  //     const data = mmkv.getString("bookmarks");
  //     return data ? JSON.parse(data) : [];
  //   },

  //   setCoursesCache: (data: any[]) =>
  //     mmkv.set("courses_cache", JSON.stringify(data)),

  //   getCoursesCache: () => {
  //     const data = mmkv.getString("courses_cache");
  //     return data ? JSON.parse(data) : [];
  //   },

  //   setPreference: (key: string, value: any) =>
  //     mmkv.set(`pref_${key}`, JSON.stringify(value)),

  //   getPreference: (key: string) => {
  //     const v = mmkv.getString(`pref_${key}`);
  //     return v ? JSON.parse(v) : null;
  //   },

  setString: (key: string, value: string) => mmkv.set(key, value),
  getString: (key: string) => mmkv.getString(key),

  setJSON: (key: string, value: any) => mmkv.set(key, JSON.stringify(value)),
  getJSON: (key: string) => {
    const data = mmkv.getString(key);
    return data ? JSON.parse(data) : null;
  },

  remove: (key: string) => mmkv.remove(key),

  clearAll: async () => {
    mmkv.clearAll();
    await SecureStore.deleteItemAsync("auth_token");
    await SecureStore.deleteItemAsync("refresh_token");
  },
};

export const StorageKeys = {
  LAST_APP_OPEN: "last_app_open",
  LAST_INACTIVITY_NOTIFICATION: "last_inactivity_notification",
  BOOKMARKS: "bookmarks",
  ENROLLED_COURSE: "enrolled_course",
};
