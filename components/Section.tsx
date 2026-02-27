import { useAppTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from '../theme/tokens';

interface Props {
  children: React.ReactNode;
  header?: string;
  footer?: string;
  style?: ViewStyle;
}

export const Section: React.FC<Props> = ({ children, header, footer, style }) => {
  const styles = useStyles();

  return (
    <View style={[styles.container, style]}>
      {header && <Text style={styles.header}>{header.toUpperCase()}</Text>}
      <View style={styles.contentContainer}>
        {children}
      </View>
      {footer && <Text style={styles.footer}>{footer}</Text>}
    </View>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      marginBottom: SPACING.lg,
    },
    header: {
      fontSize: TEXT_SIZE.xs,
      color: theme.SecondaryLabel,
      marginBottom: SPACING.xs,
      marginLeft: SPACING.md,
      fontWeight: '500',
    },
    contentContainer: {
      backgroundColor: theme.SecondarySystemGroupedBackground,
      borderRadius: BORDER_RADIUS.md,
      overflow: 'hidden',
    },
    footer: {
      fontSize: TEXT_SIZE.xs,
      color: theme.SecondaryLabel,
      marginTop: SPACING.xs,
      marginLeft: SPACING.md,
    }
  });
};

export default Section;
