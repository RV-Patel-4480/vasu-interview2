import { useAppTheme } from "@/hooks/useTheme";
import { FONTS } from "@/theme/fonts";
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from "@/theme/tokens";
import { Course } from "@/types/courses.type";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  course: Course;
  onPress?: (course: Course) => void;
};

const blurhash = "|rF?hV%2WCj[ayj[a|j[ayj[fQj[fQfQfQfQfQfQfQfQfQfQfQfQ";

const CourseCard: React.FC<Props> = ({ course, onPress }) => {
  const styles = useStyles();
  const { mode } = useAppTheme();
  return (
    <Pressable
      onPress={() => onPress?.(course)}
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
        style={styles.container}
      >
        <Image
          source={{ uri: course?.thumbnail }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          placeholder={blurhash}
          cachePolicy="disk"
        />

        <View style={styles.content}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.title}>
            {course?.title}
          </Text>

          <Text numberOfLines={2} style={styles.description}>
            {course?.description}
          </Text>

          <Text style={styles.price}>₹{course?.price}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      padding: SPACING.md,
      height: 120,
      backgroundColor: theme.SecondarySystemBackground,
      borderRadius: BORDER_RADIUS.lg,
      elevation: 2,
      shadowColor: theme.Black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      gap: SPACING.sm,
    },
    pressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },
    image: {
      width: 90,
      height: 90,
      borderWidth: 1,
      borderRadius: BORDER_RADIUS.lg,
      backgroundColor: theme.SecondarySystemBackground,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      gap: SPACING.xxs,
    },
    title: {
      fontSize: TEXT_SIZE.md,
      fontFamily: FONTS.MEDIUM,
      color: theme.Label,
    },
    description: {
      fontSize: TEXT_SIZE.xs,
      fontFamily: FONTS.REGULAR,
      color: theme.SecondaryLabel,
    },

    price: {
      fontSize: TEXT_SIZE.lg,
      color: theme.Label,
      fontFamily: FONTS.SEMIBOLD,
    },
  });
};

export default memo(CourseCard);
