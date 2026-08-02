# FleetCore Tracking Module Documentation

**Module**: Tracking & Location History (`backend/src/modules/tracking`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation & Service Layers Implemented  

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

## ⚙️ Tracking Service Layer (`services/tracking.service.ts`)

The `TrackingService` class manages vehicle location breadcrumb entries (`VehicleLocationHistory`), tenant isolation, and strict cross-entity relationship verification.

### Business Rules & Tenant Isolation
1. **`createTracking(input: CreateTrackingInput)`**:
   - Verifies existence of `Company`, `Vehicle`, and `Trip`.
   - **Tenant Scoping**: Verifies `Vehicle.companyId === input.companyId`, `Trip.companyId === input.companyId`, and optional `Driver.companyId === input.companyId`.
   - **Cross-Entity Association Guards**:
     - Verifies `Trip.vehicleId === input.vehicleId`.
     - Verifies `Trip.driverId === input.driverId` (if `driverId` is provided).
   - Includes `vehicle`, `trip`, `driver`, and `company` relations in response.
2. **`getTrackingById(id: string, companyId?: string)`**:
   - Retrieves location history entry by UUID with full relations.
   - Enforces multi-tenant isolation when `companyId` is provided (cross-tenant access returns Not Found).
3. **`getTrackingHistory(query: TrackingQueryInput, companyId?: string)`**:
   - Supports paginated listing with `total`, `page`, `limit`, `totalPages` metadata.
   - Enforces company isolation via `companyId`.
   - Supports filters: `tripId`, `vehicleId`, `driverId`, `companyId`.
   - Supports sorting by: `createdAt`, `recordedAt`, `speed`.
4. **`updateTracking(id: string, input: UpdateTrackingInput, companyId?: string)`**:
   - Verifies record exists within company tenant boundary.
   - Re-verifies vehicle/trip/driver company alignment and relationship integrity if modified.
5. **`deleteTracking(id: string, companyId?: string)`**:
   - Verifies record exists within company tenant boundary before hard deletion.

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  trackingService,
  createTrackingSchema,
  updateTrackingSchema,
  trackingIdParamSchema,
  trackingQuerySchema,
  CreateTrackingInput,
  UpdateTrackingInput,
  TrackingIdInput,
  TrackingQueryInput,
  PaginatedTrackingResult,
} from './modules/tracking';
```

