# Trip Management Module Documentation

## Overview
The Trip Management module enables complete operational management for fleet dispatches, transportation execution, driver and vehicle allocations, route assignment, and live delivery progress across the FleetCore SaaS platform.

## Key Components

- **`TripHeader`**: Renders section title, total trip count badge, CSV data export, list refresh action, and 'Create Trip' trigger.
- **`TripKPICards`**: 6 interactive KPI cards displaying Total Trips, Scheduled, Dispatched, In Transit, Completed, and Delayed/Failed with real-time status filtering.
- **`TripToolbar`**: Multi-parameter search bar, status filter dropdowns, vehicle filter dropdowns, driver filter dropdowns, route filter dropdowns, sorting controls, view mode toggles (`table` vs `cards`), and filter reset action.
- **`TripTable`**: High-density table layout with trip numbers, vehicle registration & assigned driver, route indicators (Origin → Dest), shipment links, scheduled start times, interactive progress bars, status badges, and action triggers.
- **`TripCards`**: Grid-card view for visual dispatch scanning.
- **`TripDrawer`**: Slide-over drawer with 4 tabs: Overview, Assignments, Progress, and Telemetry.
- **`TripModal`**: React Hook Form + Zod schema validated modal for creating and updating trip dispatches.
- **`TripStatusBadge` & `TripProgressBar`**: Status pill badges and transit progress completion visualizers.
- **`TripDetailsPage`**: Full trip details view at `/trips/:id` featuring 11 sub-panels (Overview, Driver, Vehicle, Route, Shipment, Progress & Timeline, Fuel Summary, Maintenance Alerts, Notes, Documents, Activity Log) along with quick dispatch action buttons.

## API Integration & State Management
- Managed using **TanStack Query** (`useQuery` and `useMutation`).
- Interacts directly with backend REST APIs at `/api/v1/trips`.
