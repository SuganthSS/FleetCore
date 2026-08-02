# FleetCore Fuel Module Documentation

**Module**: Fuel Management (`backend/src/modules/fuel`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation & Service Layers Implemented  

---

## 📐 Validation Schemas (`validators/fuel.validator.ts`)

The Fuel validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createFuelRecordSchema`
Validates requests for recording vehicle refueling operational events.

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `vehicleId` | String | Required, valid UUID | Refueled Vehicle UUID |
| `companyId` | String | Required, valid UUID | Parent Company UUID |
| `tripId` | String | Optional, valid UUID | Associated Trip UUID |
| `fuelDate` | String | Required, ISO datetime string | Refueling timestamp |
| `fuelStation` | String | Required, trimmed, max 150 chars | Name/location of fuel station |
| `quantity` | Number | Required, positive number | Quantity of fuel dispensed |
| `pricePerUnit` | Number | Required, positive number | Price per unit of fuel |
| `totalCost` | Number | Required, positive number | Total cost of refueling |
| `odometerReading` | Number | Required, positive integer | Vehicle odometer reading at refueling |
| `receiptNumber` | String | Optional, trimmed, max 100 chars | Transaction receipt reference |
| `notes` | String | Optional, trimmed, max 500 chars | Operational notes or comments |

### 2. `updateFuelRecordSchema`
Validates requests for updating an existing fuel record. All fields from `createFuelRecordSchema` are marked optional via `.partial()`.

### 3. `fuelRecordIdParamSchema`
Validates path parameters for single fuel record operations (e.g., `GET /api/v1/fuel-records/:id`).
- `id`: Required valid UUID string.

### 4. `fuelRecordQuerySchema`
Validates query params for filtering, searching, sorting, and paginating fuel listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional search string (searches `fuelStation` / `receiptNumber`).
- `vehicleId`: Optional Vehicle UUID filter.
- `tripId`: Optional Trip UUID filter.
- `companyId`: Optional Company UUID filter.
- `sortBy`: Optional enum field name (`createdAt`, `fuelDate`, `totalCost`, `odometerReading`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## ⚙️ Fuel Service Layer (`services/fuel.service.ts`)

The `FuelService` class manages vehicle refueling operational events, tenant isolation, and cross-entity vehicle/trip validation.

### Business Rules & Tenant Isolation
1. **`createFuelRecord(input: CreateFuelRecordInput)`**:
   - Verifies existence of `Company` and `Vehicle`.
   - **Tenant Scoping**: Verifies `Vehicle` belongs to `companyId`.
   - **Trip Association Check**: If `tripId` is provided, verifies `Trip` exists, belongs to `companyId`, and matches `vehicleId` (`trip.vehicleId === vehicleId`).
   - Rejects duplicate `receiptNumber` if provided within the same company.
   - Includes `vehicle`, `trip`, and `company` relations in response.
2. **`getFuelRecordById(id: string, companyId?: string)`**:
   - Retrieves fuel record by UUID with full relations.
   - Enforces multi-tenant isolation when `companyId` is provided (cross-tenant access returns Not Found).
3. **`getFuelRecords(query: FuelRecordQueryInput, companyId?: string)`**:
   - Supports paginated listing with `total`, `page`, `limit`, `totalPages` metadata.
   - Enforces company isolation via `companyId`.
   - Performs case-insensitive search across `fuelStation`, `receiptNumber`, and internal reference code.
   - Supports filters: `vehicleId`, `tripId`, `companyId`.
   - Supports sorting by: `createdAt`, `fuelDate` (`refueledAt`), `totalCost`, `odometerReading`.
4. **`updateFuelRecord(id: string, input: UpdateFuelRecordInput, companyId?: string)`**:
   - Verifies record exists within company tenant boundary.
   - Rejects duplicate `receiptNumber` if modified.
   - Re-verifies vehicle/trip company alignment and `trip.vehicleId` match if modified.
5. **`deleteFuelRecord(id: string, companyId?: string)`**:
   - Verifies record exists within company tenant boundary before hard deletion.

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  fuelService,
  createFuelRecordSchema,
  updateFuelRecordSchema,
  fuelRecordIdParamSchema,
  fuelRecordQuerySchema,
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
  FuelRecordIdInput,
  FuelRecordQueryInput,
  PaginatedFuelRecordResult,
} from './modules/fuel';
```

