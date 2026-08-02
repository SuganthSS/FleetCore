# SPEC-041 — Customer Controller Layer

## Objective

Implement the HTTP Controller layer for the Customer module. Follow the exact architecture, coding standards, request lifecycle, response format, validation flow, and error handling established in the VehicleController and DriverController.

---

## Create

backend/src/modules/customer/controllers/

Create

customer.controller.ts

index.ts

Update

backend/src/modules/customer/index.ts

---

## Controller

Implement CustomerController.

Export singleton:

customerController

The controller must remain thin.

Responsibilities:

- Validate requests using Zod
- Delegate business logic to CustomerService
- Map errors to HTTP responses
- Never contain business logic

---

## Methods

Implement the following methods.

---

### createCustomer(req, res)

Validate

createCustomerSchema

Delegate

customerService.createCustomer()

Return

HTTP 201

{
  success: true,
  message: "Customer created successfully",
  data
}

---

### getCustomer(req, res)

Validate

customerIdParamSchema

Extract

req.authenticatedUser.companyId

Delegate

customerService.getCustomerById(id, companyId)

Return

HTTP 200

{
  success: true,
  data
}

---

### getCustomers(req, res)

Validate

customerQuerySchema

Extract

req.authenticatedUser.companyId

Delegate

customerService.getCustomers(query, companyId)

Return

HTTP 200

{
  success: true,
  data: {
    items,
    total,
    page,
    limit,
    totalPages
  }
}

---

### updateCustomer(req, res)

Validate

customerIdParamSchema

updateCustomerSchema

Extract

req.authenticatedUser.companyId

Delegate

customerService.updateCustomer(
    id,
    input,
    companyId
)

Return

HTTP 200

{
  success: true,
  message: "Customer updated successfully",
  data
}

---

### deleteCustomer(req, res)

Validate

customerIdParamSchema

Extract

req.authenticatedUser.companyId

Delegate

customerService.deleteCustomer(id, companyId)

Return

HTTP 200

{
    success: true,
    message: "Customer deleted successfully"
}

---

## Validation Handling

When Zod validation fails:

Return

HTTP 400

{
    success: false,
    message: "Validation failed",
    errors: [...]
}

---

## Error Mapping

404

Customer not found

Company not found

409

Duplicate customerCode

Duplicate email

400

Validation failure

401

Authentication failure

403

Authorization failure

500

Unexpected server errors

Do not expose Prisma exceptions or stack traces.

---

## Tenant Isolation

All single-record operations must use

req.authenticatedUser.companyId

Never allow cross-tenant access.

---

## Documentation

Update

docs/backend/customer-module.md

Document

Controller architecture

Request lifecycle

Response formats

Validation flow

HTTP status codes

---

## AI Development Log

Append SPEC-041 completion.

---

## Prompt Archive

Create

prompts/phase-5-backend/SPEC-041-customer-controller.md

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

git commit -m "feat(customer): add controller layer"

git push origin main

---

## Quality Requirement

Follow the exact implementation pattern used by:

VehicleController

DriverController

Maintain identical response structure, validation behavior, and tenant isolation.
