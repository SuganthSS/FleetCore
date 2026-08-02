# FleetCore Shipment Module Documentation

**Module**: Shipment Management (`backend/src/modules/shipment`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation Layer Implemented  

---

## 📐 Validation Schemas (`validators/shipment.validator.ts`)

The Shipment validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createShipmentSchema`
Validates requests for creating/registering a new Shipment order.

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `shipmentNumber` | String | Required, trimmed, max 50 chars | Unique shipment tracking number |
| `title` | String | Required, trimmed, max 200 chars | Shipment title/name |
| `description` | String | Optional, trimmed, max 1000 chars | Additional shipment details |
| `cargoType` | String | Optional, trimmed, max 100 chars | Type of cargo |
| `weight` | Number | Optional, positive number | Cargo weight in kg |
| `volume` | Number | Optional, positive number | Cargo volume in m³ |
| `quantity` | Number | Optional, positive integer | Quantity of items |
| `pickupAddress` | String | Required, trimmed, max 300 chars | Origin street address |
| `pickupCity` | String | Required, trimmed, max 100 chars | Origin city |
| `pickupState` | String | Optional, trimmed, max 100 chars | Origin state / province |
| `pickupCountry` | String | Required, trimmed, max 100 chars | Origin country |
| `pickupPostalCode` | String | Optional, trimmed, max 20 chars | Origin postal code |
| `pickupDate` | String | Optional, valid ISO datetime | Scheduled pickup timestamp |
| `deliveryAddress` | String | Required, trimmed, max 300 chars | Destination street address |
| `deliveryCity` | String | Required, trimmed, max 100 chars | Destination city |
| `deliveryState` | String | Optional, trimmed, max 100 chars | Destination state / province |
| `deliveryCountry` | String | Required, trimmed, max 100 chars | Destination country |
| `deliveryPostalCode` | String | Optional, trimmed, max 20 chars | Destination postal code |
| `expectedDeliveryDate` | String | Optional, valid ISO datetime | Target delivery timestamp |
| `priority` | Enum | Optional, `ShipmentPriority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`) | Native Prisma Enum |
| `status` | Enum | Optional, `ShipmentStatus` (`PENDING`, `DISPATCHED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`, `FAILED`) | Native Prisma Enum |
| `customerId` | String | Required, valid UUID | Customer/Client UUID reference |
| `companyId` | String | Required, valid UUID | Parent company UUID reference |

### 2. `updateShipmentSchema`
Validates requests for updating an existing shipment record. All fields from `createShipmentSchema` are marked optional via `.partial()`.

### 3. `shipmentIdParamSchema`
Validates path parameters for single-shipment operations (e.g., `GET /api/v1/shipments/:id`).
- `id`: Required valid UUID string.

### 4. `shipmentQuerySchema`
Validates query params for filtering, searching, sorting, and paginating shipment listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional search string (searches `shipmentNumber`, `title`, `cargoType`, `pickupCity`, `deliveryCity`).
- `status`: Optional `ShipmentStatus` enum filter.
- `priority`: Optional `ShipmentPriority` enum filter.
- `customerId`: Optional Customer UUID filter.
- `companyId`: Optional Company UUID filter.
- `sortBy`: Optional enum field name (`createdAt`, `shipmentNumber`, `pickupDate`, `expectedDeliveryDate`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  createShipmentSchema,
  updateShipmentSchema,
  shipmentIdParamSchema,
  shipmentQuerySchema,
  CreateShipmentInput,
  UpdateShipmentInput,
  ShipmentIdInput,
  ShipmentQueryInput,
} from './modules/shipment';
```
