# SPEC-049 — Route Validation Layer

## Objective

Implement the complete validation layer for the Route module following the exact architecture used by the Vehicle, Driver, Customer, and Shipment modules.

---

## Schemas Implemented

### createRouteSchema
Fields: routeCode (required, max 50), name (required, max 150), description (optional, max 500), origin (required, max 200), destination (required, max 200), distance (required, positive number), estimatedDuration (required, positive integer), routeType (Prisma RouteType enum, optional), status (Prisma RouteStatus enum, optional), companyId (required UUID).

### updateRouteSchema
Derived from createRouteSchema.partial()

### routeIdParamSchema
id — UUID

### routeQuerySchema
page (default 1), limit (default 10, max 100), search, routeType, status, companyId, sortBy (createdAt|routeCode|name|distance), sortOrder (asc|desc)

---

## Inferred Types

CreateRouteInput, UpdateRouteInput, RouteIdInput, RouteQueryInput

---

## Git

git commit -m "feat(route): add validation layer"
git push origin main
