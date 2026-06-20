import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingOverlay } from '@/components/ui/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, userData, initialLoad } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute]', {
    initialLoad,
    hasUser: !!user,
    hasUserData: !!userData,
    onboardingComplete: userData?.onboardingComplete,
    pathname: location.pathname
  });

  if (initialLoad) {
    console.log('[ProtectedRoute] Showing loading overlay - initialLoad');
    return <LoadingOverlay message="Loading..." />;
  }

  if (!user) {
    console.log('[ProtectedRoute] Redirecting to /login - no user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userData) {
    // Still loading userData - show loading instead of redirecting
    console.log('[ProtectedRoute] Waiting for userData...');
    return <LoadingOverlay message="Loading profile..." />;
  }

  if (!userData.onboardingComplete && location.pathname !== '/onboarding') {
    console.log('[ProtectedRoute] Redirecting to /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  if (userData.onboardingComplete && location.pathname === '/onboarding') {
    console.log('[ProtectedRoute] Redirecting to /dashboard - onboarding complete');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[ProtectedRoute] Rendering children');
  return children;
};

export default ProtectedRoute;
