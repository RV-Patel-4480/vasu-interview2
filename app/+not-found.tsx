import { useAppTheme } from "@/hooks/useTheme";
import { Link, Stack } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  const { theme } = useAppTheme();
  return (
    <>
      <Stack.Screen options={{ title: "404" }} />
      <View style={styles.container}>
        <AlertCircle size={64} color={theme.Red} />
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>This screen doesn&apos;t exist.</Text>

        <Link href="/" style={styles.link} asChild>
          <Text style={styles.linkText}>Go to Dashboard</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#1E293B",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
  },
  link: {
    marginTop: 24,
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
