# SPEC-060 — Fuel Service Layer

## Objective

Implement the framework-independent business logic layer for the Fuel module.

---

## Files Created

backend/src/modules/fuel/services/fuel.service.ts
backend/src/modules/fuel/services/index.ts

## Files Updated

backend/src/modules/fuel/index.ts
docs/backend/fuel-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Service Methods Implemented

1. `createFuelRecord(input)`
   - Verify Company and Vehicle existence.
   - Verify Vehicle belongs to specified Company.
   - If `tripId` supplied, verify Trip exists, belongs to Company, and `trip.vehicleId === vehicleId`.
   - Reject duplicate `receiptNumber` if supplied.
   - Return created record with `vehicle`, `trip`, `company` relations included.

2. `getFuelRecordById(id, companyId?)`
   - Retrieve by UUID with `vehicle`, `trip`, `company` relations.
   - Enforce tenant isolation.

3. `getFuelRecords(query, companyId?)`
   - Pagination with metadata (`items`, `total`, `page`, `limit`, `totalPages`).
   - Search across `fuelStation`, `receiptNumber` (`stationLocation`), and `fuelRecordNumber`.
   - Filters: `vehicleId`, `tripId`, `companyId`.
   - Sorting: `createdAt`, `fuelDate` (`refueledAt`), `totalCost`, `odometerReading`.

4. `updateFuelRecord(id, input, companyId?)`
   - Verify existence & tenant isolation.
   - Reject duplicate `receiptNumber` if modified.
   - Re-verify Vehicle/Trip company alignment and `trip.vehicleId` match if modified.
   - Return updated record with relations.

5. `deleteFuelRecord(id, companyId?)`
   - Verify existence & tenant isolation.
   - Hard delete.

---

## Git

git commit -m "feat(fuel): add service layer"
git push origin main
