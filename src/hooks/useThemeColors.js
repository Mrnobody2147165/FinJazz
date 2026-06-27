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
      danger: theme.danger,
      // Chart colors - full palette
      chart: theme.chart,
      // Gradients
      gradientPrimary: theme.gradientPrimary,
      gradientSecondary: theme.gradientSecondary,
      // Semantic colors with proper contrast
      positive: theme.success,
      negative: theme.danger,
      error: theme.danger,
      // UI colors
      background: theme.background,
      surface: theme.surface,
      card: theme.card,
      foreground: theme.foreground,
      muted: theme.muted,
      mutedForeground: theme.mutedForeground,
      border: theme.border,
      // Sidebar
      sidebarBg: theme.sidebarBg,
      sidebarHover: theme.sidebarHover,
      sidebarActive: theme.sidebarActive,
      sidebarIcon: theme.sidebarIcon,
      // KPI
      kpiIncomeBg: theme.kpiIncomeBg,
      kpiIncomeBorder: theme.kpiIncomeBorder,
      kpiExpenseBg: theme.kpiExpenseBg,
      kpiExpenseBorder: theme.kpiExpenseBorder,
      kpiBalanceBg: theme.kpiBalanceBg,
      kpiBalanceBorder: theme.kpiBalanceBorder,
      // Shadows
      shadowPrimary: theme.shadowPrimary,
      shadowSecondary: theme.shadowSecondary,
    };
  }, [palette, darkMode]);
};

export default useThemeColors;
