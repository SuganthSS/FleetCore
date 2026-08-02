# SPEC-036 — Driver Controller Layer

## Objective

Implement the complete Driver Controller layer following the same architecture, coding standards, validation flow, response format, and error handling established by the Vehicle module.

---

## Create Structure

backend/src/modules/driver/
├── controllers/
│   ├── driver.controller.ts
│   └── index.ts

Update:

backend/src/modules/driver/index.ts

---

## Implement Driver Controller

Create the following controller methods.

---

### 1. createDriver(req, res)

Responsibilities

- Validate `req.body` using `createDriverSchema`.
- Delegate business logic to `driverService.createDriver()`.
- Return:

HTTP 201 Created

```json
{
  "success": true,
  "message": "Driver created successfully",
  "data": { ... }
}
```

---

### 2. getDriver(req, res)

Responsibilities

- Validate `req.params` using `driverIdParamSchema`.
- Obtain authenticated tenant companyId from:

req.authenticatedUser.companyId

- Delegate to:

driverService.getDriverById(id, companyId)

Return

HTTP 200 OK

```json
{
  "success": true,
  "data": { ... }
}
```

---

### 3. getDrivers(req, res)

Responsibilities

Validate query using

driverQuerySchema

Obtain authenticated tenant companyId.

Delegate to

driverService.getDrivers(query, companyId)

Return

HTTP 200 OK

```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

---

### 4. updateDriver(req, res)

Responsibilities

Validate

- params
- body

Delegate

driverService.updateDriver(
    id,
    input,
    companyId
)

Return

HTTP 200 OK

```json
{
  "success": true,
  "message": "Driver updated successfully",
  "data": { ... }
}
```

---

### 5. deleteDriver(req, res)

Responsibilities

Validate

driverIdParamSchema

Delegate

driverService.deleteDriver(
    id,
    companyId
)

Return

HTTP 200 OK

```json
{
  "success": true,
  "message": "Driver deleted successfully"
}
```

---

## Validation & Error Handling

Standardize responses.

### HTTP 400

Validation failure

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [...]
}
```

---

### HTTP 404

- Driver not found
- Company not found
- User not found

---

### HTTP 409

- Duplicate employeeId
- Duplicate licenseNumber
- Duplicate user assignment

---

### HTTP 500

Return sanitized internal server errors.

Never expose

- Prisma stack traces
- SQL errors
- Internal implementation details

---

## Requirements

- No business logic inside controllers.
- All database access must remain in DriverService.
- All validation must use existing Zod schemas.
- Reuse the same response format as the Authentication and Vehicle modules.
- Pass authenticated tenant `companyId` into every single-driver operation to preserve tenant isolation.

---

## Documentation

Update:

docs/backend/driver-module.md

Document:

- controller methods
- request lifecycle
- validation flow
- response format
- error handling

---

## AI Development Log

Append SPEC-036.

---

## Prompt Archive

Create:

prompts/phase-5-backend/SPEC-036-driver-controller.md

---

## Validation

Run

cd backend

npx prisma format
npx prisma validate
npx prisma generate
npm run build
npm run lint

cd ../frontend

npm run build
npm run lint

Everything must pass with zero errors.

---

## Git

git add .
git commit -m "feat(driver): add controller layer"
git push origin main

---

## Production Hardening

If any bugs, security issues, tenant isolation issues, validation inconsistencies, controller/service coupling problems, architectural issues, or code quality defects are discovered during implementation, resolve them before completing the specification.

Do not proceed to the next SPEC until this controller is production-ready.
