import { Platform } from "react-native";

export const FONTS = {
  REGULAR: Platform.select({
    ios: "Inter_400Regular",
    android: "Inter_400Regular",
    macos: "",
    native: '',
    web: "",
    windows: ''
  }),

  MEDIUM: Platform.select({
    ios: "Inter_500Medium",
    android: "Inter_500Medium",
    macos: "",
    native: '',
    web: "",
    windows: ''
  }),

  SEMIBOLD: Platform.select({
    ios: "Inter_600SemiBold",
    android: "Inter_600SemiBold",
    macos: "",
    native: '',
    web: "",
    windows: ''
  }),

  BOLD: Platform.select({
    ios: "Inter_700Bold",
    android: "Inter_700Bold",
    macos: "",
    native: '',
    web: "",
    windows: ''
  }),

  BLACK: Platform.select({
    ios: "Inter_900Black",
    android: "Inter_900Black",
    macos: "",
    native: '',
    web: "",
    windows: ''
  }),
};
