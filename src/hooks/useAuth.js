import useAuthStore, {
  selectIsAuthenticated,
  selectIsInitializing,
  selectIsCompanyProfile,
} from '@/stores/authStore';

/**
 * Auth hook — reads from the single Zustand auth store.
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const userData = useAuthStore((s) => s.userData);
  const status = useAuthStore((s) => s.status);
  const authError = useAuthStore((s) => s.authError);
  const logout = useAuthStore((s) => s.logout);
  const isInitializing = useAuthStore(selectIsInitializing);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return {
    user,
    userData,
    status,
    authError,
    logout,
    isInitializing,
    isAuthenticated,
    /** @deprecated use isInitializing */
    initialLoad: isInitializing,
    /** @deprecated use logout */
    handleLogout: logout,
  };
};

export const useActiveProfile = () => {
  const activeProfile = useAuthStore((s) => s.activeProfile);
  const activeProfileId = useAuthStore((s) => s.activeProfileId);
  const profiles = useAuthStore((s) => s.profiles);
  const isCompany = useAuthStore(selectIsCompanyProfile);
  const currency = activeProfile?.currency || 'PKR';

  return { activeProfile, activeProfileId, profiles, isCompany, currency };
};

export default useAuth;
