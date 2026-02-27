import InstructorList from "@/components/InstructorList";
import Typography from "@/components/Typography";
import { useAppTheme } from "@/hooks/useTheme";
import { useInstructorStore } from "@/stores/instructor.store";
import { SPACING } from "@/theme/tokens";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const styles = useStyles();

  const { search = "" } = useLocalSearchParams<{ search: string }>();

  const fetchInstructors = useInstructorStore((s) => s.fetchInstructors);
  const instructors = useInstructorStore((s) => s.instructors);
  const loading = useInstructorStore((s) => s.loading);

  const filteredInstructors = useMemo(() => {
    return instructors.filter(
      (instructor) =>
        instructor.name.first.toLowerCase().includes(search?.toLowerCase()) ||
        instructor.name.last.toLowerCase().includes(search?.toLowerCase()),
    );
  }, [search, instructors]);

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <View style={styles.container}>
      {loading && instructors.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Typography variant="h2">Loading Instructors...</Typography>
        </View>
      ) : (
        <InstructorList data={filteredInstructors} />
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

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
