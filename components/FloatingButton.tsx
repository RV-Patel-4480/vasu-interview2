import { useAppTheme } from '@/hooks/useTheme';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { BORDER_RADIUS, SPACING } from '../theme/tokens';

interface Props {
  onPress: () => void;
  icon?: React.ReactNode;
}
const FloatingButton: React.FC<Props> = ({ onPress, icon }) => {
  const styles = useStyles();
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }]}>
      {icon || <Plus color={theme.white} />}
    </Pressable>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      alignSelf: 'center',
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: theme.Blue,
      shadowColor: theme.Blue,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  });
};

export default FloatingButton;
