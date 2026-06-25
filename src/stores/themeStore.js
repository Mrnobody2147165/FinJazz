import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAllThemesMeta } from '@/theme/themes';

const useThemeStore = create(
  persist(
    (set, get) => ({
      palette: 'emerald-violet',
      darkMode: false,
      setPalette: (palette) => set({ palette }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (darkMode) => set({ darkMode }),
      getAllThemesMeta,
      // Backward compatibility alias
      getAllPalettes: getAllThemesMeta,
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
