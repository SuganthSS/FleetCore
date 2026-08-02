# FleetCore Dashboard Module Documentation

**Module**: Analytics & Overview (`backend/src/modules/dashboard`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Fully Implemented (Service, Controller & Routes)  

---

## 📊 Overview

The Dashboard module is a **read-only** analytical aggregation layer that computes real-time Key Performance Indicators (KPIs) across FleetCore assets and operations: Vehicles, Drivers, Shipments, Trips, Maintenance, Fuel Transactions, Customers, and Notifications.

---

## ⚙️ Service Architecture (`services/dashboard.service.ts`)

The `DashboardService` utilizes Prisma native aggregation functions (`groupBy`, `count`, `aggregate`) combined with `Promise.all()` to execute concurrent, high-performance analytical queries without N+1 query overhead.

### Multi-Tenant Isolation
- When `companyId` is provided, all underlying queries enforce `{ companyId }` filtering.
- When `companyId` is omitted, global system-wide aggregations are calculated (reserved for Super Admin context).

---

## 📐 Response Schema & KPI Definitions

```typescript
export interface DashboardOverviewResult {
  fleet: {
    totalVehicles: number;
    activeVehicles: number;     // AVAILABLE + ON_TRIP
    inactiveVehicles: number;   // OUT_OF_SERVICE + DECOMMISSIONED
    maintenanceVehicles: number; // MAINTENANCE
  };
  drivers: {
    totalDrivers: number;
    activeDrivers: number;   // AVAILABLE + ON_TRIP
    inactiveDrivers: number; // OFF_DUTY + ON_LEAVE + SUSPENDED
  };
  shipments: {
    totalShipments: number;
    pending: number;   // PENDING
    inTransit: number; // DISPATCHED + IN_TRANSIT
    delivered: number; // DELIVERED
    cancelled: number; // CANCELLED + FAILED
  };
  trips: {
    totalTrips: number;
    planned: number;   // SCHEDULED
    active: number;    // DISPATCHED + IN_TRANSIT + PAUSED
    completed: number; // COMPLETED
    cancelled: number; // CANCELLED + FAILED
  };
  maintenance: {
    totalRecords: number;
    scheduled: number;  // SCHEDULED
    inProgress: number; // IN_PROGRESS
    completed: number;  // COMPLETED
    overdue: number;    // OVERDUE
  };
  fuel: {
    totalRecords: number;
    totalFuelConsumed: number; // SUM(quantity)
    totalFuelCost: number;     // SUM(totalCost)
  };
  customers: {
    totalCustomers: number;
    activeCustomers: number; // ACTIVE
  };
  notifications: {
    unread: number; // isRead = false
    total: number;
  };
}
```

---

## 🎮 Controller Layer (`controllers/dashboard.controller.ts`)

The `DashboardController` layer validates optional query parameters, evaluates user role permissions to assign multi-tenant scope, and delegates execution to `DashboardService`.

### Role-Aware Tenant Selection Rules
- **Super Admin**: Allowed to query global system statistics (`companyId` omitted) or specify a specific company scope (`query.companyId`).
- **All Other Roles**: Enforces `req.authenticatedUser.companyId` as the tenant filter, strictly ignoring any supplied `query.companyId`.

---

## 🛣️ Routes & RBAC Matrix (`routes/dashboard.routes.ts`)

Base Route: `/api/v1/dashboard`

### Middleware Execution Chain
```text
HTTP Request ➔ authenticate() ➔ authorize(...roles) ➔ DashboardController handler
```

### Endpoints Table & Allowed Roles

| HTTP Method | Path | Description | Allowed Roles (`authorize`) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard` | Aggregated real-time dashboard analytics overview | `Super Admin`, `Company Admin`, `Fleet Manager`, `Dispatcher` |

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  dashboardRoutes,
  dashboardController,
  dashboardService,
  DashboardOverviewResult,
} from './modules/dashboard';
```

