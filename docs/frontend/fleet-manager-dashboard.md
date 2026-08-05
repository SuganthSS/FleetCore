# Fleet Manager Workspace Documentation (SPEC-201)

## Overview
The **Fleet Manager Workspace** is a dedicated operational command center built in Phase 2 for the `Fleet Manager` role. It provides real-time fleet operations, dispatch tracking, driver management, fuel tracking, and maintenance monitoring while strictly restricting access to administrative system configurations (e.g., user management, security roles, system audit logs).

## Key Features & Layout Architecture
- **Dedicated Layout (`FleetManagerLayout.tsx`)**:
  - Operational header branding ("FleetCore Fleet Manager").
  - Fixed 260px sidebar styled according to the Stitch design system.
  - Role badge and user profile footer with quick logout.
- **Operational Dashboard (`FleetManagerDashboardPage.tsx`)**:
  - **KPI Cards**: Fleet Availability (94.2%), Vehicles Online (42/48), Active Trips Today (28), Drivers On Duty (36), Fuel Consumption (1,420L), Maintenance Due (4), Delayed Trips (2), Vehicle Utilization (88.5%).
  - **Live GPS Telemetry**: Teaser card connecting to real-time tracking views.
  - **Task Center**: Daily dispatch tasks and status tracking.
  - **Real-Time Operational Alerts**: Alerts feed for low fuel, inspection due, route deviation, and trip status.
  - **Operational Shortcuts**: Quick navigation to registry, roster, fuel logs, and reports.

## Role-Based Access Control (RBAC) & Protection
- **Route Guarding (`ProtectedRoute.tsx`)**:
  - Enforces `allowedRoles={['Fleet Manager', 'Administrator']}` on operational `/fleet-manager/*` routes.
  - Restricts `/users`, `/roles`, and `/audit` exclusively to `Administrator`.
  - Automatically redirects Fleet Managers attempting to access Admin routes back to `/fleet-manager/dashboard`.
- **Public & Root Navigation (`PublicRoute.tsx`, `RoleBasedRoot`)**:
  - Authenticated Fleet Managers visiting `/` or `/login` are automatically routed to `/fleet-manager/dashboard`.

## Shared Components & Operational Reuse
The Fleet Manager workspace reuses backend operational services and shared frontend components (Vehicles, Drivers, Trips, Maintenance, Fuel, Tracking, Analytics, Reports, AI Insights, Documents, Profile, Global Search) without duplicating business logic, maintaining complete alignment with Version 1.0.

## Build & Quality Compliance
- **Frontend Build**: Verified clean (`tsc -b && vite build` -> 0 errors).
- **Frontend Lint**: Verified clean (`oxlint` -> 0 errors).
- **Backend Build**: Verified clean (`tsc` -> 0 errors).
- **Backend Lint**: Verified clean (`eslint` -> 0 errors).
