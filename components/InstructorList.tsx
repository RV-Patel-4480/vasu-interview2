import { useInstructorStore } from "@/stores/instructor.store";
import { SPACING } from "@/theme/tokens";
import { Instructor } from "@/types/instructors.type";
import { LegendList } from "@legendapp/list";
import React, { memo, useCallback, useMemo } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { InstructorCard } from "./InstructorCard";

type Props = {
  data: Instructor[];
};

const ITEM_HEIGHT = 100;
const InstructorList: React.FC<Props> = ({ data }) => {
  const fetchInstructors = useInstructorStore((s) => s.fetchInstructors);
  const onRefresh = useInstructorStore((s) => s.refreshInstructors);
  const refreshing = useInstructorStore((s) => s.refreshing);

  const keyExtractor = useCallback(
    (item: Instructor, index: number) => `Instructor-${index}`,
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: Instructor }) => <InstructorCard instructor={item} />,
    [],
  );

  const handleEndReached = useCallback(() => {
    fetchInstructors();
  }, [fetchInstructors]);

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

export default memo(InstructorList);
