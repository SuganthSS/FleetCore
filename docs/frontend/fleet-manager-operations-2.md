# Fleet Manager Operations Documentation Part 2 (SPEC-203)

## Overview
**SPEC-203** completes the Fleet Manager workspace operational suite by delivering dedicated, high-density interfaces for **Fuel Management**, **Maintenance Tracking**, and **GPS Live Tracking**. These views streamline operational workflow execution, dispatch efficiency, and telemetry monitoring while maintaining a strict boundary that hides organization-level administration tools.

---

## 1. Operational Views & Routes

### A. Fuel Management (`/fleet-manager/fuel`)
- **Page Component**: `FleetManagerFuelPage.tsx`
- **Operational Focus**:
  - **KPIs**: Today's Fuel Usage, Monthly Cost ($418.3k baseline), Avg MPG Efficiency (6.8 MPG / 28.4 L/100km), Highest/Lowest Vehicle Refuel Outliers.
  - **Analytics & Trends**: Operational cost trends, consumption charts via `FuelAnalyticsCard`.
  - **Actions**: Log Refuel Entry (`FuelModal`), Refuel Details Drawer (`FuelDetailsDrawer`), Refueling Verification.
  - **Restrictions**: Permanent deletion/purging of historical fuel logs is disabled for Fleet Managers.

### B. Maintenance Management (`/fleet-manager/maintenance`)
- **Page Component**: `FleetManagerMaintenancePage.tsx`
- **Operational Focus**:
  - **KPIs**: Total Work Orders, Scheduled Maintenance, In-Progress Repairs, Critical/Emergency Work Orders, Overdue Inspections.
  - **Actions**: Create Work Order (`MaintenanceModal`), Complete & Sign-Off Work Order (`completeWorkOrderMutation`), Details View (`MaintenanceDetailsPage`), Details Drawer (`MaintenanceDetailsDrawer`).
  - **Restrictions**: Service history log purging is disabled for non-administrators.

### C. GPS Live Tracking (`/fleet-manager/tracking`)
- **Page Component**: `FleetManagerTrackingPage.tsx`
- **Operational Focus**:
  - **KPIs**: Active Fleet Online, Moving Vehicles, Idling Units, Offline / Unreachable Hardware, Live Alerts Feed.
  - **Map & Telemetry**: Interactive map container (`TrackingMap`) displaying vehicle markers, speeds, coordinates, engine status, and driver assignments.
  - **Actions**: Quick Locate on Map, Log Telemetry Point (`TrackingModal`), Telemetry Details Drawer (`TrackingDetailsDrawer`).
  - **Restrictions**: Historical GPS breadcrumb log purging is disabled for Fleet Managers.

---

## 2. Shared Component & API Reuse Matrix

| Module | Backend Services Reused | UI Components Reused |
| :--- | :--- | :--- |
| **Fuel** | `fuelService`, `vehicleService`, `tripService` | `FuelHeader`, `FuelKPICards`, `FuelAnalyticsCard`, `FuelToolbar`, `FuelTable`, `FuelCards`, `FuelDetailsDrawer`, `FuelModal`, `FuelSkeleton`, `FuelEmptyState`, `FuelErrorState` |
| **Maintenance** | `maintenanceService`, `vehicleService`, `driverService` | `MaintenanceHeader`, `MaintenanceKPICards`, `MaintenanceToolbar`, `MaintenanceTable`, `MaintenanceCards`, `MaintenanceDetailsPage`, `MaintenanceDetailsDrawer`, `MaintenanceModal`, `MaintenanceSkeleton`, `MaintenanceEmptyState`, `MaintenanceErrorState` |
| **GPS Tracking** | `trackingService`, `vehicleService`, `driverService`, `tripService` | `TrackingHeader`, `TrackingKPICards`, `TrackingMap`, `TrackingAlertFeed`, `TrackingToolbar`, `TrackingTable`, `TrackingCards`, `TrackingDetailsDrawer`, `TrackingModal`, `TrackingSkeleton`, `ErrorState`, `EmptyState` |

---

## 3. Role & Permission Controls

- **Allowed Fleet Manager Actions**: Dispatch Trips, Assign Drivers/Vehicles, Log Fuel Refueling, Schedule Maintenance Work Orders, Sign-Off Completed Repairs, Monitor Live GPS Telemetry, Contact Active Drivers.
- **Restricted Administrator-Only Actions**: Managing User Accounts (`/users`), Editing System Roles (`/roles`), Purging Audit Logs (`/audit`), Deleting Companies/Organization Settings (`/settings`).

---

## 4. Verification Audits
- **Frontend Build**: Passed (`tsc -b && vite build` -> 0 errors).
- **Frontend Lint**: Passed (`oxlint` -> 0 errors).
- **Backend Build**: Passed (`tsc` -> 0 errors).
- **Backend Lint**: Passed (`eslint` -> 0 errors).
