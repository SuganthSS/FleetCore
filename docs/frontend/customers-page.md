# Customers Management Page Documentation (SPEC-088)

This document provides a comprehensive guide to the frontend architecture and implementation of the **Customers Management Page** in the FleetCore platform.

---

## 🏗️ Architecture & Component Tree

The page uses a modular, component-driven design layout integrated into the secure, authenticated `DashboardLayout`.

### Component Tree
```mermaid
graph TD
  AppRouter --> ProtectedRoute
  ProtectedRoute --> DashboardLayout
  DashboardLayout --> CustomersPage
  CustomersPage --> PageHeader
  CustomersPage --> CustomerToolbar
  CustomersPage --> CustomerTable
  CustomersPage --> CustomerSkeleton
  CustomersPage --> CustomerModal
  CustomersPage --> CustomerDetailsDrawer
  CustomersPage --> ConfirmDialog
  CustomerTable --> CustomerStatusBadge
  CustomerTable --> CustomerTypeBadge
```

---

## 🗃️ State Management & Data Flow

State management follows the established TanStack Query pattern, keeping client components lightweight and synchronization-focused.

- **Query Cache (`['customers', ...]`)**: Stores server-state customer listings. Cache invalidates automatically on successful mutations (create, update, or delete).
- **Local Filter State**: Maintains reactive variables for `search`, `status`, and `type` queries.
- **Client-Side Type Resolution**: Since the backend `Customer` table does not store a strict `customerType` field, it is derived deterministically on the client using a scoring hash based on the customer UUID string. Filter selections for type are processed via client-side array filtration.

---

## 🔌 API Integration

All transactions use the RESTful `apiClient` mapping to the backend customer router:

| HTTP Method | API Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/customers` | Fetch paginated list of customers (with optional search & status filter) |
| **GET** | `/api/v1/customers/:id` | Retrieve detailed profile for a single customer |
| **POST** | `/api/v1/customers` | Record a new customer profile |
| **PUT** | `/api/v1/customers/:id` | Update an existing customer profile |
| **DELETE** | `/api/v1/customers/:id` | Hard delete customer record |

### Page Query Lifecycle
1. The user navigates to `/customers`.
2. `CustomersPage` mounts, initiating the `useQuery` call.
3. The page renders the `CustomerSkeleton` during loading.
4. On success, `CustomerTable` presents data with sorting, responsive columns, and actions.
5. On failure, `ErrorState` handles retry triggers.

---

## 🎨 Design & Theme Alignment

The interface adheres to the FleetCore design system, emphasizing clean hierarchy and consistent layout dimensions:

- **Typography**: Inter / Outfit fonts.
- **Color Palette**: Deep Navy card headers, FleetCore Orange active buttons, emerald/rose status tags, and cool-gray backdrop shadows.
- **Micro-Animations**: Uses `animate-scale-up` for modal dialogues, `animate-slide-in` for the side drawer, and subtle opacity transitions for table action rows.
- **Accessibility**: Includes proper ARIA tags, descriptive keyboard navigation cues, and distinct contrast focus rings.
