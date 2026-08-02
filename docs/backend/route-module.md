# FleetCore Route Module Documentation

**Module**: Route Management (`backend/src/modules/route`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation, Service & Controller Layers Implemented  

---

## 📐 Validation Schemas (`validators/route.validator.ts`)

The Route validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createRouteSchema`
Validates requests for creating a new Route.

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `routeCode` | String | Required, trimmed, max 50 chars | Unique route reference code |
| `name` | String | Required, trimmed, max 150 chars | Descriptive route name |
| `description` | String | Optional, trimmed, max 500 chars | Route details or notes |
| `origin` | String | Required, trimmed, max 200 chars | Departure location |
| `destination` | String | Required, trimmed, max 200 chars | Arrival location |
| `distance` | Number | Required, positive number | Distance in km |
| `estimatedDuration` | Number | Required, positive integer | Estimated time in minutes |
| `routeType` | Enum | Optional, `RouteType` (`HIGHWAY`, `URBAN`, `INTERSTATE`, `CROSS_BORDER`, `REGIONAL`, `LAST_MILE`) | Native Prisma Enum |
| `status` | Enum | Optional, `RouteStatus` (`PLANNED`, `ACTIVE`, `OPTIMIZED`, `COMPLETED`, `CANCELLED`) | Native Prisma Enum |
| `companyId` | String | Required, valid UUID | Parent company UUID reference |

### 2. `updateRouteSchema`
Validates requests for updating an existing route. All fields from `createRouteSchema` are marked optional via `.partial()`.

### 3. `routeIdParamSchema`
Validates path parameters for single-route operations (e.g., `GET /api/v1/routes/:id`).
- `id`: Required valid UUID string.

### 4. `routeQuerySchema`
Validates query params for filtering, searching, sorting, and paginating route listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional search string (searches `routeCode`, `name`, `origin`, `destination`).
- `routeType`: Optional `RouteType` enum filter.
- `status`: Optional `RouteStatus` enum filter.
- `companyId`: Optional Company UUID filter.
- `sortBy`: Optional enum field name (`createdAt`, `routeCode`, `name`, `distance`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## ⚙️ Route Service Layer (`services/route.service.ts`)

The `RouteService` class provides framework-independent CRUD operations with strict business rules.

### Business Rules & Tenant Isolation
1. **`createRoute(input: CreateRouteInput)`**:
   - Verifies existence of parent `Company`.
   - Rejects duplicate `routeCode`.
   - Includes `company` relation in response.
2. **`getRouteById(id: string, companyId?: string)`**:
   - Retrieves route by UUID including `Company` relation.
   - Enforces multi-tenant isolation when `companyId` is provided (cross-tenant access returns 404/not found).
3. **`getRoutes(query: RouteQueryInput, companyId?: string)`**:
   - Supports paginated listing with `total`, `page`, `limit`, `totalPages` metadata.
   - Enforces company isolation via `companyId`.
   - Performs case-insensitive search across `routeCode`, `name`, `origin`, and `destination`.
   - Supports filters: `routeType`, `status`, `companyId`.
   - Supports sorting by: `createdAt`, `routeCode`, `name`, `distance`.
4. **`updateRoute(id: string, input: UpdateRouteInput, companyId?: string)`**:
   - Verifies route exists within company tenant boundary.
   - Rejects duplicate `routeCode` if changed.
5. **`deleteRoute(id: string, companyId?: string)`**:
   - Verifies route exists within company tenant boundary before hard deletion.

---

## 🎮 Route Controller Layer (`controllers/route.controller.ts`)

The `RouteController` layer handles HTTP requests, validates inputs via Zod, extracts authenticated tenant context, and maps service outputs/errors into standardized JSON responses.

### HTTP Status Code Mapping

| Status Code | Description | Scenario |
| :--- | :--- | :--- |
| **200 OK** | Success | Querying, updating, or deleting routes |
| **201 Created** | Created | Successfully creating a route |
| **400 Bad Request** | Validation Error | Payload/Query/Params validation failure |
| **404 Not Found** | Resource Not Found | Route/Company not found, cross-tenant access |
| **409 Conflict** | Duplicate Constraint | Duplicate `routeCode` |
| **500 Error** | Internal Server Error | Unhandled server error |

### Request Lifecycle

```text
HTTP Request
  → Zod safeParse (params/query/body)
  → Extract req.authenticatedUser.companyId
  → routeService method()
  → Standardized JSON response
```

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  routeController,
  routeService,
  createRouteSchema,
  updateRouteSchema,
  routeIdParamSchema,
  routeQuerySchema,
  CreateRouteInput,
  UpdateRouteInput,
  RouteIdInput,
  RouteQueryInput,
  PaginatedRouteResult,
} from './modules/route';
```


