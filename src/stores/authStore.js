import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { AUTH_STATUS } from '@/constants';
import useNotificationStore from './notificationStore';
import useThemeStore from './themeStore';

const syncActiveProfile = (profiles, activeProfileId) => {
  if (profiles.length === 0) {
    return { activeProfileId: null, activeProfile: null };
  }

  const validId =
    activeProfileId && profiles.some((p) => p.id === activeProfileId)
      ? activeProfileId
      : profiles[0].id;

  return {
    activeProfileId: validId,
    activeProfile: profiles.find((p) => p.id === validId) ?? null,
  };
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      userData: null,
      profiles: [],
      activeProfileId: null,
      activeProfile: null,
      status: AUTH_STATUS.INITIALIZING,
      authError: null,

      setUser: (user) => set({ user }),

      setUserData: (userData) => set({ userData }),

      setStatus: (status) => set({ status }),

      setAuthError: (authError) => set({ authError }),

      setProfiles: (profiles) => {
        const { activeProfileId } = get();
        set({ profiles, ...syncActiveProfile(profiles, activeProfileId) });
      },

      setActiveProfile: (profileId) => {
        const { profiles } = get();
        const profile = profiles.find((p) => p.id === profileId) ?? null;
        set({ activeProfileId: profileId, activeProfile: profile });

        if (profile?.themePalette) {
          useThemeStore.getState().setPalette(profile.themePalette);
        }
      },

      addProfile: (profile) => {
        const { profiles, activeProfileId } = get();
        const nextProfiles = [...profiles, profile];
        set({ profiles: nextProfiles, ...syncActiveProfile(nextProfiles, activeProfileId) });
      },

      updateProfile: (profileId, data) => {
        const state = get();
        const profiles = state.profiles.map((p) =>
          p.id === profileId ? { ...p, ...data } : p
        );
        const activeProfile =
          state.activeProfileId === profileId
            ? { ...state.activeProfile, ...data }
            : state.activeProfile;
        set({ profiles, activeProfile });
      },

      removeProfile: (profileId) => {
        const { profiles, activeProfileId } = get();
        const nextProfiles = profiles.filter((p) => p.id !== profileId);
        const nextActiveId = activeProfileId === profileId ? null : activeProfileId;
        set({ profiles: nextProfiles, ...syncActiveProfile(nextProfiles, nextActiveId) });
      },

      reset: () =>
        set({
          user: null,
          userData: null,
          profiles: [],
          activeProfileId: null,
          activeProfile: null,
          authError: null,
        }),

      logout: async () => {
        try {
          if (auth) await signOut(auth);
        } catch (error) {
          console.error('[Auth] Logout error:', error);
        } finally {
          get().reset();
          useNotificationStore.getState().clearAll();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        activeProfileId: state.activeProfileId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.activeProfile = null;
          state.profiles = [];
          state.user = null;
          state.userData = null;
        }
      },
    }
  )
);

export default useAuthStore;

export const selectIsAuthenticated = (state) => Boolean(state.user);
export const selectIsInitializing = (state) => state.status === AUTH_STATUS.INITIALIZING;
export const selectIsCompanyProfile = (state) => state.activeProfile?.profileType === 'company';
