import { Navigate } from 'react-router-dom';
import useAuthStore, { selectIsCompanyProfile } from '@/stores/authStore';

const CompanyRoute = ({ children }) => {
  const isCompany = useAuthStore(selectIsCompanyProfile);

  if (!isCompany) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default CompanyRoute;
