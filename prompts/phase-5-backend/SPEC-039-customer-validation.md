# SPEC-039 — Customer Validation Layer

## Objective

Implement the complete validation layer for the Customer module using Zod. The implementation must follow the exact architecture, coding standards, and folder structure established in the Vehicle and Driver modules.

---

## Create

backend/src/modules/customer/

with:

controllers/
services/
routes/
validators/
index.ts

---

## Create

backend/src/modules/customer/validators/customer.validator.ts

---

## Validation Schemas

Implement the following schemas.

### createCustomerSchema

Fields:

customerCode
- required
- trimmed string
- max length 50

companyName
- required
- trimmed string
- max length 200

contactPerson
- optional
- trimmed string
- max length 100

email
- required
- valid email

phone
- optional
- trimmed string
- max length 20

address
- optional
- trimmed string
- max length 300

city
- optional
- trimmed string
- max length 100

state
- optional
- trimmed string
- max length 100

country
- optional
- trimmed string
- max length 100

postalCode
- optional
- trimmed string
- max length 20

status
- optional
- Prisma CustomerStatus enum

companyId
- required
- UUID

---

### updateCustomerSchema

Derived using

createCustomerSchema.partial()

---

### customerIdParamSchema

Validate:

id

UUID

---

### customerQuerySchema

Support:

page
default 1

limit
default 10
minimum 1
maximum 100

search

status

sortBy

Allowed:

createdAt
companyName
customerCode

Default:

createdAt

sortOrder

asc
desc

Default:

desc

---

## Type Inference

Export:

CreateCustomerInput

UpdateCustomerInput

CustomerIdInput

CustomerQueryInput

using z.infer<>

---

## Module Exports

Create

backend/src/modules/customer/validators/index.ts

Export validator.

Update

backend/src/modules/customer/index.ts

---

## Documentation

Create

docs/backend/customer-module.md

Document:

Validation architecture

Schemas

Type inference

Validation rules

---

## AI Development Log

Append SPEC-039 completion.

---

## Prompt Archive

Create

prompts/phase-5-backend/SPEC-039-customer-validation.md

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

git commit -m "feat(customer): add validation layer"

git push origin main
