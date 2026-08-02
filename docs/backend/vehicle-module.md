# FleetCore Vehicle Module Documentation

**Module**: Vehicle Management (`backend/src/modules/vehicle`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation Layer Implemented  

---

## 📐 Validation Schemas (`validators/vehicle.validator.ts`)

The vehicle validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createVehicleSchema`
Validates requests for registering a new fleet vehicle asset.

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `registrationNumber` | String | Required, trimmed, 1–30 chars | Must be unique per company |
| `vin` | String | Required, trimmed, 1–17 chars | Vehicle Identification Number |
| `make` | String | Required, trimmed, max 100 chars | e.g., Volvo, Scania, Ford |
| `model` | String | Required, trimmed, max 100 chars | e.g., FH16, R500, F-150 |
| `manufacturingYear` | Integer | 1900 to `CurrentYear + 1` | Reasonable year range |
| `vehicleType` | Enum | `VehicleType` (TRUCK, VAN, TRAILER, BUS, CAR, SPECIALIZED) | Native Prisma Enum |
| `fuelType` | Enum | `FuelType` (DIESEL, PETROL, ELECTRIC, HYBRID, CNG, LPG) | Native Prisma Enum |
| `capacity` | Number | Optional, positive number | Cargo payload in kg / m³ |
| `status` | Enum | Optional, `VehicleStatus` (AVAILABLE, ON_TRIP, MAINTENANCE, OUT_OF_SERVICE, DECOMMISSIONED) | Defaults to `AVAILABLE` |
| `companyId` | String | Required, valid UUID | Tenant isolation reference |

### 2. `updateVehicleSchema`
Validates requests for modifying existing vehicle records. All fields from `createVehicleSchema` are marked optional via `.partial()`.

### 3. `vehicleIdParamSchema`
Validates path parameters for single-vehicle operations (e.g. `GET /api/v1/vehicles/:id`).
- `id`: Required UUID string.

### 4. `vehicleQuerySchema`
Validates query params for filtering and paginating vehicle listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional string search filter.
- `status`: Optional `VehicleStatus` enum filter.
- `vehicleType`: Optional `VehicleType` enum filter.
- `fuelType`: Optional `FuelType` enum filter.
- `sortBy`: Optional enum field name (`createdAt`, `registrationNumber`, `make`, `model`, `manufacturingYear`, `status`, `capacity`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## 🏷️ Exported TypeScript Types

```typescript
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleIdInput,
  VehicleQueryInput,
} from './validators/vehicle.validator';
```
