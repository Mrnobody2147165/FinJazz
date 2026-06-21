import { useMemo } from 'react';
import useThemeStore from '@/stores/themeStore';
import { getTheme } from '@/theme/themes';

export const useThemeColors = () => {
  const palette = useThemeStore((state) => state.palette);
  const darkMode = useThemeStore((state) => state.darkMode);

  return useMemo(() => {
    const theme = getTheme(palette, darkMode);
    return {
      primary: theme.primary,
      secondary: theme.secondary,
      success: theme.success,
      warning: theme.warning,
      error: theme.error,
      // Chart color palette based on theme
      chart: [
        theme.primary,
        theme.secondary,
        theme.success,
        theme.warning,
        theme.error,
        theme.primary400,
        theme.secondary400,
      ],
      // Semantic colors with proper contrast
      positive: theme.success,
      negative: theme.error,
    };
  }, [palette, darkMode]);
};

export default useThemeColors;
