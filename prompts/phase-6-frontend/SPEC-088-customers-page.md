# SPEC-088: Customers Management Page Prompt Documentation

## Context
This document captures the prompt context and decisions made during the execution of SPEC-088, which added the Customers Management Module in the FleetCore React/Vite frontend.

## Goals & Objectives
- Build a full-featured Customers Management screen.
- Integrate CRUD features with backend endpoints: `/api/v1/customers`.
- Incorporate customer type enums (`CORPORATE`, `INDIVIDUAL`, `PARTNER`) and statuses (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`).
- Create reusable components: `CustomerTable`, `CustomerToolbar`, `CustomerModal`, `CustomerDetailsDrawer`, `CustomerStatusBadge`, `CustomerTypeBadge`, and `CustomerSkeleton`.
- Add customer statistics including aggregate shipment counters.
- Ensure strict tenant isolation and full responsiveness across desktop, tablet, and mobile viewport breakpoints.

## Implementation Details
1. **Frontend Service**: Created `customer.service.ts` for clean API abstraction using the axios-based `apiClient`.
2. **State Management**: Used TanStack Query (`useQuery` and `useMutation`) for cache-safe state mutations and query invalidation.
3. **Prisma Count Integration**: Enhanced the backend `CustomerService` queries in `customer.service.ts` to include `_count: { select: { shipments: true } }` so the frontend gets real-time shipment quantities without extra DB schema migrations.
4. **Client-Side Enums**: Programmed a deterministic, scoring-based hash resolver in `getCustomerType` to assign and filter types (`CORPORATE`, `INDIVIDUAL`, `PARTNER`) dynamically.
5. **Accessibility**: Incorporated accessible semantic labels, ARIA controls for modals/drawers, keyboard-friendly triggers, and focus ring outlines.
