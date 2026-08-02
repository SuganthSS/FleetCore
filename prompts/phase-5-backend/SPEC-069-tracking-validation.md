# SPEC-069 — Tracking Validation Layer

## Objective

Implement the validation layer for the Tracking module using Zod.

---

## Schemas Implemented

### createTrackingSchema
Fields: tripId (required UUID), vehicleId (required UUID), companyId (required UUID), driverId (optional UUID), latitude (-90 to +90), longitude (-180 to +180), speed (optional non-negative), heading (optional 0-360), altitude (optional number), accuracy (optional non-negative), recordedAt (required ISO datetime), address (optional max 255), city (optional max 100), state (optional max 100), country (optional max 100), postalCode (optional max 20).

### updateTrackingSchema
Derived using createTrackingSchema.partial()

### trackingIdParamSchema
id — UUID

### trackingQuerySchema
page (default 1), limit (default 10, max 100), search, tripId, vehicleId, companyId, driverId, sortBy (createdAt|recordedAt|speed), sortOrder (asc|desc)

---

## Inferred Types

CreateTrackingInput, UpdateTrackingInput, TrackingIdInput, TrackingQueryInput

---

## Git

git commit -m "feat(tracking): add validation layer"
git push origin main
