import { useEffect } from 'react';
import useThemeStore from '@/stores/themeStore';

const paletteColors = {
  'emerald-violet': {
    primary: '#1A472A',
    primaryLight: '#4caf50',
    secondary: '#7B2FBE',
    secondaryLight: '#ab47bc',
  },
  'noir-gold': {
    primary: '#F5F0E8',
    primaryLight: '#faf8f5',
    secondary: '#F5C518',
    secondaryLight: '#ffda3d',
  },
  'midnight-tangerine': {
    primary: '#0D1B2A',
    primaryLight: '#1b3a5a',
    secondary: '#FF6B35',
    secondaryLight: '#ff8c5a',
  },
  'cosmic-grape': {
    primary: '#2D1B69',
    primaryLight: '#4a2b9a',
    secondary: '#39FF14',
    secondaryLight: '#5dff47',
  },
};

const getContrastColor = (hexColor) => {
  if (!hexColor) return '#ffffff';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

const ThemeProvider = ({ children }) => {
  const palette = useThemeStore((state) => state.palette);
  const darkMode = useThemeStore((state) => state.darkMode);

  useEffect(() => {
    const colors = paletteColors[palette] || paletteColors['emerald-violet'];
    const root = document.documentElement;

    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-500', colors.primaryLight);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--secondary-500', colors.secondaryLight);

    const primaryContrast = getContrastColor(colors.primary);
    root.style.setProperty('--primary-foreground', primaryContrast);
    const secondaryContrast = getContrastColor(colors.secondary);
    root.style.setProperty('--secondary-foreground', secondaryContrast);

    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    console.log('[ThemeProvider] Applied theme:', { palette, darkMode, colors });
  }, [palette, darkMode]);

  return children;
};

export default ThemeProvider;
