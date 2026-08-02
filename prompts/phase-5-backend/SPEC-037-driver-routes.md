# SPEC-037 — Driver Routes

## Objective

Implement the complete Driver Routes layer following the same architecture, authentication flow, RBAC enforcement, route registration, and coding standards established by the Vehicle module.

---

## Create Structure

backend/src/modules/driver/
├── routes/
│   ├── driver.routes.ts
│   └── index.ts

Update:

backend/src/modules/driver/index.ts

Update:

backend/src/index.ts

---

## Create Router

Create an Express Router for the Driver module.

Apply:

authenticate

globally to all Driver routes.

---

## Endpoints

### GET /api/v1/drivers

Description

List drivers with:

- Pagination
- Search
- Filtering
- Sorting

Controller

driverController.getDrivers

Allowed Roles

- Super Admin
- Company Admin
- Fleet Manager
- Dispatcher

---

### GET /api/v1/drivers/:id

Description

Retrieve a single Driver.

Controller

driverController.getDriver

Allowed Roles

- Super Admin
- Company Admin
- Fleet Manager
- Dispatcher

---

### POST /api/v1/drivers

Description

Create Driver.

Controller

driverController.createDriver

Allowed Roles

- Super Admin
- Company Admin
- Fleet Manager

---

### PUT /api/v1/drivers/:id

Description

Update Driver.

Controller

driverController.updateDriver

Allowed Roles

- Super Admin
- Company Admin
- Fleet Manager

---

### DELETE /api/v1/drivers/:id

Description

Delete Driver.

Controller

driverController.deleteDriver

Allowed Roles

- Super Admin
- Company Admin

---

## Authentication

All routes must execute

authenticate()

before RBAC.

Middleware order must be

authenticate()

↓

authorize(...roles)

↓

Driver Controller

---

## Module Registration

Register

driverRoutes

inside

backend/src/index.ts

Mount under

/api/v1/drivers

The application should now expose

/api/v1/auth
/api/v1/health
/api/v1/vehicles
/api/v1/drivers

---

## Requirements

- Reuse existing authenticate middleware.
- Reuse existing authorize middleware.
- Do not duplicate RBAC logic.
- Follow the exact routing conventions used by the Vehicle module.
- Keep routes thin; all business logic remains in the service layer.

---

## Documentation

Update

docs/backend/driver-module.md

Document

- endpoint table
- RBAC matrix
- middleware flow
- route registration

---

## AI Development Log

Append SPEC-037.

---

## Prompt Archive

Create

prompts/phase-5-backend/SPEC-037-driver-routes.md

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
git commit -m "feat(driver): add routes"
git push origin main

---

## Production Hardening

While implementing, verify:

- Authentication middleware order
- RBAC enforcement
- Route registration
- Duplicate route conflicts
- Tenant isolation compatibility
- Controller integration
- Import/export consistency

If any issue is discovered, resolve it before completing the specification.

Do not proceed to the next SPEC until the Driver Routes layer is fully production-ready.
