# FleetCore Route Module Documentation

**Module**: Route Management (`backend/src/modules/route`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation Layer Implemented  

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

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  createRouteSchema,
  updateRouteSchema,
  routeIdParamSchema,
  routeQuerySchema,
  CreateRouteInput,
  UpdateRouteInput,
  RouteIdInput,
  RouteQueryInput,
} from './modules/route';
```
