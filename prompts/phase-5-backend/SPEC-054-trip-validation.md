# SPEC-054 — Trip Validation Layer

## Objective

Implement the validation layer for the Trip module using Zod, following the exact architecture and conventions established by the Vehicle, Driver, Customer, Shipment, and Route modules.

---

## Schemas Implemented

### createTripSchema
Fields: tripNumber (required, max 50), shipmentId (required UUID), vehicleId (required UUID), driverId (required UUID), routeId (required UUID), companyId (required UUID), plannedStartTime (required ISO datetime), plannedEndTime (optional ISO datetime), actualStartTime (optional ISO datetime), actualEndTime (optional ISO datetime), status (Prisma TripStatus enum, optional).

### updateTripSchema
Derived using createTripSchema.partial()

### tripIdParamSchema
id — UUID

### tripQuerySchema
page (default 1), limit (default 10, max 100), search, status, vehicleId, driverId, shipmentId, routeId, companyId, sortBy (createdAt|tripNumber|plannedStartTime|actualStartTime), sortOrder (asc|desc)

---

## Inferred Types

CreateTripInput, UpdateTripInput, TripIdInput, TripQueryInput

---

## Git

git commit -m "feat(trip): add validation layer"
git push origin main
