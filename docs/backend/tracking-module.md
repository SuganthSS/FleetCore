# FleetCore Tracking Module Documentation

**Module**: Tracking & Location History (`backend/src/modules/tracking`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation Layer Implemented  

---

## 📐 Validation Schemas (`validators/tracking.validator.ts`)

The Tracking validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createTrackingSchema`
Validates requests for recording GPS location breadcrumb data points (`VehicleLocationHistory`).

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `tripId` | String | Required, valid UUID | Associated active Trip UUID |
| `vehicleId` | String | Required, valid UUID | Tracked Vehicle UUID |
| `companyId` | String | Required, valid UUID | Parent Company UUID |
| `driverId` | String | Optional, valid UUID | Active Driver UUID |
| `latitude` | Number | Required, float between -90 and +90 | Latitude coordinate |
| `longitude` | Number | Required, float between -180 and +180 | Longitude coordinate |
| `speed` | Number | Optional, float $\ge 0$ | Vehicle speed (km/h) |
| `heading` | Number | Optional, float $0 \le heading \le 360$ | Direction heading degrees |
| `altitude` | Number | Optional, float | Altitude elevation (meters) |
| `accuracy` | Number | Optional, float $\ge 0$ | GPS accuracy radius |
| `recordedAt` | String | Required, ISO datetime string | Location ping timestamp |
| `address` | String | Optional, trimmed, max 255 chars | Reverse geocoded address |
| `city` | String | Optional, trimmed, max 100 chars | City |
| `state` | String | Optional, trimmed, max 100 chars | State / Province |
| `country` | String | Optional, trimmed, max 100 chars | Country |
| `postalCode` | String | Optional, trimmed, max 20 chars | Postal / Zip Code |

### 2. `updateTrackingSchema`
Validates requests for updating an existing location history entry. All fields from `createTrackingSchema` are marked optional via `.partial()`.

### 3. `trackingIdParamSchema`
Validates path parameters for single location entry operations (e.g., `GET /api/v1/tracking/:id`).
- `id`: Required valid UUID string.

### 4. `trackingQuerySchema`
Validates query params for filtering, searching, sorting, and paginating tracking location listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional search string.
- `tripId`: Optional Trip UUID filter.
- `vehicleId`: Optional Vehicle UUID filter.
- `companyId`: Optional Company UUID filter.
- `driverId`: Optional Driver UUID filter.
- `sortBy`: Optional enum field name (`createdAt`, `recordedAt`, `speed`). Default: `recordedAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  createTrackingSchema,
  updateTrackingSchema,
  trackingIdParamSchema,
  trackingQuerySchema,
  CreateTrackingInput,
  UpdateTrackingInput,
  TrackingIdInput,
  TrackingQueryInput,
} from './modules/tracking';
```
