# SPEC-044 — Shipment Validation Layer

## Objective

Implement the complete validation layer for the Shipment module using Zod.

The implementation must strictly follow the architecture established in the Vehicle, Driver, and Customer modules.

---

## Create

backend/src/modules/shipment/

with:

controllers/
services/
routes/
validators/
index.ts

---

## Create

backend/src/modules/shipment/validators/shipment.validator.ts

---

## Validation Schemas

Implement the following schemas.

### createShipmentSchema

shipmentNumber
- required
- trimmed string
- max length 50

title
- required
- trimmed string
- max length 200

description
- optional
- trimmed string
- max length 1000

cargoType
- optional
- trimmed string
- max length 100

weight
- optional
- positive number

volume
- optional
- positive number

quantity
- optional
- positive integer

pickupAddress
- required
- trimmed string
- max length 300

pickupCity
- required
- trimmed string
- max length 100

pickupState
- optional
- trimmed string
- max length 100

pickupCountry
- required
- trimmed string
- max length 100

pickupPostalCode
- optional
- trimmed string
- max length 20

pickupDate
- optional
- valid datetime

deliveryAddress
- required
- trimmed string
- max length 300

deliveryCity
- required
- trimmed string
- max length 100

deliveryState
- optional
- trimmed string
- max length 100

deliveryCountry
- required
- trimmed string
- max length 100

deliveryPostalCode
- optional
- trimmed string
- max length 20

expectedDeliveryDate
- optional
- valid datetime

priority
- optional
- Prisma ShipmentPriority enum

status
- optional
- Prisma ShipmentStatus enum

customerId
- required
- UUID

companyId
- required
- UUID

---

### updateShipmentSchema

Derived from

createShipmentSchema.partial()

---

### shipmentIdParamSchema

Validate

id

UUID

---

### shipmentQuerySchema

Support

page

default 1

limit

default 10

minimum 1

maximum 100

search

status

priority

customerId

sortBy

Allowed

createdAt

shipmentNumber

pickupDate

expectedDeliveryDate

Default

createdAt

sortOrder

asc

desc

Default

desc

---

## Type Inference

Export

CreateShipmentInput

UpdateShipmentInput

ShipmentIdInput

ShipmentQueryInput

using

z.infer<>

---

## Module Exports

Create

backend/src/modules/shipment/validators/index.ts

Update

backend/src/modules/shipment/index.ts

---

## Documentation

Create

docs/backend/shipment-module.md

Document

Validation architecture

Schemas

Validation rules

Type inference

---

## AI Development Log

Append SPEC-044 completion.

---

## Prompt Archive

Create

prompts/phase-5-backend/SPEC-044-shipment-validation.md

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

git commit -m "feat(shipment): add validation layer"

git push origin main

---

## Quality Requirement

Follow the exact implementation pattern used by:

Vehicle Validation

Driver Validation

Customer Validation

Maintain identical coding style, validation behavior, folder structure, type inference, and documentation quality.

Do not continue until the Shipment validation layer is production-ready.
