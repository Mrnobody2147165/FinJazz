import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      userData: null,
      loading: true,
      setUser: (user) => set({ user }),
      setUserData: (userData) => set({ userData }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ user: null, userData: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;
