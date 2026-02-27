import React, { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
} from "react-native-keyboard-controller";

type KeyboardAvoidingViewWrapperProps = KeyboardAvoidingViewProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const KeyboardAvoidingViewWrapper: React.FC<
  KeyboardAvoidingViewWrapperProps
> = ({ style, children, behavior = "padding", ...restProps }) => {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={behavior}
      {...restProps}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingViewWrapper;
