import { DarkTheme, LightTheme } from '@/theme/themes';
import { useColorScheme } from 'react-native';

export const useAppTheme = () => {
  const scheme = useColorScheme();
  const mode: 'dark' | 'light' = scheme === 'dark' ? 'dark' : 'light';
  const theme = mode === 'dark' ? DarkTheme : LightTheme;

  return { theme, mode };
};
