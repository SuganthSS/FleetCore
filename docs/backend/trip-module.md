# FleetCore Trip Module Documentation

**Module**: Trip Management (`backend/src/modules/trip`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Fully Implemented (Validation, Service, Controller & Routes)  

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

## ⚙️ Trip Service Layer (`services/trip.service.ts`)

The `TripService` class manages trip execution records, cross-entity tenant scoping, and relation-rich data queries.

### Business Rules & Tenant Isolation
1. **`createTrip(input: CreateTripInput)`**:
   - Verifies existence of `Company`, `Shipment`, `Vehicle`, `Driver`, and `Route`.
   - **Cross-Tenant Alignment**: Verifies that `Shipment`, `Vehicle`, `Driver`, and `Route` all belong to the specified `companyId`. Rejects cross-company entity associations.
   - Rejects duplicate `tripNumber`.
   - Returns created trip with `shipment`, `vehicle`, `driver`, `route`, and `company` relations included.
2. **`getTripById(id: string, companyId?: string)`**:
   - Retrieves trip by UUID with full relations.
   - Enforces multi-tenant isolation when `companyId` is provided (cross-tenant access returns Not Found).
3. **`getTrips(query: TripQueryInput, companyId?: string)`**:
   - Supports paginated listing with `total`, `page`, `limit`, `totalPages` metadata.
   - Enforces company isolation via `companyId`.
   - **Cross-Entity Search**: Performs case-insensitive search across `tripNumber`, `shipment.shipmentNumber`, `vehicle.registrationNumber`, `driver.employeeId`, and `route.routeCode`.
   - Supports filters: `status`, `vehicleId`, `driverId`, `shipmentId`, `routeId`, `companyId`.
   - Supports sorting by: `createdAt`, `tripNumber`, `plannedStartTime` (`scheduledStartTime`), `actualStartTime`.
4. **`updateTrip(id: string, input: UpdateTripInput, companyId?: string)`**:
   - Verifies trip exists within company tenant boundary.
   - Rejects duplicate `tripNumber` if modified.
   - Re-verifies tenant alignment if `shipmentId`, `vehicleId`, `driverId`, or `routeId` are updated.
5. **`deleteTrip(id: string, companyId?: string)`**:
   - Verifies trip exists within company tenant boundary before hard deletion.

---

## 🎮 Trip Controller Layer (`controllers/trip.controller.ts`)

The `TripController` layer handles HTTP requests, validates inputs via Zod, extracts authenticated tenant context, and maps service outputs/errors into standardized JSON responses.

### HTTP Status Code Mapping

| Status Code | Description | Scenario |
| :--- | :--- | :--- |
| **200 OK** | Success | Querying, updating, or deleting trips |
| **201 Created** | Created | Successfully creating a trip |
| **400 Bad Request** | Validation Error | Payload/Query/Params validation failure |
| **404 Not Found** | Resource Not Found | Trip/Shipment/Vehicle/Driver/Route/Company not found, cross-tenant access |
| **409 Conflict** | Duplicate Constraint | Duplicate `tripNumber` |
| **500 Error** | Internal Server Error | Unhandled server error |

### Request Lifecycle

```text
HTTP Request
  → Zod safeParse (params/query/body)
  → Extract req.authenticatedUser.companyId
  → tripService method()
  → Standardized JSON response
```

---

## 🛣️ Routes & RBAC Matrix (`routes/trip.routes.ts`)

Base Route: `/api/v1/trips`

### Middleware Execution Chain
```text
HTTP Request ➔ authenticate() ➔ authorize(...roles) ➔ TripController handler
```

### Endpoints Table & Allowed Roles

| HTTP Method | Path | Description | Allowed Roles (`authorize`) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/trips` | List trips (Paginated, Search, Filter, Sort) | `Super Admin`, `Company Admin`, `Fleet Manager`, `Dispatcher` |
| `GET` | `/api/v1/trips/:id` | Retrieve single trip execution by UUID | `Super Admin`, `Company Admin`, `Fleet Manager`, `Dispatcher` |
| `POST` | `/api/v1/trips` | Create a new trip execution | `Super Admin`, `Company Admin`, `Fleet Manager` |
| `PUT` | `/api/v1/trips/:id` | Update an existing trip execution by UUID | `Super Admin`, `Company Admin`, `Fleet Manager` |
| `DELETE` | `/api/v1/trips/:id` | Delete a trip execution by UUID | `Super Admin`, `Company Admin` |

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  tripRoutes,
  tripController,
  tripService,
  createTripSchema,
  updateTripSchema,
  tripIdParamSchema,
  tripQuerySchema,
  CreateTripInput,
  UpdateTripInput,
  TripIdInput,
  TripQueryInput,
  PaginatedTripResult,
} from './modules/trip';
```


