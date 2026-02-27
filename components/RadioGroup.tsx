import { useAppTheme } from "@/hooks/useTheme";
import { SPACING, TEXT_SIZE } from "@/theme/tokens";
import { Circle, CircleDot } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  options: string[];
  label: string;
  error?: string;
  selected: string;
  onChange: (value: string) => void;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  containerStyle?: ViewStyle;
  optionsOrientation?: {
    horizontal: boolean;
    numColumns: number;
  };
}
const RadioGroup: React.FC<Props> = ({
  options = [],
  label,
  error,
  selected,
  onChange,
  labelStyle,
  errorStyle,
  containerStyle,
  optionsOrientation = {
    horizontal: false,
    numColumns: 2,
  },
}) => {
  const styles = useStyles();
  const { theme } = useAppTheme();
  return (
    <View
      style={[styles.container, error && styles.inputError, containerStyle]}
    >
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

      <FlatList
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={false}
        numColumns={optionsOrientation.numColumns}
        horizontal={optionsOrientation.horizontal}
        keyExtractor={(item, index) => `RadioOption-${index}`}
        data={options}
        renderItem={({ item }) => {
          const isSelected = selected === item;
          return (
            <Pressable style={styles.optionItem} onPress={() => onChange(item)}>
              {isSelected ? (
                <CircleDot size={TEXT_SIZE.sm} color={theme.Label} />
              ) : (
                <Circle size={TEXT_SIZE.sm} color={theme.Gray} />
              )}

              <Text style={styles.optionLabel}>{item}</Text>
            </Pressable>
          );
        }}
      />

      {error ? <Text style={[styles.error, errorStyle]}>{error}</Text> : null}
    </View>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      gap: 2,
    },
    label: {
      fontSize: TEXT_SIZE.xs,
      color: theme.Label,
      fontWeight: "500",
    },
    contentContainer: {
      gap: SPACING.xs,
    },
    columnWrapper: {
      gap: SPACING.xs,
    },
    optionItem: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.xs,
    },
    optionLabel: {
      fontSize: TEXT_SIZE.xs,
      fontWeight: "600",
      color: theme.Label,
    },

    inputError: {
      borderColor: theme.Red,
      borderWidth: 1,
      borderRadius: SPACING.xs,
      shadowColor: theme.Red,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
    },
    error: {
      fontSize: TEXT_SIZE.xxs,
      color: theme.Red,
      fontWeight: "500",
    },
  });
};

export default RadioGroup;
