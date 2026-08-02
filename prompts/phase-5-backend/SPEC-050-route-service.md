# SPEC-050 — Route Service Layer

## Objective

Implement the complete business logic layer for the Route module following the exact architectural conventions established in the Vehicle, Driver, Customer, and Shipment modules.

---

## Files Created

backend/src/modules/route/services/route.service.ts
backend/src/modules/route/services/index.ts

## Files Updated

backend/src/modules/route/index.ts
docs/backend/route-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Methods Implemented

1. `createRoute(input: CreateRouteInput)`
   - Verify Company exists.
   - Reject duplicate `routeCode`.
   - Create Route.
   - Return Route with company relation.

2. `getRouteById(id: string, companyId?: string)`
   - Fetch by UUID with optional tenant scoping.
   - Cross-tenant access returns Not Found.

3. `getRoutes(query: RouteQueryInput, companyId?: string)`
   - Paginated listing with search (`routeCode`, `name`, `origin`, `destination`), filters (`routeType`, `status`, `companyId`), and sorting (`createdAt`, `routeCode`, `name`, `distance`).

4. `updateRoute(id, input, companyId?)`
   - Verify Route exists & tenant isolation.
   - Unique check on `routeCode`.
   - Update and return.

5. `deleteRoute(id, companyId?)`
   - Verify Route exists & tenant isolation.
   - Hard delete.

---

## Git

git commit -m "feat(route): add service layer"
git push origin main
