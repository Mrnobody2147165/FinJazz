import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      userData: null,
      loading: true,
      profiles: [],
      activeProfileId: null,
      activeProfile: null,

      setUser: (user) => set({ user }),
      setUserData: (userData) => set({ userData }),
      setLoading: (loading) => set({ loading }),
      setProfiles: (profiles) => set({ profiles }),

      setActiveProfile: (profileId) => {
        const state = get();
        const profile = state.profiles.find((p) => p.id === profileId);
        set({ activeProfileId: profileId, activeProfile: profile });
      },

      addProfile: (profile) => {
        const state = get();
        set({ profiles: [...state.profiles, profile] });
      },

      updateProfile: (profileId, data) => {
        const state = get();
        const profiles = state.profiles.map((p) =>
          p.id === profileId ? { ...p, ...data } : p
        );
        const activeProfile = state.activeProfileId === profileId
          ? { ...state.activeProfile, ...data }
          : state.activeProfile;
        set({ profiles, activeProfile });
      },

      removeProfile: (profileId) => {
        const state = get();
        const profiles = state.profiles.filter((p) => p.id !== profileId);
        const activeProfileId = state.activeProfileId === profileId
          ? (profiles.length > 0 ? profiles[0].id : null)
          : state.activeProfileId;
        const activeProfile = state.activeProfileId === profileId
          ? profiles[0] || null
          : state.activeProfile;
        set({ profiles, activeProfileId, activeProfile });
      },

      logout: () => set({
        user: null,
        userData: null,
        profiles: [],
        activeProfileId: null,
        activeProfile: null,
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        activeProfileId: state.activeProfileId,
      }),
    }
  )
);

export default useAuthStore;
