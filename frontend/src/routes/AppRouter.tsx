import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { FleetManagerLayout } from '@/layouts/FleetManagerLayout';
import { DispatcherLayout } from '@/layouts/DispatcherLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { useAuth } from '@/hooks/useAuth';

import { DashboardPage } from '@/pages/DashboardPage';
import { FleetManagerDashboardPage } from '@/pages/FleetManagerDashboardPage';
import { FleetManagerVehiclesPage } from '@/pages/fleet-manager/FleetManagerVehiclesPage';
import { FleetManagerDriversPage } from '@/pages/fleet-manager/FleetManagerDriversPage';
import { FleetManagerTripsPage } from '@/pages/fleet-manager/FleetManagerTripsPage';
import { FleetManagerFuelPage } from '@/pages/fleet-manager/FleetManagerFuelPage';
import { FleetManagerMaintenancePage } from '@/pages/fleet-manager/FleetManagerMaintenancePage';
import { FleetManagerTrackingPage } from '@/pages/fleet-manager/FleetManagerTrackingPage';
import { FleetManagerAnalyticsPage } from '@/pages/fleet-manager/FleetManagerAnalyticsPage';
import { FleetManagerReportsPage } from '@/pages/fleet-manager/FleetManagerReportsPage';
import { FleetManagerAIPage } from '@/pages/fleet-manager/FleetManagerAIPage';
import { FleetManagerNotificationsPage } from '@/pages/fleet-manager/FleetManagerNotificationsPage';
import { FleetManagerDocumentsPage } from '@/pages/fleet-manager/FleetManagerDocumentsPage';
import { FleetManagerProfilePage } from '@/pages/fleet-manager/FleetManagerProfilePage';
import { FleetManagerSearchPage } from '@/pages/fleet-manager/FleetManagerSearchPage';

import { DispatcherDashboardPage } from '@/pages/dispatcher/DispatcherDashboardPage';
import {
  DispatchCenterPage,
  DispatcherTripsPage,
  DispatcherShipmentsPage,
  DispatcherRoutesPage,
  DispatcherDriversPage,
  DispatcherVehiclesPage,
  DispatcherTrackingPage,
  DispatcherNotificationsPage,
  DispatcherDocumentsPage,
  DispatcherAIPage,
  DispatcherSearchPage,
  DispatcherProfilePage,
} from '@/pages/dispatcher/DispatcherPlaceholders';

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
  if (roleName === 'Dispatcher') {
    return <Navigate to="/dispatcher/dashboard" replace />;
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
          { path: '/fleet-manager/vehicles', element: <FleetManagerVehiclesPage /> },
          { path: '/fleet-manager/vehicles/:id', element: <VehicleDetailsPage /> },
          { path: '/fleet-manager/drivers', element: <FleetManagerDriversPage /> },
          { path: '/fleet-manager/drivers/:id', element: <DriverProfilePage /> },
          { path: '/fleet-manager/trips', element: <FleetManagerTripsPage /> },
          { path: '/fleet-manager/trips/:id', element: <TripDetailsPage /> },
          { path: '/fleet-manager/fuel', element: <FleetManagerFuelPage /> },
          { path: '/fleet-manager/maintenance', element: <FleetManagerMaintenancePage /> },
          { path: '/fleet-manager/tracking', element: <FleetManagerTrackingPage /> },
          { path: '/fleet-manager/analytics', element: <FleetManagerAnalyticsPage /> },
          { path: '/fleet-manager/reports', element: <FleetManagerReportsPage /> },
          { path: '/fleet-manager/ai', element: <FleetManagerAIPage /> },
          { path: '/fleet-manager/notifications', element: <FleetManagerNotificationsPage /> },
          { path: '/fleet-manager/documents', element: <FleetManagerDocumentsPage /> },
          { path: '/fleet-manager/profile', element: <FleetManagerProfilePage /> },
          { path: '/fleet-manager/search', element: <FleetManagerSearchPage /> },
          { path: '/fleet-manager/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  /* ── Dispatcher Protected Routes (SPEC-301) ── */
  {
    element: <ProtectedRoute allowedRoles={['Dispatcher', 'Administrator']} />,
    children: [
      {
        element: <DispatcherLayout />,
        children: [
          { path: '/dispatcher', element: <Navigate to="/dispatcher/dashboard" replace /> },
          { path: '/dispatcher/dashboard', element: <DispatcherDashboardPage /> },
          { path: '/dispatcher/dispatch-center', element: <DispatchCenterPage /> },
          { path: '/dispatcher/trips', element: <DispatcherTripsPage /> },
          { path: '/dispatcher/shipments', element: <DispatcherShipmentsPage /> },
          { path: '/dispatcher/routes', element: <DispatcherRoutesPage /> },
          { path: '/dispatcher/drivers', element: <DispatcherDriversPage /> },
          { path: '/dispatcher/vehicles', element: <DispatcherVehiclesPage /> },
          { path: '/dispatcher/tracking', element: <DispatcherTrackingPage /> },
          { path: '/dispatcher/notifications', element: <DispatcherNotificationsPage /> },
          { path: '/dispatcher/documents', element: <DispatcherDocumentsPage /> },
          { path: '/dispatcher/ai', element: <DispatcherAIPage /> },
          { path: '/dispatcher/search', element: <DispatcherSearchPage /> },
          { path: '/dispatcher/profile', element: <DispatcherProfilePage /> },
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
