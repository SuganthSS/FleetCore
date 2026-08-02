# FleetCore Dashboard Page

**Module**: Analytics Dashboard Interface (`frontend/src/pages/DashboardPage.tsx`)  
**Phase**: Phase 6 — Frontend Development  
**SPEC**: SPEC-085  
**Status**: Implemented & Production-Ready  

---

## 📐 Layout & Visual Design

The Dashboard Page utilizes the standard `DashboardLayout` sidebar nav frame to present a structured analytics view inspired by premium logistics SaaS platforms:

1. **Dashboard Header**:
   - Personalized user greeting displaying the current formatted weekday calendar date.
   - Search bar input (UI only), theme selector button, notification trigger (UI only) displaying count, and user avatar dropdown menu allowing settings/sign-out actions.
2. **Stat Metrics Cards Grid**:
   - 8-column responsive grid showing primary counters: Total Vehicles, Active Drivers, Active Trips, Total Shipments, Maintenance In-Progress, Total Fuel Cost (USD), Active Customers, and Unread Alerts.
3. **Fleet Overview Card**:
   - Highlights overall fleet utilization percentages, alongside absolute active/inactive/service count cards and a segmented status ratio progress bar.
4. **Operations Summary Grid**:
   - Highlights trip statuses, shipment statuses, maintenance intervals, and fuel consumption trends in structured breakdown grids.
5. **Quick Actions widget**:
   - Links users directly to `/vehicles`, `/drivers`, `/trips`, `/shipments`, `/maintenance`, and `/fuel` dashboard pages.
6. **Recent Activity Timeline**:
   - Placeholders mapping active audit logs, utilizing the reusable `EmptyState` component.

---

## 🌳 Component Tree

```text
DashboardPage
 ├── DashboardHeader
 │    └── AvatarDropdown
 ├── StatCard (x8)
 ├── FleetOverviewCard
 ├── QuickActions
 ├── OperationsCard (x4)
 └── ActivityTimeline
      └── EmptyState
```

---

## 🔌 API & Data Flow

1. **Service Query (`services/dashboard.service.ts`)**:
   - Calls `GET /dashboard` endpoint using the configured Axios `apiClient`.
2. **State Management**:
   - Orchestrated via TanStack Query's `useQuery` hook (`['dashboardOverview']`).
   - Retries: 1.
   - Cache staleness: 30 seconds (`staleTime: 30000`).
3. **Loading States**:
   - Employs `DashboardSkeleton` layout to mirror dashboard structures, reducing layout shifts.
4. **Error Boundaries**:
   - Catches server/network timeouts and prompts the user with an `ErrorState` retry action.

---

## ♿ Accessibility & Responsive Layouts

- **Responsive Breakpoints**:
  - Grid structures automatically adjust column counts (`grid-cols-1`, `sm:grid-cols-2`, `lg:grid-cols-4`) to support mobile and tablet displays.
  - Search elements and detailed user text are contextually hidden on compact viewports to maintain spacing and visual aesthetics.
- **Accessibility features**:
  - Focus outlines are configured on dropdown links, quick-action buttons, and search inputs.
  - Standard HTML5 semantic sections (`nav`, `main`, `aside`, `header`) divide layouts.
  - Appropriate interactive attributes (`aria-expanded`, `aria-label`, `aria-haspopup`) are integrated.
