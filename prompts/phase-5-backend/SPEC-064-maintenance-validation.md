# SPEC-064 — Maintenance Validation Layer

## Objective

Implement the validation layer for the Maintenance module using Zod and native Prisma enums (`MaintenanceType`, `MaintenanceStatus`).

---

## Schemas Implemented

### createMaintenanceSchema
Fields: vehicleId (required UUID), companyId (required UUID), driverId (optional UUID), maintenanceType (native enum), status (native enum, default SCHEDULED), title (required max 150), description (optional max 500), scheduledDate (required ISO datetime), completedDate (optional ISO datetime), estimatedCost (optional positive number), actualCost (optional positive number), serviceProvider (optional max 150), odometerReading (optional positive integer), nextMaintenanceDate (optional ISO datetime), notes (optional max 500).

### updateMaintenanceSchema
Derived using createMaintenanceSchema.partial()

### maintenanceIdParamSchema
id — UUID

### maintenanceQuerySchema
page (default 1), limit (default 10, max 100), search (title, serviceProvider), vehicleId, companyId, maintenanceType, status, sortBy (createdAt|scheduledDate|completedDate|estimatedCost|actualCost), sortOrder (asc|desc)

---

## Inferred Types

CreateMaintenanceInput, UpdateMaintenanceInput, MaintenanceIdInput, MaintenanceQueryInput

---

## Git

git commit -m "feat(maintenance): add validation layer"
git push origin main
