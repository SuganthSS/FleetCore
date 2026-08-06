# Dispatcher Workspace & Operational Dashboard (SPEC-301)

## Overview
The Dispatcher Workspace provides a dedicated, high-performance operational portal for dispatchers in the FleetCore enterprise platform. It serves as the primary control room for managing active trip dispatches, driver assignments, vehicle availability, route corridors, priority delay alerts, and live GPS telemetry streams.

---

## Layout & Architecture
- **Layout Component**: `frontend/src/layouts/DispatcherLayout.tsx`
- **Dashboard Component**: `frontend/src/pages/dispatcher/DispatcherDashboardPage.tsx`
- **Placeholders**: `frontend/src/pages/dispatcher/DispatcherPlaceholders.tsx`
- **Stitch Design System Tokens**:
  - Primary Font: Plus Jakarta Sans
  - Primary Theme Accent: Enterprise Blue (`#2563eb`)
  - Container Shape: `rounded-2xl` rounded corners
  - Spacing & Grid: 8-column KPI layout, 3-column main operations grid, subtle box shadows (`shadow-xs`)

---

## Navigation & Sidebar Structure
The Dispatcher Layout features a sticky sidebar navigation with 13 dedicated operational endpoints:
1. **Dashboard** (`/dispatcher/dashboard`) - Main operational control center
2. **Dispatch Center** (`/dispatcher/dispatch-center`) - Live trip dispatch execution & driver assignment (*LIVE Badge*)
3. **Trips** (`/dispatcher/trips`) - Dispatch manifests & trip status tracking
4. **Shipments** (`/dispatcher/shipments`) - Active cargo waybills & delivery SLAs
5. **Routes** (`/dispatcher/routes`) - Interstate corridors & navigation waypoints
6. **Drivers** (`/dispatcher/drivers`) - Driver availability roster & HOS hours
7. **Vehicles** (`/dispatcher/vehicles`) - Operational fleet asset availability
8. **Live Tracking** (`/dispatcher/tracking`) - Real-time GPS telematics & location telemetry
9. **Notifications** (`/dispatcher/notifications`) - Delay alerts & urgent dispatch broadcasts
10. **Documents** (`/dispatcher/documents`) - Operational waybills & proof of delivery library
11. **AI Dispatcher** (`/dispatcher/ai`) - Groq AI copilot for route optimization & delay predictions
12. **Global Search** (`/dispatcher/search`) - Fast cross-entity operational search
13. **My Profile** (`/dispatcher/profile`) - Account credentials & shift settings

---

## Operational Dashboard Widgets
The `DispatcherDashboardPage` incorporates 8 operational KPI cards, interactive tables, vector maps, and alert feeds:
1. **Top Dispatch Bar**: Title badge, live telemetry indicator, refresh button, "Dispatch Center" & "New Dispatch" quick action triggers.
2. **Operational KPI Grid (8 Cards)**:
   - Today's Trips
   - Trips Awaiting Driver Assignment
   - Drivers Ready (On Duty)
   - Vehicles Ready (Active Fleet)
   - Route Delays
   - Active Shipments (In Transit)
   - Completed Deliveries (SLA On-Time)
   - Priority Alerts
3. **Live Operations Preview Map**: Vector graphic grid showing real-time GPS telemetry pins, vehicle speed/heading overlay, and waypoint status.
4. **Today's Dispatch Schedule Table**: Filterable view (All, Unassigned, In Transit) with trip numbers, vehicle registration, assigned driver, status badge, and quick management triggers.
5. **Quick Dispatch Actions Panel**: One-click operational shortcuts for dispatching pending trips, assigning drivers, monitoring GPS, and querying the AI assistant.
6. **Priority Alerts Feed**: Urgent delay warnings, unassigned high-priority shipments, and driver HOS duty limit notifications.
7. **Operational Timeline**: Chronological log of real-time dispatch departures, arrivals, and system events.

---

## Role-Based Access Control (RBAC) & Protection
- **Role Name**: `Dispatcher`
- **Allowed Access**: Dispatches, trips, drivers, vehicles, routes, tracking, notifications, documents, search, profile, and AI dispatcher assistant.
- **Restricted Access**: Administrator pages (`/users`, `/roles`, `/audit`, `/settings`), Fleet Manager pages (`/fleet-manager/*`), company settings, and organization administration.
- **Redirection Logic**: `ProtectedRoute` automatically intercepts unauthorized access attempts by a `Dispatcher` user and redirects them safely to `/dispatcher/dashboard`.
