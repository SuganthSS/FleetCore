import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { FleetManagerLayout } from '@/layouts/FleetManagerLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { useAuth } from '@/hooks/useAuth';

import { DashboardPage } from '@/pages/DashboardPage';
import { FleetManagerDashboardPage } from '@/pages/FleetManagerDashboardPage';
import { VehiclesPage } from '@/pages/VehiclesPage';
import { VehicleDetailsPage } from '@/pages/VehicleDetailsPage';
import { DriversPage } from '@/pages/DriversPage';
import { DriverProfilePage } from '@/pages/DriverProfilePage';
import { CustomersPage } from '@/pages/CustomersPage';
import { CustomerProfilePage } from '@/pages/CustomerProfilePage';
import { ShipmentsPage } from '@/pages/ShipmentsPage';
import { ShipmentProfilePage } from '@/pages/ShipmentProfilePage';
import { RoutesPage } from '@/pages/RoutesPage';
import { RouteDetailsPage } from '@/pages/RouteDetailsPage';
import { TripsPage } from '@/pages/TripsPage';
import { TripDetailsPage } from '@/pages/TripDetailsPage';
import { FuelPage } from '@/pages/FuelPage';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { TrackingPage } from '@/pages/TrackingPage';
import { NotificationCenterPage } from '@/pages/NotificationCenterPage';
import { DocumentLibraryPage } from '@/pages/DocumentLibraryPage';
import { MyProfilePage } from '@/pages/MyProfilePage';
import { GlobalSearchPage } from '@/pages/GlobalSearchPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { UsersPage } from '@/pages/UsersPage';
import { RolesPermissionsPage } from '@/pages/RolesPermissionsPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { AIInsightsPage } from '@/pages/AIInsightsPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const RoleBasedRoot: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roleName = user?.roleName;
  if (roleName === 'Fleet Manager') {
    return <Navigate to="/fleet-manager/dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

const router = createBrowserRouter([
  /* ── Root redirect based on Role ── */
  {
    path: '/',
    element: <RoleBasedRoot />,
  },

  /* ── Public routes ── */
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
        ],
      },
    ],
  },

  /* ── Administrator Protected Routes ── */
  {
    element: <ProtectedRoute allowedRoles={['Administrator']} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/vehicles', element: <VehiclesPage /> },
          { path: '/vehicles/:id', element: <VehicleDetailsPage /> },
          { path: '/drivers', element: <DriversPage /> },
          { path: '/drivers/:id', element: <DriverProfilePage /> },
          { path: '/customers', element: <CustomersPage /> },
          { path: '/customers/:id', element: <CustomerProfilePage /> },
          { path: '/shipments', element: <ShipmentsPage /> },
          { path: '/shipments/:id', element: <ShipmentProfilePage /> },
          { path: '/routes', element: <RoutesPage /> },
          { path: '/routes/:id', element: <RouteDetailsPage /> },
          { path: '/trips', element: <TripsPage /> },
          { path: '/trips/:id', element: <TripDetailsPage /> },
          { path: '/fuel', element: <FuelPage /> },
          { path: '/maintenance', element: <MaintenancePage /> },
          { path: '/tracking', element: <TrackingPage /> },
          { path: '/notifications', element: <NotificationCenterPage /> },
          { path: '/documents', element: <DocumentLibraryPage /> },
          { path: '/profile', element: <MyProfilePage /> },
          { path: '/search', element: <GlobalSearchPage /> },
          { path: '/analytics', element: <AnalyticsPage /> },
          { path: '/ai-insights', element: <AIInsightsPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/users', element: <UsersPage /> },
          { path: '/roles', element: <RolesPermissionsPage /> },
          { path: '/audit', element: <AuditLogsPage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },

  /* ── Fleet Manager Protected Routes ── */
  {
    element: <ProtectedRoute allowedRoles={['Fleet Manager', 'Administrator']} />,
    children: [
      {
        element: <FleetManagerLayout />,
        children: [
          { path: '/fleet-manager', element: <Navigate to="/fleet-manager/dashboard" replace /> },
          { path: '/fleet-manager/dashboard', element: <FleetManagerDashboardPage /> },
          { path: '/fleet-manager/vehicles', element: <VehiclesPage /> },
          { path: '/fleet-manager/vehicles/:id', element: <VehicleDetailsPage /> },
          { path: '/fleet-manager/drivers', element: <DriversPage /> },
          { path: '/fleet-manager/drivers/:id', element: <DriverProfilePage /> },
          { path: '/fleet-manager/trips', element: <TripsPage /> },
          { path: '/fleet-manager/trips/:id', element: <TripDetailsPage /> },
          { path: '/fleet-manager/fuel', element: <FuelPage /> },
          { path: '/fleet-manager/maintenance', element: <MaintenancePage /> },
          { path: '/fleet-manager/tracking', element: <TrackingPage /> },
          { path: '/fleet-manager/notifications', element: <NotificationCenterPage /> },
          { path: '/fleet-manager/documents', element: <DocumentLibraryPage /> },
          { path: '/fleet-manager/profile', element: <MyProfilePage /> },
          { path: '/fleet-manager/search', element: <GlobalSearchPage /> },
          { path: '/fleet-manager/analytics', element: <AnalyticsPage /> },
          { path: '/fleet-manager/ai-insights', element: <AIInsightsPage /> },
          { path: '/fleet-manager/reports', element: <ReportsPage /> },
          { path: '/fleet-manager/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },

  /* ── 404 catch-all ── */
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
