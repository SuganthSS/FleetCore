# FleetCore Enterprise Administrator Dashboard

## Overview
The FleetCore Enterprise Administrator Dashboard is designed using the **Stitch MCP Source of Truth** (`Executive Dashboard - FleetCore`) under the single-enterprise logistics architecture. It surfaces high-density operational metrics, fleet health diagnostics, real-time map tracking, critical alerts, and user activity timelines exclusively for the **Administrator** role.

---

## Technical Architecture

### 1. Single-Enterprise RBAC Integration
- **Role Target**: `Administrator` (Highest role in FleetCore 6-role hierarchy).
- **Backend Authorization**: Consumes `GET /api/v1/dashboard` with TanStack Query.
- **Tenant Model**: Single logistics organization (`FleetCore Logistics`). Removed all multi-tenant company switchers and SaaS selectors.

### 2. Component Hierarchy
All components are modularly structured within `frontend/src/components/dashboard/`:
- `DashboardHeader`: Enterprise greeting, date display, theme toggling, notification count, and quick user actions.
- `ExecutiveOverview`: High-impact AI Fleet Health Summary featuring key efficiency gains, maintenance flags, and fuel anomaly routes.
- `KPICard`: Reusable high-density metric cards for *Total Vehicles*, *Active Trips*, *Maintenance Due*, and *Active Drivers*.
- `FleetHealthCard`: Real-time interactive fleet map overlay with active, standby, and maintenance state distribution bar.
- `OperationsCard` & `ChartCard`: Visual analytics trend cards depicting fleet efficiency and on-time delivery rates.
- `ShipmentCard`, `TripCard`, `FuelCard`, `MaintenanceCard`: Domain-specific metric widgets connected directly to backend statistics.
- `AlertsPanel`: High-priority critical alerts panel highlighting immediate action items (Fuel anomaly & overdue work orders).
- `RecentActivity`: Real-time user activity stream & security audit log feed.
- `DashboardSkeleton`, `DashboardEmptyState`, `DashboardErrorState`: Robust state management for loading, empty data, and API failure scenarios.

---

## Design System Specifications
- **Design Tokens**: Plus Jakarta Sans for display titles and Inter for dense UI metrics.
- **Color Palette**: Core Blue (`#2563EB` / `#004AC6`), Slate neutrals, Emerald for active status, and Rose/Crimson (`#BA1A1A`) for high-priority alerts.
- **Grid & Alignment**: 12-column responsive fluid grid with maximum container width of `1440px`.

---

## API & Data Flow
- **Endpoint**: `GET /api/v1/dashboard`
- **Hook**: `@tanstack/react-query` `useQuery` with `staleTime: 30000` (30 seconds).
- **Fallback**: Gracefully transitions to `DashboardEmptyState` if total fleet/trip counts equal `0`, and provides retry capabilities via `DashboardErrorState`.
