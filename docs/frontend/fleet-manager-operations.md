# Fleet Manager Operational Modules Documentation (SPEC-202)

## Overview
The **Fleet Manager Operational Modules** expand the Fleet Manager workspace with tailored, high-density operational views for **Vehicles**, **Drivers**, and **Trips**. These views optimize daily fleet dispatch, driver scheduling, and live operational tracking while omitting administrative system actions (such as user management, system audit logs, and global security controls).

---

## 1. Operational Views & Routes

### A. Vehicles View (`/fleet-manager/vehicles`)
- **Page Component**: `FleetManagerVehiclesPage.tsx`
- **Operational Focus**:
  - **KPIs**: Today's Availability, Active On Trip, Maintenance Warnings (In Shop), Fuel Efficiency (28.4 L/100km).
  - **Actions**: Quick Dispatch, Quick Maintenance Flagging, Vehicle Registration, Vehicle Details Drawer.
  - **Restrictions**: System-wide asset deletion disabled for non-admins.

### B. Drivers View (`/fleet-manager/drivers`)
- **Page Component**: `FleetManagerDriversPage.tsx`
- **Operational Focus**:
  - **KPIs**: Drivers On Duty, Active On Route, License Expiration Warnings (30-day window), Fleet Safety Score (94.8/100).
  - **Actions**: Quick Contact (phone dispatch callout), Roster View/Table toggle, Driver Roster Modal, Driver Details Drawer.
  - **Restrictions**: User profile deletion disabled.

### C. Trips View (`/fleet-manager/trips`)
- **Page Component**: `FleetManagerTripsPage.tsx`
- **Operational Focus**:
  - **KPIs**: Today's Departures (Scheduled), Active On Route (In Transit), Completed Today, Operational Alerts/Delays.
  - **Actions**: Quick Dispatch, Quick Complete, Trip Modal (driver/vehicle/route assignment), Trip Details Drawer.
  - **Restrictions**: Trip record purging disabled for non-admins.

---

## 2. Shared Component & API Reuse Strategy
All 3 operational views reuse existing backend services, TanStack Query hooks, and UI subcomponents to guarantee 100% operational consistency with Administrator v1.0:
- **Services Reused**: `vehicleService`, `driverService`, `tripService`, `shipmentService`, `routeService`.
- **UI Components Reused**:
  - Vehicles: `FleetHeader`, `FleetToolbar`, `FleetPagination`, `VehicleTable`, `VehicleDrawer`, `VehicleModal`, `VehicleSkeleton`, `VehicleEmptyState`, `VehicleErrorState`.
  - Drivers: `DriverHeader`, `DriverToolbar`, `DriverTable`, `DriverCards`, `DriverModal`, `DriverDrawer`, `DriverSkeleton`.
  - Trips: `TripHeader`, `TripToolbar`, `TripTable`, `TripCards`, `TripDrawer`, `TripModal`, `TripSkeleton`, `TripEmptyState`, `TripErrorState`.

---

## 3. Permission & Access Matrix

| Action / Resource | Administrator | Fleet Manager |
| :--- | :--- | :--- |
| **View Vehicles / Drivers / Trips** | ✅ Yes | ✅ Yes |
| **Create / Edit Vehicle & Driver Profiles** | ✅ Yes | ✅ Yes |
| **Schedule / Dispatch / Complete Trips** | ✅ Yes | ✅ Yes |
| **Delete System Users / Manage Roles** | ✅ Yes | ❌ Blocked (Redirected) |
| **Access Audit Logs & System Settings** | ✅ Yes | ❌ Blocked (Redirected) |

---

## 4. Verification & Quality Audits
- **Frontend Build**: Passed (`tsc -b && vite build` -> 0 errors).
- **Frontend Lint**: Passed (`oxlint` -> 0 errors).
- **Backend Build**: Passed (`tsc` -> 0 errors).
- **Backend Lint**: Passed (`eslint` -> 0 errors).
