import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/PageLoader';

export const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    const roleName = user?.roleName;
    if (roleName === 'Fleet Manager') {
      return <Navigate to="/fleet-manager/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
