import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/stores/authStore";
import { LoadingOverlay } from "@/components/ui/Loading";

const ProtectedRoute = () => {
  const authState = useAuth() || {};
  const { user, userData, initialLoad } = authState;
  const { profiles, activeProfileId } = useAuthStore();
  const location = useLocation();

  console.log("[ProtectedRoute]", {
    initialLoad,
    hasUser: !!user,
    hasUserData: !!userData,
    hasProfiles: profiles.length,
    onboardingComplete: userData?.onboardingComplete,
    pathname: location.pathname,
  });

  if (initialLoad) {
    console.log("[ProtectedRoute] Showing loading overlay - initialLoad");
    return <LoadingOverlay message="Loading..." />;
  }

  if (!user) {
    console.log("[ProtectedRoute] Redirecting to /login - no user");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no userData in Firestore yet, go to onboarding
  if (!userData) {
    console.log("[ProtectedRoute] No userData, redirecting to onboarding");
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding not complete, go to onboarding
  if (userData && !userData.onboardingComplete && location.pathname !== "/onboarding") {
    console.log("[ProtectedRoute] Redirecting to /onboarding");
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding complete and on onboarding page, go to dashboard
  if (userData?.onboardingComplete && location.pathname === "/onboarding") {
    console.log("[ProtectedRoute] Redirecting to /dashboard - onboarding complete");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("[ProtectedRoute] Rendering outlet");
  return <Outlet />;
};

export default ProtectedRoute;
