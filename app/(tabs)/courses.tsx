import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import CourseList from "@/components/CourseList";
import Typography from "@/components/Typography";
import { useAppTheme } from "@/hooks/useTheme";
import { useCoursesStore } from "@/stores/course.store";
import { BORDER_RADIUS, SPACING } from "@/theme/tokens";
import { router, useLocalSearchParams } from "expo-router";

export default function CoursesScreen() {
  const styles = useStyles();

  const { search = "" } = useLocalSearchParams<{ search: string }>();

  const init = useCoursesStore((s) => s.init);
  const fetchCourses = useCoursesStore((s) => s.fetchCourses);
  const courses = useCoursesStore((s) => s.courses);
  const loading = useCoursesStore((s) => s.loading);

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course?.title?.toLowerCase().includes(search?.toLowerCase()) ||
          course?.description?.toLowerCase().includes(search?.toLowerCase()),
      ),
    [search, courses],
  );
  useEffect(() => {
    fetchCourses();
    init();
  }, []);

  return (
    <View style={styles.container}>
      {loading && courses.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Typography variant="h2">Loading Courses...</Typography>
        </View>
      ) : (
        <CourseList
          data={filteredCourses}
          onPress={(course) => router.push(`/course/${course.id}`)}
        />
      )}
    </View>
  );
}

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      backgroundColor: theme.SystemBackground,
      flex: 1,
    },

    headerContainer: {
      padding: SPACING.lg,
      gap: SPACING.lg,
    },
    inputContainer: {
      backgroundColor: theme.SecondarySystemBackground,
      borderColor: "transparent",
      height: 44,
    },

    emptyCard: {
      padding: SPACING.xl,
      borderRadius: BORDER_RADIUS.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      marginBottom: SPACING.xs,
      textAlign: "center",
    },
    emptyText: {
      textAlign: "center",
    },
    branding: {
      alignItems: "center",
      paddingVertical: SPACING.xl,
      opacity: 0.6,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
