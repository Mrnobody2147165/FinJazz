import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { getUserData, subscribeToProfiles } from '@/firebase/firestore';
import useAuthStore from '@/stores/authStore';
import { AUTH_STATUS } from '@/constants';

/**
 * Initializes Firebase auth once and keeps authStore in sync.
 * Single source of truth for authentication state.
 */
const AuthProvider = ({ children }) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!auth || initializedRef.current) return;
    initializedRef.current = true;

    let profilesUnsubscribe = null;
    let mounted = true;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      const store = useAuthStore.getState();
      store.setAuthError(null);

      if (!firebaseUser) {
        profilesUnsubscribe?.();
        profilesUnsubscribe = null;
        store.reset();
        store.setStatus(AUTH_STATUS.READY);
        return;
      }

      store.setUser(firebaseUser);

      try {
        const data = await getUserData(firebaseUser.uid);

        if (!mounted) return;

        if (data) {
          store.setUserData(data);

          profilesUnsubscribe?.();

          if (data.onboardingComplete) {
            profilesUnsubscribe = subscribeToProfiles(
              firebaseUser.uid,
              (profiles) => {
                if (mounted) useAuthStore.getState().setProfiles(profiles);
              },
              (error) => {
                console.error('[Auth] Profile subscription error:', error);
              }
            );
          } else {
            store.setProfiles([]);
          }
        } else {
          store.setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || '',
            accountType: 'personal',
            onboardingComplete: false,
          });
          store.setProfiles([]);
        }
      } catch (error) {
        console.error('[Auth] Failed to load user data:', error);
        if (mounted) {
          store.setAuthError(error.message || 'Failed to load user data');
          store.setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || '',
            accountType: 'personal',
            onboardingComplete: false,
          });
        }
      } finally {
        if (mounted) {
          useAuthStore.getState().setStatus(AUTH_STATUS.READY);
        }
      }
    });

    return () => {
      mounted = false;
      profilesUnsubscribe?.();
      unsubscribeAuth();
      initializedRef.current = false;
    };
  }, []);

  return children;
};

export default AuthProvider;
