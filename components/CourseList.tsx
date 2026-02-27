import { useCoursesStore } from "@/stores/course.store";
import { SPACING } from "@/theme/tokens";
import { Course } from "@/types/courses.type";
import { LegendList } from "@legendapp/list";
import React, { memo, useCallback, useMemo } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import CourseCard from "./CourseCard";

type Props = {
  data: Course[];
  onPress?: (course: Course) => void;
};

const ITEM_HEIGHT = 120;
const CourseList: React.FC<Props> = ({ data, onPress }) => {
  const fetchCourses = useCoursesStore((s) => s.fetchCourses);
  const onRefresh = useCoursesStore((s) => s.refreshCourses);
  const refreshing = useCoursesStore((s) => s.refreshing);

  const keyExtractor = useCallback(
    (item: Course, index: number) => `Course-${index}`,
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: Course }) => (
      <CourseCard course={item} onPress={() => onPress?.(item)} />
    ),
    [onPress],
  );

  const handleEndReached = useCallback(() => {
    fetchCourses();
  }, [fetchCourses]);

  const refreshControl = useMemo(
    () => <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />,
    [onRefresh, refreshing],
  );
  return (
    <LegendList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={styles.flatList}
      contentContainerStyle={styles.contentContainerStyle}
      refreshControl={refreshControl}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.6}
      estimatedItemSize={ITEM_HEIGHT + SPACING.sm}
      getEstimatedItemSize={() => ITEM_HEIGHT + SPACING.sm}
      getFixedItemSize={() => ITEM_HEIGHT + SPACING.sm}
      drawDistance={800}
      recycleItems={true}
      maintainVisibleContentPosition={true}
      contentInsetAdjustmentBehavior="never"
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    padding: SPACING.sm,
  },
});

export default memo(CourseList);
