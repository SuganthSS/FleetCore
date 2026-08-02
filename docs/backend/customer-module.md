# FleetCore Customer Module Documentation

**Module**: Customer Management (`backend/src/modules/customer`)  
**Phase**: Phase 5 - Backend Fleet Management  
**Status**: Validation & Service Layers Implemented  

---

## 📐 Validation Schemas (`validators/customer.validator.ts`)

The Customer validation layer utilizes **Zod** to validate incoming HTTP request payloads, path parameters, and query parameters before reaching controllers or services.

### 1. `createCustomerSchema`
Validates requests for creating/registering a new B2B or B2C customer profile.

| Field | Type | Validation Rules | Error / Notes |
| :--- | :--- | :--- | :--- |
| `customerCode` | String | Required, trimmed, max 50 chars | Internal company customer code (unique) |
| `companyName` | String | Required, trimmed, max 200 chars | Customer organization name |
| `contactPerson` | String | Optional, trimmed, max 100 chars | Primary point of contact |
| `email` | String | Required, trimmed, valid email | Customer contact email |
| `phone` | String | Optional, trimmed, max 20 chars | Primary phone number |
| `address` | String | Optional, trimmed, max 300 chars | Street address |
| `city` | String | Optional, trimmed, max 100 chars | City |
| `state` | String | Optional, trimmed, max 100 chars | State / Province |
| `country` | String | Optional, trimmed, max 100 chars | Country |
| `postalCode` | String | Optional, trimmed, max 20 chars | ZIP / Postal code |
| `status` | Enum | Optional, `CustomerStatus` (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`) | Native Prisma Enum |
| `companyId` | String | Required, valid UUID | Parent company reference |

### 2. `updateCustomerSchema`
Validates requests for updating an existing customer profile. All fields from `createCustomerSchema` are marked optional via `.partial()`.

### 3. `customerIdParamSchema`
Validates path parameters for single-customer operations (e.g., `GET /api/v1/customers/:id`).
- `id`: Required valid UUID string.

### 4. `customerQuerySchema`
Validates query params for filtering, searching, sorting, and paginating customer listings.
- `page`: Optional integer $\ge 1$ (default: `1`).
- `limit`: Optional integer $1 \le limit \le 100$ (default: `10`).
- `search`: Optional search string (searches `customerCode`, `companyName`, `contactPerson`, `email`).
- `status`: Optional `CustomerStatus` enum filter.
- `sortBy`: Optional enum field name (`createdAt`, `companyName`, `customerCode`). Default: `createdAt`.
- `sortOrder`: Optional `asc` or `desc` (default: `desc`).

---

## ⚙️ Customer Service Layer (`services/customer.service.ts`)

The `CustomerService` class provides framework-independent CRUD operations and business rules.

### Business Rules & Tenant Isolation
1. **`createCustomer(input: CreateCustomerInput)`**:
   - Validates existence of parent `Company`.
   - Rejects duplicate `customerCode` globally.
   - Rejects duplicate `email` within the same company tenant.
   - Includes company relation in response.
2. **`getCustomerById(id: string, companyId?: string)`**:
   - Retrieves customer record by UUID, including associated `Company` metadata.
   - Enforces multi-tenant isolation by scoping queries with `companyId`.
3. **`getCustomers(query: CustomerQueryInput, companyId?: string)`**:
   - Supports paginated listing with total counts and total pages.
   - Enforces company isolation via `companyId`.
   - Performs case-insensitive search across `customerCode`, `companyName`, `contactPerson`, and `email`.
4. **`updateCustomer(id: string, input: UpdateCustomerInput, companyId?: string)`**:
   - Verifies customer exists and enforces multi-tenant boundary.
   - Checks uniqueness of updated `customerCode` and updated `email` within tenant.
5. **`deleteCustomer(id: string, companyId?: string)`**:
   - Verifies customer exists within company tenant boundary before hard deletion.

---

## 🏷️ Exported TypeScript Types & Functions

```typescript
import {
  customerService,
  createCustomerSchema,
  updateCustomerSchema,
  customerIdParamSchema,
  customerQuerySchema,
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerIdInput,
  CustomerQueryInput,
  PaginatedCustomerResult,
} from './modules/customer';
```
