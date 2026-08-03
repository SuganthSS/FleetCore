# Enterprise User Management Architecture

## Overview
The Enterprise User Management module in FleetCore provides Administrators with complete control over employee access, role-based access control (RBAC), account lifecycle statuses, and security credentials within a single-enterprise logistics organization.

The UI design is built directly from the **"User Management - FleetCore"** screen in the Stitch MCP.

---

## Technical Stack & Libraries
- **Framework**: React 18 + TypeScript
- **State & Data Fetching**: TanStack Query (`@tanstack/react-query`)
- **Form Management & Validation**: React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS + Tailwind CSS (Stitch enterprise design system tokens)

---

## Frontend Architecture

### Core Components (`frontend/src/components/user/`)

1. **`UserToolbar.tsx`**
   - Real-time search bar (name, email)
   - Role dropdown filter (`Administrator`, `Fleet Manager`, `Dispatcher`, `Maintenance Manager`, `Accountant`, `Driver`)
   - Account status filter (`ACTIVE`, `INACTIVE`, `SUSPENDED`)
   - Clear filters action & "Add Employee" modal trigger.

2. **`UserTable.tsx`**
   - Responsive employee data table.
   - Column sorting & row selection checkboxes for bulk operations.
   - Initial avatar rendering (`UserAvatar.tsx`).
   - Visual role badges (`RoleBadge.tsx`) & status indicators (`StatusBadge.tsx`).
   - Contextual actions dropdown menu (View Details, Edit Profile, Reactivate/Deactivate, Reset Password, Soft Delete).

3. **`UserDrawer.tsx`**
   - Slide-over detail panel for individual employee profiles.
   - Displays full contact information, role assignments, system audit timestamps (registered date, last login).
   - Quick action shortcuts for profile editing and password resets.

4. **`UserModal.tsx`**
   - Dialog for creating new enterprise employees and editing existing employee records.
   - Schema validation powered by Zod (`userFormSchema`).
   - Role dropdown dynamic populator.

5. **`ResetPasswordModal.tsx`**
   - Administrative password reset modal.
   - Validates minimum length and password confirmation.

6. **`BulkActions.tsx`**
   - Floating batch actions toolbar when rows are selected.
   - Supports bulk activation, bulk deactivation, and JSON data export.

7. **`UserSkeleton.tsx`, `UserEmptyState.tsx`, `UserErrorState.tsx`**
   - Comprehensive UI state handling during initial load, zero-match searches, or network error states.

---

## Backend Integration

The frontend connects directly to backend User CRUD APIs (`/api/v1/users`):

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/users` | Fetches paginated list of users with search, role, and status filters. |
| `GET` | `/api/v1/users/meta/roles` | Fetches available system RBAC roles. |
| `GET` | `/api/v1/users/:id` | Fetches single user record. |
| `POST` | `/api/v1/users` | Creates a new user record. |
| `PUT` | `/api/v1/users/:id` | Updates user details. |
| `PATCH` | `/api/v1/users/:id/status` | Toggles account status (`ACTIVE`, `INACTIVE`, `SUSPENDED`). |
| `PATCH` | `/api/v1/users/:id/reset-password` | Resets user password. |
| `DELETE` | `/api/v1/users/:id` | Soft deletes user account. |

---

## Enterprise RBAC & Security Rules
- Access to User Management is restricted to the **Administrator** role.
- Single-organization model: Tenant switchers and company selectors are eliminated.
