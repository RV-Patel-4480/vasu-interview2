import { useAppTheme } from "@/hooks/useTheme";
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from "@/theme/tokens";
import React, { useEffect } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

const shadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.15,
  shadowRadius: 3.84,
  elevation: 2,
};

// Default width if not provided
const SCREEN_WIDTH = Dimensions.get("window").width;

interface Props {
  tabs: string[];
  currentIndex: number;
  onChange: (index: number) => void;
  activeSegmentBackgroundColor?: string;
  segmentedControlBackgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
  paddingVertical?: number;
  width?: number;
  containerStyle?: ViewStyle;
}

const SegmentedControl: React.FC<Props> = ({
  tabs,
  currentIndex,
  onChange,
  activeSegmentBackgroundColor,
  segmentedControlBackgroundColor,
  textColor,
  activeTextColor,
  paddingVertical = SPACING.xxs,
  width = SCREEN_WIDTH - 26,
  containerStyle,
}) => {
  const { theme } = useAppTheme();
  const styles = useStyles();

  const translateValue = (width - 4) / tabs.length;
  const [tabTranslate] = React.useState(new Animated.Value(0));

  const memoizedTabPressCallback = React.useCallback(
    (index: number) => {
      onChange(index);
    },
    [onChange],
  );

  useEffect(() => {
    Animated.spring(tabTranslate, {
      toValue: currentIndex * translateValue,
      stiffness: 150,
      damping: 20,
      mass: 1,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, translateValue]);

  const textStyle = textColor ? { color: textColor } : styles.defaultText;
  const activeTextStyle = activeTextColor
    ? { color: activeTextColor }
    : styles.activeText;

  return (
    <Animated.View
      style={[
        styles.segmentedControlWrapper,
        {
          width: width,
          backgroundColor:
            segmentedControlBackgroundColor ||
            theme.TertiarySystemGroupedBackground,
          paddingVertical: paddingVertical,
        },
        containerStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            ...styles.movingSegment,
            width: (width - 8) / tabs.length,
            backgroundColor: activeSegmentBackgroundColor || theme.Blue,
          },
          {
            transform: [
              {
                translateX: tabTranslate,
              },
            ],
          },
        ]}
      />

      {tabs.map((tab, index) => {
        const isCurrentIndex = currentIndex === index;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.textWrapper]}
            onPress={() => memoizedTabPressCallback(index)}
            activeOpacity={0.7}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.textStyles,
                isCurrentIndex ? activeTextStyle : textStyle,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    segmentedControlWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: theme.SecondarySystemGroupedBackground,
    },
    movingSegment: {
      ...StyleSheet.absoluteFillObject,
      position: "absolute",
      top: 0,
      marginVertical: 4,
      marginHorizontal: 4,
      borderRadius: BORDER_RADIUS.sm, // Slightly smaller radius for inner item
      ...shadow,
    },
    textWrapper: {
      flex: 1,
      elevation: 9,
      paddingHorizontal: 5,
      paddingVertical: SPACING.xs,
    },
    textStyles: {
      fontSize: TEXT_SIZE.sm,
      textAlign: "center",
      fontWeight: "600",
    },
    defaultText: {
      color: theme.SecondaryLabel,
    },
    activeText: {
      color: theme.white,
    },
  });
};

export default SegmentedControl;
