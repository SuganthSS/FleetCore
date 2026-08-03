# Enterprise Driver Management Documentation (SPEC-109)

## Overview
The **Driver Management Module** was rebuilt to match the **Stitch MCP design specifications** for the FleetCore SaaS Platform. It provides end-to-end administration for organization drivers, incorporating real-time telemetry metrics, license compliance tracking, vehicle assignments, and interactive slide-out drawers.

---

## Component Architecture

### 1. `DriverHeader`
- **Location**: `frontend/src/components/driver/DriverHeader.tsx`
- **Features**: Displays total driver count badge, quick action button ("Add Driver"), directory refresh trigger, and CSV export action.

### 2. `DriverKPICards`
- **Location**: `frontend/src/components/driver/DriverKPICards.tsx`
- **Features**: Interactive metric summary grid tracking:
  - Total Fleet Drivers
  - Available / Ready
  - Active On Trip
  - Off Duty / Leave
  - Expiring License (≤ 30 Days)
  - Suspended
- Clicking any KPI card dynamically filters the table/grid view.

### 3. `DriverToolbar`
- **Location**: `frontend/src/components/driver/DriverToolbar.tsx`
- **Features**: Debounced search input, status filters, experience level filter dropdowns, sorting options (Date added, ID, Expiry), and table vs grid cards view mode toggle.

### 4. `DriverTable` & `DriverCards`
- **Location**: `frontend/src/components/driver/DriverTable.tsx` & `DriverCards.tsx`
- **Features**: High-density table with sticky headers, initials avatars, contact badges, CDL license status pills, safety score ratings, hover actions, and responsive card views.

### 5. `DriverDrawer` & `DriverProfilePage`
- **Location**: `frontend/src/components/driver/DriverDrawer.tsx` & `frontend/src/pages/DriverProfilePage.tsx`
- **Features**: Multi-tab drawers and full-page profile views (`/drivers/:id`) covering:
  - **Overview**: Personal info, emergency contacts, assigned vehicle card.
  - **License & Certifications**: CDL details, HAZMAT permits, medical checks.
  - **Safety & Performance**: Telematics safety score, fuel efficiency, hard braking events.
  - **Assigned Trips**: Real-time route tracking and trip history.

---

## Technical Details

- **Design System**: Strict alignment with Stitch `Driver Management - FleetCore` screen.
- **State Management**: TanStack Query (`useQuery`, `useMutation`) with optimistic cache updates.
- **Forms**: React Hook Form + Zod schema validation.
- **Backend API**: Reuses existing `/api/v1/drivers` REST endpoints with multi-tenant company isolation.
