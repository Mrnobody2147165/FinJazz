import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
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
    onboardingComplete: userData?.onboardingComplete
  });

  useEffect(() => {
    console.log('[AuthProvider] Setting up auth listener');

    let mounted = true;
    let timeoutId = null;

    // Safety timeout - ensure we resolve loading even if Firebase fails
    timeoutId = setTimeout(() => {
      if (mounted && initialLoad) {
        console.log('[AuthProvider] Safety timeout triggered - resolving loading state');
        setInitialLoad(false);
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthProvider] Auth state changed:', { hasUser: !!firebaseUser, uid: firebaseUser?.uid });

      if (!mounted) return;

      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const data = await getUserData(firebaseUser.uid);
          console.log('[AuthProvider] User data fetched:', data);
          if (mounted) {
            setUserData(data);
          }
        } catch (error) {
          console.error('[AuthProvider] Error fetching user data:', error);
          if (mounted) {
            setUserData(null);
          }
        }
      } else {
        setUser(null);
        setUserData(null);
      }

      if (mounted) {
        setLoading(false);
        setInitialLoad(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    });

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [setUser, setUserData, setLoading]);

  const handleLogout = useCallback(async () => {
    try {
      await auth.signOut();
      logout();
    } catch (error) {
      console.error('[AuthProvider] Logout error:', error);
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, userData, handleLogout, initialLoad }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
