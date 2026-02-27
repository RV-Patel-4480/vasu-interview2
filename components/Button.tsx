// import { useAppTheme } from '@/hooks/useTheme';
// import { BORDER_RADIUS, SPACING, TEXT_SIZE } from '@/theme/tokens';
// import React, { ReactNode } from 'react';
// import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

// interface Props {
//   variant?: 'fill' | 'border' | 'flat' | 'destructive',
//   icon?: ReactNode,
//   title: string,
//   textStyle?: TextStyle,
//   containerStyle?: ViewStyle,
//   onPress?: () => void,
//   disable?: boolean,
//   loading?: boolean,
// }

// const Button: React.FC<Props> = ({
//   variant = 'fill',
//   icon,
//   title,
//   textStyle,
//   containerStyle,
//   onPress = () => { },
//   disable = false,
//   loading = false,
// }) => {
//   const styles = useStyles();
//   const { theme } = useAppTheme();

//   return (
//     <Pressable
//       onPress={onPress}
//       disabled={disable || loading}
//       style={({ pressed }) => [
//         styles.container,
//         styles[variant],
//         (disable || loading) && { opacity: 0.5 },
//         pressed && { opacity: 0.8 },
//         containerStyle,
//       ]}
//     >
//       {icon}
//       {loading ? (
//         <ActivityIndicator color={variant === 'fill' ? theme.white : theme.Blue} />
//       ) : (
//         <Text
//           style={[
//             styles.label,
//             variant === 'fill' ? { color: theme.white } : { color: theme.Blue },
//             variant === 'destructive' && { color: theme.Red },
//             textStyle
//           ]}
//         >
//           {title}
//         </Text>
//       )}
//     </Pressable>
//   );
// };

// export default Button;

// const useStyles = () => {
//   const { theme } = useAppTheme();
//   return StyleSheet.create({
//     container: {
//       padding: SPACING.sm + 2, // Slightly larger touch target
//       gap: SPACING.xs,
//       flexDirection: 'row',
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderRadius: BORDER_RADIUS.md, // iOS standard corner radius
//     },

//     fill: {
//       backgroundColor: theme.Blue,
//     },
//     border: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: theme.Blue,
//     },
//     flat: {
//       backgroundColor: 'transparent',
//     },
//     destructive: {
//       backgroundColor: 'transparent',
//       borderWidth: 1,
//       borderColor: theme.Red,
//     },
//     label: {
//       fontSize: TEXT_SIZE.md,
//       fontWeight: '600',
//     },
//   });
// };

import { useAppTheme } from "@/hooks/useTheme";
import { FONTS } from "@/theme/fonts";
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from "@/theme/tokens";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  variant?: "fill" | "border" | "flat" | "destructive" | "gradient";
  icon?: ReactNode;
  title: string;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  onPress?: () => void;
  disable?: boolean;
  loading?: boolean;
}

const Button: React.FC<Props> = ({
  variant = "fill",
  icon,
  title,
  textStyle,
  containerStyle,
  onPress = () => {},
  disable = false,
  loading = false,
}) => {
  const styles = useStyles();
  const { theme } = useAppTheme();

  const content = (
    <>
      {icon}
      {loading ? (
        <ActivityIndicator
          color={
            variant === "fill" || variant === "gradient"
              ? theme.white
              : theme.Blue
          }
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "fill" || variant === "gradient"
              ? { color: theme.white }
              : { color: theme.Blue },
            variant === "destructive" && { color: theme.Red },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disable || loading}
      style={({ pressed }) => [
        styles.container,
        variant !== "gradient" && styles[variant],
        (disable || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        containerStyle,
      ]}
    >
      {variant === "gradient" ? (
        <LinearGradient
          colors={["#7B79F2", "#5E5CE6", "#4A48C9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={styles.innerContent}>{content}</View>
      )}
    </Pressable>
  );
};

export default Button;

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      borderRadius: BORDER_RADIUS.md,
      overflow: "hidden", // required for gradient clipping
    },

    innerContent: {
      // padding: SPACING.sm + 2,
      gap: SPACING.xs,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: BORDER_RADIUS.md,
    },

    gradientContainer: {
      padding: SPACING.sm + 2,
      gap: SPACING.xs,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: BORDER_RADIUS.md,
    },

    fill: {
      backgroundColor: theme.Blue,
      padding: SPACING.sm + 2,
      alignItems: "center",
      justifyContent: "center",
    },

    border: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.Blue,
      padding: SPACING.sm + 2,
    },

    flat: {
      backgroundColor: "transparent",
      padding: SPACING.sm + 2,
    },

    destructive: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.Red,
      padding: SPACING.sm + 2,
    },

    label: {
      fontSize: TEXT_SIZE.md,
      fontFamily: FONTS.SEMIBOLD,
    },
  });
};
