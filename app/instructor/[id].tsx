import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { useAppTheme } from "@/hooks/useTheme";
import { useInstructorStore } from "@/stores/instructor.store";
import { Image } from "expo-image";
const blurhash = "|rF?hV%2WCj[ayj[a|j[ayj[fQj[fQfQfQfQfQfQfQfQfQfQfQfQ";
export default function InstructorDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [canDismiss, setCanDismiss] = useState(true);
  const instructors = useInstructorStore((s) => s.instructors);
  const styles = useStyles();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const instructor = useMemo(
    () => instructors.find((c) => String(c.id) === id),
    [instructors, id],
  );

  if (!instructor) return null;

  const gradientColors = isDark
    ? ["#2D2B5F", "#3A38A0", "#5E5CE6"]
    : ["#EEF0FF", "#DADFFF", "#BFC6FF"];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Image
          source={{ uri: instructor.picture.large }}
          style={styles.avatar}
          contentFit="cover"
          transition={300}
          cachePolicy="disk"
          placeholder={blurhash}
        />

        <Text style={styles.name}>
          {`${instructor.name.title} ${instructor.name.first} ${instructor.name.last}`}
        </Text>

        <Text style={styles.email}>{instructor.email}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <InfoRow label="Gender" value={instructor.gender} />
        <InfoRow label="Nationality" value={instructor.nat} />
        <InfoRow label="Phone" value={instructor.phone} />
        <InfoRow label="Cell" value={instructor.cell} />

        <InfoRow
          label="Location"
          value={`${instructor.location.city}, ${instructor.location.state}, ${instructor.location.country}`}
        />

        <InfoRow
          label="DOB"
          value={`${instructor.dob.date.split("T")[0]} (${instructor.dob.age} yrs)`}
        />

        <InfoRow
          label="Registered"
          value={new Date(instructor.registered.date).toDateString()}
        />
      </View>
    </ScrollView>
  );
}

/* ---------- Components ---------- */

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

/* ---------- Styles ---------- */

const useStyles = () => {
  const { theme } = useAppTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.SystemBackground,
    },

    header: {
      paddingTop: 40,
      paddingBottom: 24,
      alignItems: "center",
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },

    avatar: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 3,
      borderColor: "rgba(255,255,255,0.7)",
      marginBottom: 12,
    },

    name: {
      fontSize: 20,
      fontWeight: "700",
      color: "#fff",
    },

    email: {
      fontSize: 13,
      color: "rgba(255,255,255,0.85)",
      marginTop: 4,
    },

    content: {
      padding: 20,
      gap: 14,
    },

    row: {
      backgroundColor: theme.SecondarySystemBackground,
      padding: 14,
      borderRadius: 14,
    },

    label: {
      fontSize: 12,
      color: theme.SecondaryLabel,
    },

    value: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.Label,
      marginTop: 4,
    },

    closeBtn: {
      marginTop: 20,
      backgroundColor: theme.Blue,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
    },

    closeText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 15,
    },
  });
};
