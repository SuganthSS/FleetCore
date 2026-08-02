# SPEC-040 — Customer Service Layer

## Objective

Implement the complete business logic layer for the Customer module. Follow the exact architecture, coding standards, tenant isolation, error handling, and service patterns established in the VehicleService and DriverService.

---

## Create

backend/src/modules/customer/services/

Create:

customer.service.ts

index.ts

Update:

backend/src/modules/customer/index.ts

---

## Service

Implement CustomerService as a framework-independent service.

No Express imports.

No Request/Response objects.

Business logic only.

Export singleton:

customerService

---

## Methods

Implement the following methods.

---

### createCustomer(input: CreateCustomerInput)

Requirements

• Verify Company exists.

• Reject duplicate customerCode.

• Reject duplicate email within the same company.

• Create customer.

• Include company relation.

Return created customer.

---

### getCustomerById(id: string, companyId?: string)

Requirements

Retrieve customer by UUID.

Include:

company

If companyId supplied:

Enforce tenant isolation.

If customer belongs to another tenant:

Return Not Found.

---

### getCustomers(query: CustomerQueryInput, companyId?: string)

Support

Pagination

Search

Status filtering

Sorting

Tenant isolation

Search across

customerCode

companyName

contactPerson

email

Sorting

createdAt

companyName

customerCode

Return

{
  items,
  total,
  page,
  limit,
  totalPages
}

---

### updateCustomer(
id: string,
input: UpdateCustomerInput,
companyId?: string
)

Requirements

Verify customer exists.

Enforce tenant isolation.

Reject duplicate customerCode.

Reject duplicate email within tenant.

Update customer.

Return updated entity.

---

### deleteCustomer(
id: string,
companyId?: string
)

Requirements

Verify customer exists.

Enforce tenant isolation.

Delete customer.

Return success.

---

## Error Handling

Return standardized errors for

404

Customer not found

Company not found

409

Duplicate customerCode

Duplicate email

400

Invalid operation

500

Unexpected server errors

Do not expose Prisma errors.

---

## Multi-Tenant Security

All single-record operations must respect companyId.

Users from Company A must never read/update/delete Company B customers.

---

## Documentation

Update

docs/backend/customer-module.md

Document

Business rules

Service methods

Tenant isolation

Duplicate prevention

Pagination

Filtering

Search

Sorting

---

## AI Development Log

Append SPEC-040 completion.

---

## Prompt Archive

Create

prompts/phase-5-backend/SPEC-040-customer-service.md

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

git commit -m "feat(customer): add service layer"

git push origin main

---

## Quality Requirements

Follow the exact architectural conventions used by:

VehicleService

DriverService

Maintain identical coding style, response patterns, tenant isolation, duplicate validation, and pagination behavior.

Do not proceed until the Customer service layer is production-ready.
