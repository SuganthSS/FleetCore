# SPEC-070 — Tracking Service Layer

## Objective

Implement the framework-independent business logic layer for the Tracking module.

---

## Files Created

backend/src/modules/tracking/services/tracking.service.ts
backend/src/modules/tracking/services/index.ts

## Files Updated

backend/src/modules/tracking/index.ts
docs/backend/tracking-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Service Methods Implemented

1. `createTracking(input)`
   - Verifies Company, Vehicle, and Trip existence & company scoping (`vehicle.companyId === companyId`, `trip.companyId === companyId`).
   - If `driverId` supplied, verifies Driver exists & company scoping (`driver.companyId === companyId`).
   - **Cross-Entity Integrity**: Enforces `trip.vehicleId === vehicleId` and `trip.driverId === driverId`.
   - Return created `VehicleLocationHistory` record with `vehicle`, `trip`, `driver`, `company` relations included.

2. `getTrackingById(id, companyId?)`
   - Retrieve single `VehicleLocationHistory` entry by UUID with full relations.
   - Enforce tenant isolation.

3. `getTrackingHistory(query, companyId?)`
   - Pagination with metadata (`items`, `total`, `page`, `limit`, `totalPages`).
   - Filters: `tripId`, `vehicleId`, `driverId`, `companyId`.
   - Sorting: `createdAt`, `recordedAt`, `speed`.

4. `updateTracking(id, input, companyId?)`
   - Verify existence & tenant isolation.
   - Re-verify Vehicle/Trip/Driver company alignment and Trip-Vehicle/Driver relationship integrity if modified.
   - Return updated record with relations.

5. `deleteTracking(id, companyId?)`
   - Verify existence & tenant isolation.
   - Hard delete.

---

## Git

git commit -m "feat(tracking): add service layer"
git push origin main
