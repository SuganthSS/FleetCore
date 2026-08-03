# Shipment Management Module Documentation

## Overview
The Shipment Management module enables complete lifecycle management for freight dispatches, pickup/delivery itineraries, customer assignments, and real-time tracking across the FleetCore SaaS platform.

## Key Components

- **`ShipmentHeader`**: Renders section title, total shipment count badge, CSV data export, list refresh action, and 'Create Shipment' trigger.
- **`ShipmentKPICards`**: 6 interactive KPI cards displaying Total Freight, Pending Dispatch, Dispatched, In Transit, Delivered, and Delayed/Failed with real-time status filtering.
- **`ShipmentToolbar`**: Multi-parameter search bar, status filter dropdowns, priority filter dropdowns, customer filter dropdowns, sorting controls, view mode toggles (`table` vs `cards`), and filter reset action.
- **`ShipmentTable`**: High-density table layout with shipment waybill numbers, title & cargo specs, origin-destination route indicators, estimated delivery dates, priority badges, status badges, and action triggers.
- **`ShipmentCards`**: Grid-card view for visual dispatch scanning.
- **`ShipmentDrawer`**: Slide-over drawer with 4 tabs: Overview, Itinerary, Cargo Specs, and Real-Time Tracking.
- **`ShipmentModal`**: React Hook Form + Zod schema validated modal for creating and updating freight shipments.
- **`ShipmentStatusBadge` & `ShipmentPriorityBadge`**: Pill badges for operational states and priority levels.
- **`ShipmentProfilePage`**: Full shipment profile view at `/shipments/:id` featuring 9 sub-panels for comprehensive dispatch management.

## API Integration & State Management
- Managed using **TanStack Query** (`useQuery` and `useMutation`).
- Interacts directly with backend REST APIs at `/api/v1/shipments`.
