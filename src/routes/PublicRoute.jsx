import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingOverlay } from '@/components/ui/Loading';

const PublicRoute = () => {
  const authState = useAuth() || {};
  const { user, userData, initialLoad } = authState;

  console.log('[PublicRoute]', {
    initialLoad,
    hasUser: !!user,
    hasUserData: !!userData,
    onboardingComplete: userData?.onboardingComplete
  });

  if (initialLoad) {
    console.log('[PublicRoute] Showing loading overlay - initialLoad');
    return <LoadingOverlay message="Loading..." />;
  }

  // Wait for userData if user exists but userData hasn't loaded yet
  if (user && !userData) {
    console.log('[PublicRoute] User exists but userData is null - may be fetching...');
    return <LoadingOverlay message="Loading profile..." />;
  }

  if (user && userData?.onboardingComplete) {
    console.log('[PublicRoute] Redirecting to /dashboard - authenticated');
    return <Navigate to="/dashboard" replace />;
  }

  if (user && userData && !userData.onboardingComplete) {
    console.log('[PublicRoute] Redirecting to /onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  console.log('[PublicRoute] Rendering public content');
  return <Outlet />;
};

export default PublicRoute;
