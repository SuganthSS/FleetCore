# SPEC-042 — Customer Routes

## Objective

Implement the complete Express routing layer for the Customer module. Follow the exact routing architecture, middleware order, RBAC model, and endpoint conventions established in the Vehicle and Driver modules.

---

## Create

backend/src/modules/customer/routes/

Create:

customer.routes.ts

index.ts

Update:

backend/src/modules/customer/index.ts

Update:

backend/src/index.ts

---

## Base Route

Mount the module under:

/api/v1/customers

---

## Middleware Order

Every endpoint must follow this order:

authenticate()
        ↓
authorize(...)
        ↓
CustomerController

Do not bypass authentication.

Do not bypass RBAC.

---

## Endpoints

### GET /

Purpose

List customers

Controller

customerController.getCustomers

Allowed Roles

Super Admin

Company Admin

Fleet Manager

Dispatcher

---

### GET /:id

Purpose

Retrieve single customer

Controller

customerController.getCustomer

Allowed Roles

Super Admin

Company Admin

Fleet Manager

Dispatcher

---

### POST /

Purpose

Create customer

Controller

customerController.createCustomer

Allowed Roles

Super Admin

Company Admin

Fleet Manager

---

### PUT /:id

Purpose

Update customer

Controller

customerController.updateCustomer

Allowed Roles

Super Admin

Company Admin

Fleet Manager

---

### DELETE /:id

Purpose

Delete customer

Controller

customerController.deleteCustomer

Allowed Roles

Super Admin

Company Admin

---

## Route Registration

Register the router inside

backend/src/index.ts

The application should now expose:

/api/v1

/api/v1/auth

/api/v1/vehicles

/api/v1/drivers

/api/v1/customers

---

## Documentation

Update

docs/backend/customer-module.md

Document

Complete endpoint table

RBAC matrix

Middleware execution order

Request lifecycle

---

## AI Development Log

Append SPEC-042 completion.

---

## Prompt Archive

Create

prompts/phase-5-backend/SPEC-042-customer-routes.md

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

git commit -m "feat(customer): add routes"

git push origin main

---

## Quality Requirement

Follow the exact implementation used by:

Vehicle Routes

Driver Routes

Maintain identical middleware order, RBAC behavior, endpoint naming, and route registration.

Do not continue until all routes are fully functional and registered.
