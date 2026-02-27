import { useAppTheme } from "@/hooks/useTheme";
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from "@/theme/tokens";
import { LegendList } from "@legendapp/list";
import { ChevronDown, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface DropDownItem {
  [key: string]: any;
}

interface Props {
  data: DropDownItem[];
  valueKey?: string;
  labelKey?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  value?: DropDownItem | null;
  onChange: (value: DropDownItem) => void;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}

const DropDown: React.FC<Props> = ({
  data = [],
  valueKey = "value",
  labelKey = "label",
  label,
  error,
  placeholder = "Select",
  value,
  disabled = false,
  onChange = () => {},
  containerStyle,
  labelStyle,
  errorStyle,
}) => {
  const { theme } = useAppTheme();
  const styles = useStyles();
  const [show, setShow] = useState(false);

  function handleOnChange(selectedValue: any) {
    setShow(false);
    onChange(selectedValue);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <Pressable
        disabled={disabled}
        onPress={() => setShow(true)}
        style={[
          styles.valueContainer,
          error && styles.inputError,
          disabled && { opacity: 0.6 },
        ]}
      >
        <Text
          style={[styles.value, !value && { color: theme.PlaceholderLabel }]}
          numberOfLines={1}
        >
          {value ? value[labelKey] : placeholder}
        </Text>
        <ChevronDown size={18} color={theme.Label} />
      </Pressable>
      {error ? <Text style={[styles.error, errorStyle]}>{error}</Text> : null}

      <Modal
        visible={show}
        transparent
        animationType="slide"
        onRequestClose={() => setShow(false)}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setShow(false)} />
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Select {label || "Option"}</Text>
              <TouchableOpacity
                onPress={() => setShow(false)}
                style={styles.closeButton}
              >
                <X size={20} color={theme.SecondaryLabel} />
              </TouchableOpacity>
            </View>
            <LegendList
              data={data}
              keyExtractor={(item, index) => `${item[valueKey]}-${index}`}
              renderItem={({ item }) => {
                const isSelected = value?.[valueKey] === item[valueKey];
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.selectedOption]}
                    onPress={() => handleOnChange(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {item[labelKey]}
                    </Text>
                    {isSelected && <ChevronDown size={16} color={theme.Blue} />}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.noData}>No options available</Text>
              }
              contentContainerStyle={{ paddingBottom: SPACING.xl }}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              recycleItems
            />
          </View>
        </View>
      </Modal>
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
    valueContainer: {
      height: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderRadius: BORDER_RADIUS.sm,
      paddingHorizontal: 12,
      borderColor: theme.Gray2,
      shadowColor: theme.Black,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
    },
    value: {
      flex: 1,
      color: theme.Label,
      fontSize: TEXT_SIZE.xs,
      fontWeight: "600",
    },
    inputError: {
      borderColor: theme.Red,
      shadowColor: theme.Red,
    },
    error: {
      fontSize: TEXT_SIZE.xxs,
      color: theme.Red,
      fontWeight: "500",
    },

    // Modal Styles
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContent: {
      backgroundColor: theme.SecondarySystemGroupedBackground,
      borderTopLeftRadius: BORDER_RADIUS.lg,
      borderTopRightRadius: BORDER_RADIUS.lg,
      maxHeight: "70%",
      minHeight: "30%",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: SPACING.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.Separator,
    },
    headerTitle: {
      fontSize: TEXT_SIZE.md,
      fontWeight: "600",
      color: theme.Label,
    },
    closeButton: {
      padding: 4,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
    },
    selectedOption: {
      backgroundColor: theme.SystemBackground,
    },
    optionText: {
      fontSize: TEXT_SIZE.sm,
      color: theme.Label,
      fontWeight: "400",
    },
    selectedOptionText: {
      color: theme.Blue,
      fontWeight: "600",
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.Separator,
      marginLeft: SPACING.md,
    },
    noData: {
      textAlign: "center",
      paddingVertical: SPACING.lg,
      fontSize: TEXT_SIZE.sm,
      color: theme.SecondaryLabel,
    },
  });
};

export default DropDown;
