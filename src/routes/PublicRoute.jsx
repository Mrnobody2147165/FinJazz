import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingOverlay } from '@/components/ui/Loading';

const PublicRoute = () => {
  const { user, userData, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingOverlay message="Loading..." />;
  }

  if (user && !userData) {
    return <LoadingOverlay message="Loading profile..." />;
  }

  if (user && userData?.onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user && userData && !userData.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
