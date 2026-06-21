import { useEffect } from 'react';
import useThemeStore from '@/stores/themeStore';
import { getTheme } from '@/theme/themes';

const ThemeProvider = ({ children }) => {
  const palette = useThemeStore((state) => state.palette);
  const darkMode = useThemeStore((state) => state.darkMode);

  useEffect(() => {
    const theme = getTheme(palette, darkMode);
    const root = document.documentElement;

    // Apply all theme variables to CSS custom properties
    const cssVars = {
      '--primary': theme.primary,
      '--primary-foreground': theme.primaryForeground,
      '--secondary': theme.secondary,
      '--secondary-foreground': theme.secondaryForeground,
      '--background': theme.background,
      '--foreground': theme.foreground,
      '--card': theme.card,
      '--card-foreground': theme.cardForeground,
      '--popover': theme.popover,
      '--popover-foreground': theme.popoverForeground,
      '--muted': theme.muted,
      '--muted-foreground': theme.mutedForeground,
      '--border': theme.border,
      '--input': theme.input,
      '--ring': theme.ring,
      '--success': theme.success,
      '--success-foreground': theme.successForeground,
      '--warning': theme.warning,
      '--warning-foreground': theme.warningForeground,
      '--error': theme.error,
      '--error-foreground': theme.errorForeground,
      // Color ramps
      '--primary-50': theme.primary50,
      '--primary-100': theme.primary100,
      '--primary-200': theme.primary200,
      '--primary-300': theme.primary300,
      '--primary-400': theme.primary400,
      '--primary-500': theme.primary500,
      '--primary-600': theme.primary600,
      '--primary-700': theme.primary700,
      '--primary-800': theme.primary800,
      '--primary-900': theme.primary900,
      '--secondary-50': theme.secondary50,
      '--secondary-100': theme.secondary100,
      '--secondary-200': theme.secondary200,
      '--secondary-300': theme.secondary300,
      '--secondary-400': theme.secondary400,
      '--secondary-500': theme.secondary500,
      '--secondary-600': theme.secondary600,
      '--secondary-700': theme.secondary700,
      '--secondary-800': theme.secondary800,
      '--secondary-900': theme.secondary900,
    };

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Toggle dark class on root element
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    console.log('[ThemeProvider] Applied theme:', { palette, darkMode });
  }, [palette, darkMode]);

  return children;
};

export default ThemeProvider;
