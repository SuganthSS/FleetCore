import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { VehiclesPage } from '@/pages/VehiclesPage';
import { VehicleDetailsPage } from '@/pages/VehicleDetailsPage';
import { DriversPage } from '@/pages/DriversPage';
import { DriverProfilePage } from '@/pages/DriverProfilePage';
import { CustomersPage } from '@/pages/CustomersPage';
import { ShipmentsPage } from '@/pages/ShipmentsPage';
import { RoutesPage } from '@/pages/RoutesPage';
import { RouteDetailsPage } from '@/pages/RouteDetailsPage';
import { TripsPage } from '@/pages/TripsPage';
import { FuelPage } from '@/pages/FuelPage';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { TrackingPage } from '@/pages/TrackingPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { UsersPage } from '@/pages/UsersPage';
import { RolesPermissionsPage } from '@/pages/RolesPermissionsPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { LoginPage } from '@/pages/LoginPage';








import { NotFoundPage } from '@/pages/NotFoundPage';



const router = createBrowserRouter([

  /* ── Root redirect ── */
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  /* ── Public routes (redirect to /dashboard if authenticated) ── */
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

  /* ── Protected routes (redirect to /login if unauthenticated) ── */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/vehicles',
            element: <VehiclesPage />,
          },
          {
            path: '/vehicles/:id',
            element: <VehicleDetailsPage />,
          },
          {
            path: '/drivers',
            element: <DriversPage />,
          },
          {
            path: '/drivers/:id',
            element: <DriverProfilePage />,
          },
          {
            path: '/customers',
            element: <CustomersPage />,
          },
          {
            path: '/shipments',
            element: <ShipmentsPage />,
          },
          {
            path: '/routes',
            element: <RoutesPage />,
          },
          {
            path: '/routes/:id',
            element: <RouteDetailsPage />,
          },
          {
            path: '/trips',
            element: <TripsPage />,
          },
          {
            path: '/fuel',
            element: <FuelPage />,
          },
          {
            path: '/maintenance',
            element: <MaintenancePage />,
          },
          {
            path: '/tracking',
            element: <TrackingPage />,
          },
          {
            path: '/notifications',
            element: <NotificationsPage />,
          },
          {
            path: '/analytics',
            element: <AnalyticsPage />,
          },
          {
            path: '/reports',
            element: <ReportsPage />,
          },
          {
            path: '/users',
            element: <UsersPage />,
          },
          {
            path: '/roles',
            element: <RolesPermissionsPage />,
          },
          {
            path: '/audit',
            element: <AuditLogsPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
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
