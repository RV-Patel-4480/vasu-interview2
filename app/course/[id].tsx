import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import HorizontalSlider from "@/components/HorizontalSlider";
import { useAppTheme } from "@/hooks/useTheme";
import { useCoursesStore } from "@/stores/course.store";
import { FONTS } from "@/theme/fonts";
import { BORDER_RADIUS, SPACING, TEXT_SIZE, TITLE_SIZE } from "@/theme/tokens";
import { Bookmark, BookmarkCheck, Check } from "lucide-react-native";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const styles = useStyles();
  const { courses, toggleBookmark, bookmarks } = useCoursesStore();
  const { theme } = useAppTheme();

  const course = useMemo(
    () => courses.find((c) => String(c.id) === id),
    [courses, id],
  );
  const isBookmarked = useMemo(
    () => bookmarks.find((bi) => bi?.id === Number(id)),
    [bookmarks, id],
  );

  const [enrolled, setEnrolled] = useState(false);

  if (!course) return null;

  const handleEnroll = async () => {
    setEnrolled(true);

    router.push(`/webview/${course.id}`);
  };

  const handleBookmark = async () => {
    toggleBookmark(course);
  };

  return (
    <ScrollView style={styles.container} nestedScrollEnabled>
      <HorizontalSlider images={course?.images || []} height={260} />

      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.category}>{course.category}</Text>
        <Text style={styles.price}>₹ {course.price}</Text>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleEnroll}
            disabled={enrolled}
            style={[
              styles.enrollBtn,
              enrolled && {
                backgroundColor: theme.Black,
                opacity: 0.85,
              },
            ]}
          >
            <Text style={styles.enrollText}>
              {enrolled ? "Enrolled" : "Enroll"}
            </Text>
            {enrolled && <Check size={16} color={theme.white} />}
          </Pressable>

          <Pressable onPress={handleBookmark} style={styles.bookmarkBtn}>
            {isBookmarked ? (
              <BookmarkCheck size={30} color={theme.Blue} />
            ) : (
              <Bookmark size={30} color={theme.SecondaryLabel} />
            )}
          </Pressable>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Info</Text>

          <Text style={styles.infoDescription}>
            {`all products have image url like: ${course.thumbnail}\n`}This type
            of url is not working inside app to show image
          </Text>
        </View>
        <Text style={styles.sectionTitle}>About this course</Text>
        <Text style={styles.description}>
          {course.description}
          {`\n            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam tenetur ipsum quos expedita illo minima, ullam eos quas, nemo quod officiis! Porro voluptate, facere asperiores quaerat ipsam magnam beatae provident ducimus officiis iusto nobis sit omnis blanditiis repellat laudantium cumque totam illo quam praesentium aspernatur. Amet dolorum eius quasi non!

          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum sit sequi delectus magni impedit facilis velit perferendis atque, harum, beatae, in voluptatum tenetur recusandae odit.

          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit inventore architecto tempore aperiam praesentium maiores libero enim earum ab ea? Delectus dignissimos est, optio sed assumenda voluptatem dicta expedita commodi sit atque magni sint culpa rerum sunt consequatur repellendus numquam perferendis? Quidem obcaecati, in voluptatem dolorum eligendi amet cum temporibus?`}
        </Text>
      </View>
    </ScrollView>
  );
}

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: { flex: 1 },
    image: {
      width: "100%",
      height: 260,
      backgroundColor: theme.SecondarySystemBackground,
    },
    content: { padding: SPACING.md },
    title: {
      fontSize: TEXT_SIZE.xxl,
      fontFamily: FONTS.BOLD,
      color: theme.Label,
    },
    category: { marginTop: SPACING.xxs, color: theme.SecondaryLabel },
    price: {
      marginTop: SPACING.xxs,
      fontSize: TEXT_SIZE.lg,
      fontFamily: FONTS.SEMIBOLD,
      color: theme.Blue,
    },

    actionsRow: {
      flexDirection: "row",
      marginTop: SPACING.md,
      alignItems: "center",
    },
    enrollBtn: {
      flex: 1,
      backgroundColor: theme.Blue,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.sm,
    },
    enrollText: {
      color: theme.white,
      fontFamily: FONTS.SEMIBOLD,
      fontSize: TEXT_SIZE.lg,
    },
    bookmarkBtn: {
      marginLeft: SPACING.sm,
      padding: SPACING.sm,
    },

    sectionTitle: {
      marginTop: SPACING.lg,
      fontSize: TEXT_SIZE.lg,
      fontFamily: FONTS.SEMIBOLD,
      color: theme.Label,
    },
    description: {
      marginTop: SPACING.xs,
      color: theme.SecondaryLabel,
      lineHeight: 20,
    },

    // info container
    infoContainer: {
      backgroundColor: theme.Blue + "20",
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.lg,
      marginTop: SPACING.md,
      gap: SPACING.xs,
    },

    infoTitle: {
      fontSize: TITLE_SIZE.h4,
      fontFamily: FONTS.BOLD,
      color: theme.Blue,
    },

    infoDescription: {
      fontSize: TEXT_SIZE.lg,
      fontFamily: FONTS.REGULAR,
      lineHeight: 20,
      color: theme.SecondaryLabel,
    },
  });
};
