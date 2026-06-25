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
      // Core palette
      '--background': theme.background,
      '--surface': theme.surface,
      '--card': theme.card,
      '--card-hover': theme.cardHover,
      '--foreground': theme.foreground,
      '--muted': theme.muted,
      '--muted-foreground': theme.mutedForeground,
      '--border': theme.border,
      '--border-hover': theme.borderHover,

      // Primary
      '--primary': theme.primary,
      '--primary-hover': theme.primaryHover,
      '--primary-foreground': theme.primaryForeground,
      '--primary-muted': theme.primaryMuted,
      '--primary-accent': theme.primaryAccent,

      // Secondary
      '--secondary': theme.secondary,
      '--secondary-hover': theme.secondaryHover,
      '--secondary-foreground': theme.secondaryForeground,
      '--secondary-muted': theme.secondaryMuted,
      '--secondary-accent': theme.secondaryAccent,

      // Gradients
      '--gradient-primary': theme.gradientPrimary,
      '--gradient-secondary': theme.gradientSecondary,
      '--gradient-card': theme.gradientCard,
      '--gradient-sidebar': theme.gradientSidebar,
      '--gradient-hero': theme.gradientHero,

      // Shadows
      '--shadow': theme.shadow,
      '--shadow-md': theme.shadowMd,
      '--shadow-lg': theme.shadowLg,
      '--shadow-primary': theme.shadowPrimary,
      '--shadow-secondary': theme.shadowSecondary,

      // Semantic colors
      '--success': theme.success,
      '--success-foreground': theme.successForeground,
      '--success-muted': theme.successMuted,
      '--warning': theme.warning,
      '--warning-foreground': theme.warningForeground,
      '--warning-muted': theme.warningMuted,
      '--danger': theme.danger,
      '--danger-foreground': theme.dangerForeground,
      '--danger-muted': theme.dangerMuted,

      // UI specifics
      '--input': theme.input,
      '--input-border': theme.inputBorder,
      '--input-focus': theme.inputFocus,
      '--ring': theme.ring,
      '--ring-offset': theme.ringOffset,

      // Sidebar
      '--sidebar-bg': theme.sidebarBg,
      '--sidebar-hover': theme.sidebarHover,
      '--sidebar-active': theme.sidebarActive,
      '--sidebar-text': theme.sidebarText,
      '--sidebar-icon': theme.sidebarIcon,

      // KPI cards
      '--kpi-income-bg': theme.kpiIncomeBg,
      '--kpi-income-border': theme.kpiIncomeBorder,
      '--kpi-expense-bg': theme.kpiExpenseBg,
      '--kpi-expense-border': theme.kpiExpenseBorder,
      '--kpi-balance-bg': theme.kpiBalanceBg,
      '--kpi-balance-border': theme.kpiBalanceBorder,

      // Border styling
      '--radius': theme.borderRadius,
      '--radius-sm': theme.borderRadiusSm,
      '--radius-lg': theme.borderRadiusLg,

      // Typography
      '--font-display': theme.fontDisplay,
      '--font-body': theme.fontBody,

      // Transitions
      '--transition': theme.transition,

      // Chart palette as individual variables
      '--chart-1': theme.chart[0],
      '--chart-2': theme.chart[1],
      '--chart-3': theme.chart[2],
      '--chart-4': theme.chart[3],
      '--chart-5': theme.chart[4],
      '--chart-6': theme.chart[5],
      '--chart-7': theme.chart[6],
      '--chart-8': theme.chart[7],
    };

    // Apply all variables
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Store chart palette as a CSS custom property array (encoded)
    root.style.setProperty('--chart-palette', JSON.stringify(theme.chart));

    // Toggle dark class on root element
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply theme class for theme-specific styling
    root.setAttribute('data-theme', palette);

    console.log('[ThemeProvider] Applied theme:', { palette, darkMode, chart: theme.chart.slice(0, 4) });
  }, [palette, darkMode]);

  return children;
};

export default ThemeProvider;
