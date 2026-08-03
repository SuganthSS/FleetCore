# Customer Management Module Documentation

## Overview
The Customer Management module provides a complete enterprise dashboard and profile directory for managing client organizations, key contacts, account statuses, and shipping relationships across the FleetCore SaaS platform.

## Key Components

- **`CustomerHeader`**: Renders section title, total active customer counts, CSV data export action, list refresh button, and 'Add Customer' modal trigger.
- **`CustomerKPICards`**: 6 interactive KPI cards displaying Total Customers, Active Accounts, Inactive Accounts, VIP Enterprise, Corporate, and Individual Accounts with dynamic filtering.
- **`CustomerToolbar`**: Multi-parameter search bar, status filter dropdowns, type filter dropdowns, sorting options, view switcher (`table` vs `cards`), and clear filters action.
- **`CustomerTable`**: High-density tabular layout with sorting columns, company initial avatars, inline shipment counts, status badges, and action menus.
- **`CustomerCards`**: Responsive grid-card layout for visual account scanning.
- **`CustomerDrawer`**: Slide-over drawer providing quick access to organization details, contact information, billing terms, and shipment history.
- **`CustomerModal`**: Form modal powered by React Hook Form and Zod validation for creating and editing customer profiles.
- **`CustomerProfilePage`**: Full customer profile view at `/customers/:id` featuring tabs for Company Info, Primary Contacts, Billing Details, Shipment History, Activity Log, and Notes.

## API Integration & State Management
- Utilizes **TanStack Query** (`useQuery` and `useMutation`) for asynchronous data fetching and cache management.
- Connects directly to backend REST endpoints defined in `/api/v1/customers`.
