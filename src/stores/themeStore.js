import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const themePalettes = {
  'emerald-violet': {
    name: 'Emerald & Violet',
    description: 'Professional and Bold',
    primary: '#1A472A',
    secondary: '#7B2FBE',
    primaryLight: '#4caf50',
    secondaryLight: '#ab47bc',
  },
  'noir-gold': {
    name: 'Noir & Gold',
    description: 'Warm and Grounded',
    primary: '#F5F0E8',
    secondary: '#F5C518',
    primaryLight: '#faf8f5',
    secondaryLight: '#ffda3d',
  },
  'midnight-tangerine': {
    name: 'Midnight & Tangerine',
    description: 'Modern and Energetic',
    primary: '#0D1B2A',
    secondary: '#FF6B35',
    primaryLight: '#1b3a5a',
    secondaryLight: '#ff8c5a',
  },
  'cosmic-grape': {
    name: 'Cosmic Grape',
    description: 'Bold and Electric',
    primary: '#2D1B69',
    secondary: '#39FF14',
    primaryLight: '#4a2b9a',
    secondaryLight: '#5dff47',
  },
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      palette: 'emerald-violet',
      darkMode: false,
      getPalette: () => themePalettes[get().palette],
      getAllPalettes: () => themePalettes,
      setPalette: (palette) => set({ palette }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (darkMode) => set({ darkMode }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
