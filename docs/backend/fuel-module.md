# FleetCore Fuel Module Documentation

**Module**: Fuel Management (`backend/src/modules/fuel`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation Layer Implemented  

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

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  createFuelRecordSchema,
  updateFuelRecordSchema,
  fuelRecordIdParamSchema,
  fuelRecordQuerySchema,
  CreateFuelRecordInput,
  UpdateFuelRecordInput,
  FuelRecordIdInput,
  FuelRecordQueryInput,
} from './modules/fuel';
```
