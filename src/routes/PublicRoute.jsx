import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingOverlay } from '@/components/ui/Loading';

const PublicRoute = ({ children }) => {
  const { user, userData, initialLoad } = useAuth();

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
  if (user && userData === undefined) {
    console.log('[PublicRoute] Waiting for userData...');
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
  return children;
};

export default PublicRoute;
