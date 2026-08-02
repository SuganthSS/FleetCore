# SPEC-055 — Trip Service Layer

## Objective

Implement the Trip service layer following the architecture established across FleetCore.

---

## Files Created

backend/src/modules/trip/services/trip.service.ts
backend/src/modules/trip/services/index.ts

## Files Updated

backend/src/modules/trip/index.ts
docs/backend/trip-module.md
docs/AI-DEVELOPMENT-LOG.md

---

## Service Methods Implemented

1. `createTrip(input)`
   - Verify Company, Shipment, Vehicle, Driver, Route exist.
   - Reject cross-company entity relationships (`companyId` alignment across all).
   - Reject duplicate `tripNumber`.
   - Create Trip with relations (`shipment`, `vehicle`, `driver`, `route`, `company`).

2. `getTripById(id, companyId?)`
   - Retrieve Trip by UUID with full relations.
   - Enforce tenant isolation.

3. `getTrips(query, companyId?)`
   - Pagination with metadata (`items`, `total`, `page`, `limit`, `totalPages`).
   - Search across `tripNumber`, `shipment.shipmentNumber`, `vehicle.registrationNumber`, `driver.employeeId`, `route.routeCode`.
   - Filters: `status`, `vehicleId`, `driverId`, `shipmentId`, `routeId`, `companyId`.
   - Sorting: `createdAt`, `tripNumber`, `plannedStartTime` (`scheduledStartTime`), `actualStartTime`.

4. `updateTrip(id, input, companyId?)`
   - Verify existence & tenant isolation.
   - Duplicate `tripNumber` check.
   - Re-verify cross-company alignment if relations change.

5. `deleteTrip(id, companyId?)`
   - Verify existence & tenant isolation.
   - Hard delete.

---

## Git

git commit -m "feat(trip): add service layer"
git push origin main
