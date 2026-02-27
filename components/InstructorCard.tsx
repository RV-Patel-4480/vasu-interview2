import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "@/hooks/useTheme";
import { FONTS } from "@/theme/fonts";
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from "@/theme/tokens";
import { Instructor } from "@/types/instructors.type";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Phone } from "lucide-react-native";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  instructor: Instructor;
};

const blurhash = "|rF?hV%2WCj[ayj[a|j[ayj[fQj[fQfQfQfQfQfQfQfQfQfQfQfQ";

const InstructorCardComponent: React.FC<Props> = ({ instructor }) => {
  const { theme, mode } = useAppTheme();
  const styles = useStyles();
  const fullName = `${instructor.name.first} ${instructor.name.last}`;

  return (
    <Pressable
      onPress={() => router.push(`/instructor/${instructor.id}`)}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <LinearGradient
        colors={
          mode === "dark"
            ? ["#2D2B5F", "#3A38A0", "#5E5CE6"]
            : ["#EEF0FF", "#DADFFF", "#BFC6FF"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: instructor.picture.large }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
            placeholder={blurhash}
            cachePolicy="disk"
          />
        </View>

        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {fullName}
            </Text>
            <LinearGradient
              colors={[theme.Blue + "40", theme.white + "20"]}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>{instructor.nat}</Text>
            </LinearGradient>
          </View>

          <View style={styles.metaRow}>
            <Phone size={18} color={theme.Blue} />
            <Text style={styles.meta}>{instructor.phone}</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      padding: SPACING.sm,
      height: 100,
      borderRadius: BORDER_RADIUS.lg,
      backgroundColor: theme.SecondarySystemBackground,

      shadowColor: theme.Label,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 10,

      elevation: 4,

      gap: SPACING.sm,
    },

    pressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },

    avatarWrapper: {
      padding: 2,
      borderRadius: 40,
      backgroundColor: theme.SecondarySystemFill,
      borderWidth: 3,
      borderColor: "rgba(255,255,255,0.6)",
    },

    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
    },

    info: {
      flex: 1,
      gap: SPACING.xxs,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: SPACING.sm,
    },

    name: {
      fontSize: TEXT_SIZE.lg,
      fontFamily: FONTS.BOLD,
      color: theme.Label,
      flex: 1,
    },

    badge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },

    badgeText: {
      fontSize: TEXT_SIZE.sm,
      fontFamily: FONTS.SEMIBOLD,
      color: theme.Label,
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.xs,
    },

    meta: {
      fontSize: TEXT_SIZE.sm,
      color: theme.SecondaryLabel,
    },
  });
};

export const InstructorCard = memo(InstructorCardComponent);
