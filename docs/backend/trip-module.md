# FleetCore Trip Module Documentation

**Module**: Trip Management (`backend/src/modules/trip`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation Layer Implemented  

---

## 📐 Validation Schemas (`validators/trip.validator.ts`)

The Trip validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createTripSchema`
Validates requests for creating a new Trip execution record.

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `tripNumber` | String | Required, trimmed, max 50 chars | Unique operational trip identification number |
| `shipmentId` | String | Required, valid UUID | Associated Shipment UUID |
| `vehicleId` | String | Required, valid UUID | Assigned Vehicle UUID |
| `driverId` | String | Required, valid UUID | Assigned Driver UUID |
| `routeId` | String | Required, valid UUID | Planned Route UUID |
| `companyId` | String | Required, valid UUID | Parent Company UUID |
| `plannedStartTime` | String | Required, ISO datetime string | Scheduled start timestamp |
| `plannedEndTime` | String | Optional, ISO datetime string | Scheduled completion timestamp |
| `actualStartTime` | String | Optional, ISO datetime string | Actual start timestamp |
| `actualEndTime` | String | Optional, ISO datetime string | Actual completion timestamp |
| `status` | Enum | Optional, `TripStatus` (`SCHEDULED`, `DISPATCHED`, `IN_TRANSIT`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `DELAYED`) | Native Prisma Enum |

### 2. `updateTripSchema`
Validates requests for updating an existing trip execution. All fields from `createTripSchema` are marked optional via `.partial()`.

### 3. `tripIdParamSchema`
Validates path parameters for single-trip operations (e.g., `GET /api/v1/trips/:id`).
- `id`: Required valid UUID string.

### 4. `tripQuerySchema`
Validates query params for filtering, searching, sorting, and paginating trip listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional search string (searches `tripNumber`).
- `status`: Optional `TripStatus` enum filter.
- `vehicleId`: Optional Vehicle UUID filter.
- `driverId`: Optional Driver UUID filter.
- `shipmentId`: Optional Shipment UUID filter.
- `routeId`: Optional Route UUID filter.
- `companyId`: Optional Company UUID filter.
- `sortBy`: Optional enum field name (`createdAt`, `tripNumber`, `plannedStartTime`, `actualStartTime`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  createTripSchema,
  updateTripSchema,
  tripIdParamSchema,
  tripQuerySchema,
  CreateTripInput,
  UpdateTripInput,
  TripIdInput,
  TripQueryInput,
} from './modules/trip';
```
