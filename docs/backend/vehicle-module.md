# FleetCore Vehicle Module Documentation

**Module**: Vehicle Management (`backend/src/modules/vehicle`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Controller, Service & Validation Layers Implemented  

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

## ⚙️ Vehicle Service Layer (`services/vehicle.service.ts`)

The `VehicleService` class provides framework-independent CRUD operations and business rules.

### Service Methods

#### `createVehicle(input: CreateVehicleInput): Promise<Vehicle>`
- **Business Rules**:
  1. Verifies parent `Company` exists via `companyId`.
  2. Ensures `registrationNumber` is unique across all vehicles.
  3. Ensures `vin` is unique across all vehicles.
- **Return**: Full created `Vehicle` Prisma record.

#### `getVehicleById(id: string): Promise<Vehicle>`
- **Business Rules**:
  1. Fetches vehicle by UUID including basic company metadata.
  2. Throws error if record is not found (`Vehicle with ID '...' not found.`).

#### `getVehicles(query: VehicleQueryInput, companyId?: string): Promise<PaginatedVehicleResult>`
- **Business Rules**:
  1. Applies pagination (`page`, `limit`, `skip`).
  2. Filters by `status`, `vehicleType`, `fuelType`, and `companyId` (for multi-tenant scoping).
  3. Performs case-insensitive search across `registrationNumber`, `vin`, `make`, and `model`.
  4. Returns structured metadata: `{ items, total, page, limit, totalPages }`.

#### `updateVehicle(id: string, input: UpdateVehicleInput): Promise<Vehicle>`
- **Business Rules**:
  1. Ensures target vehicle exists.
  2. If `registrationNumber` is changed, checks for duplicate registration.
  3. If `vin` is changed, checks for duplicate VIN.
- **Return**: Updated `Vehicle` record.

#### `deleteVehicle(id: string): Promise<Vehicle>`
- **Business Rules**:
  1. Ensures target vehicle exists.
  2. Executes physical delete in Prisma database.

---

## 🎮 Vehicle Controller Layer (`controllers/vehicle.controller.ts`)

The `VehicleController` provides thin Express request handlers that perform Zod input validation, delegate logic to `VehicleService`, and standardize HTTP responses.

### Request Lifecycle
```text
HTTP Request ➔ Express Router ➔ Auth/RBAC Middleware ➔ VehicleController ➔ Zod Validation ➔ VehicleService ➔ Prisma Client ➔ Standardized HTTP Response
```

### Standardized Response Formats

#### Success Response
```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": { ... }
}
```

#### Validation Error (HTTP 400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Registration number is required",
    "Invalid Company ID UUID format"
  ]
}
```

#### Resource Not Found (HTTP 404)
```json
{
  "success": false,
  "message": "Vehicle with ID '...' not found."
}
```

#### Conflict Error (HTTP 409)
```json
{
  "success": false,
  "message": "Vehicle with registration number '...' already exists."
}
```

---

## 🏷️ Exported TypeScript Types & Instances

```typescript
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleIdInput,
  VehicleQueryInput,
  PaginatedVehicleResult,
  vehicleService,
  vehicleController,
} from './modules/vehicle';
```
