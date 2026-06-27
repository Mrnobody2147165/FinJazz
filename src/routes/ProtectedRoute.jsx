import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingOverlay } from '@/components/ui/Loading';

const ProtectedRoute = () => {
  const { user, userData, isInitializing, authError } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <LoadingOverlay message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authError && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <div className="max-w-md text-center space-y-4">
          <p className="text-[var(--danger)] font-medium">Unable to load your account</p>
          <p className="text-sm text-[var(--muted-foreground)]">{authError}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!userData.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (userData.onboardingComplete && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
