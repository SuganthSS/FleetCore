# Fleet Overview & Vehicle Management — Frontend

## Overview

The Fleet Overview module provides a comprehensive real-time view of the entire FleetCore vehicle fleet. It is implemented as a complete Stitch-design-aligned rebuild of the previous Vehicle Management UI.

## Architecture

```
src/
├── pages/
│   ├── VehiclesPage.tsx         # Fleet Overview main page
│   └── VehicleDetailsPage.tsx   # Full Vehicle Details page (/vehicles/:id)
└── components/vehicle/
    ├── FleetHeader.tsx           # Page header with KPI count, Add/Export/Refresh
    ├── FleetKPICards.tsx         # 5 clickable KPI status cards
    ├── FleetToolbar.tsx          # Search + Status/Type/Fuel filters + Sort controls
    ├── FleetPagination.tsx       # Page-aware pagination with ellipsis
    ├── VehicleTable.tsx          # Full sortable data table with type/status badges
    ├── VehicleStatusBadge.tsx    # Status pill badge (AVAILABLE, ON_TRIP, etc.)
    ├── VehicleTypeBadge.tsx      # Vehicle type badge (TRUCK, VAN, etc.)
    ├── VehicleDrawer.tsx         # Slide-out drawer with Overview/Specs/Activity tabs
    ├── VehicleModal.tsx          # Create/Edit vehicle form with RHF + Zod
    ├── VehicleSkeleton.tsx       # Full-page skeleton matching layout
    ├── VehicleEmptyState.tsx     # Empty state with conditional messaging
    ├── VehicleErrorState.tsx     # Error state with retry capability
    └── index.ts                  # Barrel export
```

## Routes

| Path | Page | Description |
|---|---|---|
| `/vehicles` | `VehiclesPage` | Fleet Overview — KPIs + Table |
| `/vehicles/:id` | `VehicleDetailsPage` | Full Vehicle Detail View |

## Components

### `FleetKPICards`

- 5 clickable status filter cards: Total Fleet, Available, In Trip, Maintenance, Inactive
- Visual utilization bar per card
- Active filter highlighted with ring decoration

### `FleetToolbar`

- Real-time search (reg number, VIN, make, model)
- Dropdown filters: Status, Vehicle Type, Fuel Type
- Sort by: Date Added, Reg Number, Make, Year, Status, Capacity
- Clear-all filters button when active

### `VehicleTable`

- Sticky header with sort indicators
- Avatar initials per vehicle type with color coding
- Inline action buttons (view/edit/delete) revealed on hover
- Full VIN displayed on detail click

### `VehicleDrawer`

- Slide-in right drawer with tabbed navigation
- Tabs: Overview · Specifications · Activity
- Overview: Identity, Assigned Driver, Live Location, Record Info
- Specs: 6-card grid + Service Readiness checklist
- Activity: Event timeline feed

### `VehicleDetailsPage`

- Full-page vehicle detail view navigated from `/vehicles/:id`
- Hero card with breadcrumb, status/type badges, edit/delete actions
- 6 tabs: Overview · Specifications · Maintenance · Fuel History · Trip History · Documents
- Right sidebar: Assigned Driver, Live Location, Service Readiness
- Edit modal + delete confirmation dialog

## Data Layer

All data uses the existing backend API without modification:

| Operation | Method | Endpoint |
|---|---|---|
| List vehicles | `GET` | `/api/v1/vehicles` |
| Get vehicle | `GET` | `/api/v1/vehicles/:id` |
| Create vehicle | `POST` | `/api/v1/vehicles` |
| Update vehicle | `PUT` | `/api/v1/vehicles/:id` |
| Delete vehicle | `DELETE` | `/api/v1/vehicles/:id` |

### TanStack Query Keys

- `['vehicles', ...filters]` — paginated vehicle list
- `['vehicles-kpi']` — unfiltered counts for KPI cards (1-min stale)
- `['vehicle', id]` — single vehicle detail

## Form Validation (React Hook Form + Zod)

Fields validated:
- `registrationNumber` — required, max 30 chars
- `vin` — required, max 17 chars
- `make`, `model` — required, max 100 chars
- `manufacturingYear` — 1900 to next year
- `vehicleType` — enum
- `fuelType` — enum
- `capacity` — positive number, optional
- `status` — enum

## Design System Tokens Used

- Colors: `primary`, `emerald`, `blue`, `amber`, `zinc`, `orange`, `sky`, `violet`
- Radius: `rounded-xl`, `rounded-2xl`
- Font: `font-display` (headers), `font-mono` (VIN, reg number)
- Elevation: `shadow-xs`, `shadow-sm`, `shadow-2xl` (drawer)
- Animation: `animate-pulse` (skeleton), `hover:-translate-y-0.5` (KPI cards)
