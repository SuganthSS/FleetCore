# SPEC-065 — Maintenance Service Layer

## Objective

Implement the framework-independent business logic layer for the Maintenance module.

---

## Files Created

backend/src/modules/maintenance/services/maintenance.service.ts
backend/src/modules/maintenance/services/index.ts

## Files Updated

backend/src/modules/maintenance/index.ts
docs/backend/maintenance-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Service Methods Implemented

1. `createMaintenance(input)`
   - Verify Company and Vehicle existence & company scoping (`vehicle.companyId === companyId`).
   - If `driverId` supplied, verify Driver exists & company scoping (`driver.companyId === companyId`).
   - Auto-generate `MAINT-` work order reference.
   - Return created record with `vehicle`, `driver`, `company` relations included.

2. `getMaintenanceById(id, companyId?)`
   - Retrieve by UUID with `vehicle`, `driver`, `company` relations.
   - Enforce tenant isolation.

3. `getMaintenances(query, companyId?)`
   - Pagination with metadata (`items`, `total`, `page`, `limit`, `totalPages`).
   - Search across `description`, `serviceProvider`, and `maintenanceRecordNumber`.
   - Filters: `vehicleId`, `companyId`, `maintenanceType`, `status`.
   - Sorting: `createdAt`, `scheduledDate`, `completedDate`, `estimatedCost`, `actualCost`.

4. `updateMaintenance(id, input, companyId?)`
   - Verify existence & tenant isolation.
   - Re-verify Vehicle/Driver company alignment if modified.
   - Return updated record with relations.

5. `deleteMaintenance(id, companyId?)`
   - Verify existence & tenant isolation.
   - Hard delete.

---

## Git

git commit -m "feat(maintenance): add service layer"
git push origin main
