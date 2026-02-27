import { useAppTheme } from "@/hooks/useTheme";
import { BORDER_RADIUS, TEXT_SIZE } from "@/theme/tokens";
import React, { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  icon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}
const Input: React.FC<Props> = ({
  label,
  error,
  icon,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...rest
}) => {
  const { theme } = useAppTheme();
  const styles = useStyles();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          inputContainerStyle,
          error && styles.inputError,
        ]}
      >
        {icon}
        <TextInput
          placeholderTextColor={theme.Gray}
          style={[styles.input, inputStyle]}
          {...rest}
        />
      </View>
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
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderRadius: BORDER_RADIUS.sm,
      paddingHorizontal: 12,
      borderColor: theme.Gray2,
      gap: 5,

      shadowColor: theme.Black,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
    },
    input: {
      flex: 1,
      height: 50,

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
  });
};

export default Input;
