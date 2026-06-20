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
  // userData is null when not loaded yet, so we check if user exists but userData is null
  // However we must differentiate between "loading" and "no data"
  // The AuthProvider sets userData=null when there's no user, OR when fetching failed
  // We need to wait for userData to be set after the user is detected
  if (user && userData === null && initialLoad === false) {
    // This could be a transient state where Firebase user exists but Firestore fetch hasn't completed
    // Give a brief moment for the userData fetch
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
  return children;
};

export default PublicRoute;
