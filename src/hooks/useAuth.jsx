import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { getUserData } from '@/firebase/firestore';
import useAuthStore from '@/stores/authStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, userData, setUser, setUserData, setLoading, logout } = useAuthStore();
  const [initialLoad, setInitialLoad] = useState(true);

  console.log('[AuthProvider] State:', {
    initialLoad,
    hasUser: !!user,
    hasUserData: !!userData,
    onboardingComplete: userData?.onboardingComplete,
  });

  useEffect(() => {
    console.log('[AuthProvider] Setting up auth listener');

    let mounted = true;

    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('[AuthProvider] Safety timeout triggered');
        setLoading(false);
        setInitialLoad(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthProvider] Auth state changed:', {
        hasUser: !!firebaseUser,
        uid: firebaseUser?.uid,
      });

      if (!mounted) return;

      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          const data = await getUserData(firebaseUser.uid);

          console.log('[AuthProvider] User data fetched:', data);

          if (data) {
            setUserData(data);
          } else {
            console.warn(
              '[AuthProvider] No Firestore profile found. Creating fallback profile.'
            );

            // Fallback profile for demo/testing
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: firebaseUser.displayName || '',
              accountType: 'personal',
              themePalette: 'emerald-violet',
              currency: 'USD',
              onboardingComplete: false,
            });
          }
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error('[AuthProvider] Error:', error);

        setUserData({
          uid: firebaseUser?.uid || '',
          email: firebaseUser?.email || '',
          fullName: firebaseUser?.displayName || '',
          accountType: 'personal',
          themePalette: 'emerald-violet',
          currency: 'USD',
          onboardingComplete: false,
        });
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialLoad(false);
          clearTimeout(timeoutId);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [setUser, setUserData, setLoading]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      logout();
    } catch (error) {
      console.error('[AuthProvider] Logout error:', error);
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        handleLogout,
        initialLoad,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    console.error('[useAuth] AuthContext is null');

    return {
      user: null,
      userData: null,
      handleLogout: async () => {},
      initialLoad: false,
    };
  }

  return context;
};

export default AuthContext;