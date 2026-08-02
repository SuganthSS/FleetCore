# SPEC-059 — Fuel Validation Layer

## Objective

Implement the validation layer for the Fuel module using Zod.

---

## Schemas Implemented

### createFuelRecordSchema
Fields: vehicleId (required UUID), companyId (required UUID), tripId (optional UUID), fuelDate (required ISO datetime), fuelStation (required, trimmed, max 150), quantity (required positive number), pricePerUnit (required positive number), totalCost (required positive number), odometerReading (required positive integer), receiptNumber (optional, trimmed, max 100), notes (optional, trimmed, max 500).

### updateFuelRecordSchema
Derived using createFuelRecordSchema.partial()

### fuelRecordIdParamSchema
id — UUID

### fuelRecordQuerySchema
page (default 1), limit (default 10, max 100), search, vehicleId, tripId, companyId, sortBy (createdAt|fuelDate|totalCost|odometerReading), sortOrder (asc|desc)

---

## Inferred Types

CreateFuelRecordInput, UpdateFuelRecordInput, FuelRecordIdInput, FuelRecordQueryInput

---

## Git

git commit -m "feat(fuel): add validation layer"
git push origin main
