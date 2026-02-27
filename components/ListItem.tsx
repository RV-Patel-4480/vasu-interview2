import { useAppTheme } from '@/hooks/useTheme';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { SPACING, TEXT_SIZE } from '../theme/tokens';

interface Props {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  leftElement?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
  style?: ViewStyle;
  destructive?: boolean;
  titleStyle?: TextStyle;
}

const ListItem: React.FC<Props> = ({
  title,
  subtitle,
  leftIcon,
  leftElement,
  rightIcon,
  onPress,
  showChevron = true,
  isLast = false,
  style,
  destructive = false,
  titleStyle
}) => {
  const styles = useStyles();
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
        {
          borderBottomLeftRadius: isLast ? SPACING.md : 0,
          borderBottomRightRadius: isLast ? SPACING.md : 0,
        }
      ]}
      disabled={!onPress}
    >
      <View style={styles.content}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        {leftElement && <View style={styles.leftIcon}>{leftElement}</View>}

        <View style={styles.textContainer}>
          <Text style={[styles.title, destructive && styles.destructiveText, titleStyle]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.rightContainer}>
          {rightIcon}
          {showChevron && onPress && (
            <ChevronRight size={20} color={theme.TertiaryLabel} style={styles.chevron} />
          )}
        </View>
      </View>

      {!isLast && <View style={styles.separator} />}
    </Pressable>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.SecondarySystemGroupedBackground,
      minHeight: 44, // iOS standard row height
    },
    pressed: {
      backgroundColor: theme.SecondarySystemFill,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    leftIcon: {
      marginRight: SPACING.md,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: TEXT_SIZE.md,
      color: theme.Label,
    },
    destructiveText: {
      color: theme.Red,
    },
    subtitle: {
      fontSize: TEXT_SIZE.sm,
      color: theme.SecondaryLabel,
      marginTop: 2,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs
    },
    chevron: {
      marginLeft: SPACING.xs,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.Separator,
      marginLeft: SPACING.md, // Inset separator
    },
  });
};

export default ListItem;
