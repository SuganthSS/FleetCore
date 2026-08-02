# FleetCore Shipment Module Documentation

**Module**: Shipment Management (`backend/src/modules/shipment`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Fully Implemented (Validation, Service, Controller & Routes)  

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

## ⚙️ Shipment Service Layer (`services/shipment.service.ts`)

The `ShipmentService` class provides framework-independent CRUD operations with strict business rules.

### Business Rules & Tenant Isolation
1. **`createShipment(input: CreateShipmentInput)`**:
   - Verifies existence of parent `Company`.
   - Verifies existence of `Customer`.
   - Enforces that the `Customer` belongs to the same `Company` (cross-company assignment rejected).
   - Rejects globally duplicate `shipmentNumber`.
   - Includes `customer` and `company` relations in response.
2. **`getShipmentById(id: string, companyId?: string)`**:
   - Retrieves shipment by UUID including `Customer` and `Company` relations.
   - Enforces multi-tenant isolation when `companyId` is provided (cross-tenant access returns 404).
3. **`getShipments(query: ShipmentQueryInput, companyId?: string)`**:
   - Supports paginated listing with `total`, `page`, `limit`, `totalPages` metadata.
   - Enforces company isolation via `companyId`.
   - Performs case-insensitive search across `shipmentNumber`, `title`, `cargoType`, `pickupCity`, `deliveryCity`, and related `customer.companyName`.
   - Supports filters: `status`, `priority`, `customerId`.
4. **`updateShipment(id: string, input: UpdateShipmentInput, companyId?: string)`**:
   - Verifies shipment exists within company tenant boundary.
   - Rejects duplicate `shipmentNumber` if changed.
   - If `customerId` changes, verifies new customer exists and belongs to the same company.
5. **`deleteShipment(id: string, companyId?: string)`**:
   - Verifies shipment exists within company tenant boundary before hard deletion.

---

## 🎮 Shipment Controller Layer (`controllers/shipment.controller.ts`)

The `ShipmentController` layer handles HTTP requests, validates inputs via Zod, extracts authenticated tenant context, and maps service outputs/errors into standardized JSON responses.

### HTTP Status Code Mapping

| Status Code | Description | Scenario |
| :--- | :--- | :--- |
| **200 OK** | Success | Querying, updating, or deleting shipments |
| **201 Created** | Created | Successfully creating a shipment |
| **400 Bad Request** | Validation Error | Payload/Query/Params validation failure |
| **404 Not Found** | Resource Not Found | Shipment/Customer/Company not found, cross-tenant access |
| **409 Conflict** | Duplicate Constraint | Duplicate `shipmentNumber` |
| **500 Error** | Internal Server Error | Unhandled server error |

### Request Lifecycle

```text
HTTP Request
  → Zod safeParse (params/query/body)
  → Extract req.authenticatedUser.companyId
  → shipmentService method()
  → Standardized JSON response
```

---

## 🛣️ Routes & RBAC Matrix (`routes/shipment.routes.ts`)

Base Route: `/api/v1/shipments`

### Middleware Execution Chain
```text
HTTP Request ➔ authenticate() ➔ authorize(...roles) ➔ ShipmentController handler
```

### Endpoints Table & Allowed Roles

| HTTP Method | Path | Description | Allowed Roles (`authorize`) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/shipments` | List shipments (Paginated, Search, Filter, Sort) | `Super Admin`, `Company Admin`, `Fleet Manager`, `Dispatcher` |
| `GET` | `/api/v1/shipments/:id` | Retrieve single shipment by UUID | `Super Admin`, `Company Admin`, `Fleet Manager`, `Dispatcher` |
| `POST` | `/api/v1/shipments` | Create a new shipment order | `Super Admin`, `Company Admin`, `Fleet Manager` |
| `PUT` | `/api/v1/shipments/:id` | Update an existing shipment by UUID | `Super Admin`, `Company Admin`, `Fleet Manager` |
| `DELETE` | `/api/v1/shipments/:id` | Delete a shipment order by UUID | `Super Admin`, `Company Admin` |

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  shipmentRoutes,
  shipmentController,
  shipmentService,
  createShipmentSchema,
  updateShipmentSchema,
  shipmentIdParamSchema,
  shipmentQuerySchema,
  CreateShipmentInput,
  UpdateShipmentInput,
  ShipmentIdInput,
  ShipmentQueryInput,
  PaginatedShipmentResult,
} from './modules/shipment';
```
