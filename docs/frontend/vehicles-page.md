# Vehicles Management Page

**Module**: Vehicles Fleet Administration (`frontend/src/pages/VehiclesPage.tsx`)  
**Phase**: Phase 6 — Frontend Development  
**SPEC**: SPEC-086  
**Status**: Implemented & Production-Ready  

---

## 📐 Architecture & Layout

The Vehicles Management interface utilizes the shared `DashboardLayout` container to present a highly-interactive control panel matching the premium logistics SaaS aesthetic:

1. **Page Header**:
   - Displays the main title **"Vehicles"** and the subtitle **"Manage your organization's fleet."**.
   - Contains a primary action button `+ Add Vehicle` to initiate the creation modal flow.
2. **Toolbar (`VehicleToolbar`)**:
   - **Search Input**: Triggers live queries against vehicle registration plate numbers, VIN, makes, or models.
   - **Status/Availability Dropdown**: Filters assets based on operational availability (`AVAILABLE`, `ON_TRIP`, `MAINTENANCE`, `OUT_OF_SERVICE`, `DECOMMISSIONED`).
   - **Vehicle Type Dropdown**: Scopes queries to specific categorizations (`TRUCK`, `VAN`, `TRAILER`, etc.).
   - **Refresh Button**: Rotates with spin micro-animations during query fetching.
   - **Reset Filters**: Clear all search terms and dropdown conditions instantly.
3. **Vehicle Table (`VehicleTable`)**:
   - Modern tabular layout presenting the fleet assets. Columns include:
     - **Asset**: Circular placeholder avatar representing the vehicle.
     - **Reg Number**: License registration text.
     - **Vehicle Name**: Displays manufacturer and model. Includes the VIN as sub-text.
     - **Type**: Formatted category text.
     - **Capacity**: Numeric payload display.
     - **Status**: Status indicator badges.
     - **Availability**: Decoupled helper text indicating operational deployment states.
     - **Assigned Driver**: Dynamic indicator reflecting driver allocations via active trips.
     - **Actions**: View (drawer details), Edit (modal update), and Delete (confirm dialog).
4. **Pagination Controls**:
   - Show active record slices (e.g. `Showing 1 to 10 of 24 vehicles`) alongside numerical button selectors and back/next actions.

---

## 🌳 Component Tree

```text
VehiclesPage
 ├── PageHeader
 ├── VehicleToolbar
 ├── VehicleTable
 │    └── VehicleStatusBadge
 ├── VehicleModal
 │    └── Input
 ├── VehicleDetailsDrawer
 │    └── VehicleStatusBadge
 └── ConfirmDialog
```

---

## 🔌 API Integration & State Management

- **API Gateway (`services/vehicle.service.ts`)**:
  - Connects to routes `GET /api/v1/vehicles`, `GET /api/v1/vehicles/:id`, `POST /api/v1/vehicles`, `PUT /api/v1/vehicles/:id`, and `DELETE /api/v1/vehicles/:id`.
- **Query Management**:
  - Leverages TanStack Query (`useQuery`) using keying: `['vehicles', search, status, vehicleType, page, limit, sortBy, sortOrder]`.
- **Mutations**:
  - Uses `useMutation` hooks for creation, edits, and deletions, trigger-invalidating the query client on success to avoid stale cache states.
- **Loading Skeletons**:
  - `VehicleSkeleton` mocks the full table and filter toolbar structure with pulse states.
- **Empty & Error Handling**:
  - Leverages `EmptyState` when queries yield no items, and `ErrorState` with retry callbacks for network connection timeouts.

---

## ♿ Accessibility & Responsive Design

- **ARIA & Semantics**:
  - Uses semantic `<nav>`, `<main>`, `<table>`, `<thead>`, `<tbody>`, `<tr>`, and `<td>` markup.
  - Interactive triggers bind `aria-label` tags (e.g. page selection, details drawers, close dialog actions).
- **Responsive Layouts**:
  - The vehicle table wraps inside a responsive horizontal scroller (`overflow-x-auto`) to protect column structure on smaller viewport bounds.
  - Grid cells automatically scale from singular fields to dual-column grids on tablets/desktops.
