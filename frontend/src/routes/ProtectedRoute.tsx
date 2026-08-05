import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/PageLoader';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleName = user?.roleName;

  if (allowedRoles && allowedRoles.length > 0 && roleName) {

    if (!allowedRoles.includes(roleName)) {
      // Redirect Fleet Manager away from Admin pages
      if (roleName === 'Fleet Manager') {
        return <Navigate to="/fleet-manager/dashboard" replace />;
      }
      // Redirect Admin away to admin dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
