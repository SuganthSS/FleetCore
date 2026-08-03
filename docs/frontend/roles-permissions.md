# Enterprise Roles & Permissions Module (SPEC-105)

## Overview
The **Roles & Permissions** module provides an enterprise-grade Role-Based Access Control (RBAC) interface for FleetCore. Recreated from the **Roles & Permissions - FleetCore** Stitch design, it establishes security management across 17 module categories with fine-grained action capabilities.

---

## Stitch MCP Integration
- **Project**: `FleetCore SaaS Platform`
- **Screen**: `Roles & Permissions - FleetCore` (`projects/15240126372965429450/screens/f6b65140cdbd443cbee86d65f7ce2966`)
- **Fidelity**: Rebuilt cards, table views, capability matrix grid, slide-over drawer, and permission badges to match Stitch tokens.

---

## Single-Organization & Enterprise Roles
The application strictly enforces a single logistics organization architecture.

### Supported Roles
1. **Administrator**: Global system privileges across all 17 categories. Privileges are immutable.
2. **Fleet Manager**: Full operational control over vehicles, drivers, trips, and maintenance.
3. **Dispatcher**: Manages live route assignments, shipments, and real-time tracking.
4. **Maintenance Manager**: Handles work orders, parts inventory, and vehicle servicing.
5. **Accountant**: Access to financial metrics, fuel logs, and billing reports.
6. **Driver**: Mobile/tablet portal view for assigned trips and vehicle logs.

---

## System Capability Categories & Actions

### Categories
- Dashboard, Users, Vehicles, Drivers, Trips, Routes, Shipments, Fuel, Maintenance, Tracking, Notifications, Reports, Analytics, AI, Settings, Documents, Audit Logs.

### Actions
- `View`, `Create`, `Edit`, `Delete`, `Export`, `Approve`, `Assign`, `Manage`.

---

## Component Architecture

```
frontend/src/components/role/
├── RoleHeader.tsx          # Title & Overview KPI Cards
├── RoleToolbar.tsx         # Search, Role Type Filter, and View Mode Selector (Cards | Matrix | Table)
├── RoleCard.tsx            # High-density role cards with capability badges
├── RoleTable.tsx           # Tabular view of role records and user assignment counts
├── PermissionMatrix.tsx    # Interactive cross-module privilege grid
├── PermissionGroup.tsx     # Checkbox category groups for role drawer
├── PermissionBadge.tsx     # Color-coded action capability pill badges
├── RoleDrawer.tsx          # Slide-over detailed role drawer with permission editor
├── RoleSkeleton.tsx        # Animated loading skeleton
├── RoleEmptyState.tsx      # Empty state for zero filter matches
└── RoleErrorState.tsx      # Network error boundary element
```

---

## Backend API Contract

### Exposed Endpoints (`/api/v1/roles`)
| Method | Endpoint | Description | Guard |
|--------|----------|-------------|-------|
| `GET` | `/api/v1/roles` | Retrieve all enterprise roles with assigned user counts | `Administrator` |
| `GET` | `/api/v1/roles/permissions` | Retrieve permission matrix taxonomy (categories & actions) | `Administrator` |
| `GET` | `/api/v1/roles/:id` | Retrieve single role detail by ID | `Administrator` |
| `PUT` | `/api/v1/roles/:id/permissions` | Update permission capabilities for a custom/system role | `Administrator` |

---

## Quality & Validation
- **TypeScript**: 100% strict type safety (`RoleDetail`, `PermissionCategory`, `PermissionAction`).
- **State Management**: TanStack Query (`useQuery`, `useMutation`) with automatic cache invalidation (`roles`, `roles-matrix`).
- **Build Verification**: Tested via `npm run build` with zero errors.
