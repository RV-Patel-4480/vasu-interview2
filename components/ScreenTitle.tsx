import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useTheme';
import { SPACING, TEXT_SIZE, TITLE_SIZE } from '@/theme/tokens';
import { useNavigation } from '@react-navigation/native';

interface Props {
  title: string
}
const ScreenTitle: React.FC<Props> = ({ title }) => {
  const styles = useStyles();
  const { theme } = useAppTheme();
  const navigation = useNavigation()
  return (
    <View style={styles.titleContainer}>
      <Pressable onPress={() => navigation.goBack()}>
        <ChevronLeft size={TEXT_SIZE.xxl} color={theme.Label} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.Gray2,
      gap: SPACING.sm,
    },

    title: {
      fontSize: TITLE_SIZE.h6,
      color: theme.Label,
      // fontFamily: FONTS.interSemiBold,
      fontWeight: '600',
    },
  });
};

export default ScreenTitle;
