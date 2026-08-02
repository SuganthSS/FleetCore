# SPEC-034 — Driver Validation Layer

## Objective

Implement the complete validation layer for the Driver module following the exact architecture used by the Vehicle module.

---

## Create Structure

backend/src/modules/driver/
├── validators/
│   ├── driver.validator.ts
│   └── index.ts
└── index.ts

---

## Implement Validation Schemas

### 1. createDriverSchema

Validate the following fields:

- employeeId
  - required
  - trim whitespace
  - max length: 50

- userId
  - required UUID

- companyId
  - required UUID

- experienceLevel
  - Prisma native ExperienceLevel enum

- availability
  - Prisma native DriverAvailability enum

- licenseNumber
  - required
  - trim whitespace
  - max length: 50

- licenseExpiry
  - required datetime

- joiningDate
  - optional datetime

- emergencyContactName
  - optional
  - max length: 100

- emergencyContactPhone
  - optional
  - max length: 20

---

### 2. updateDriverSchema

Create using:

createDriverSchema.partial()

---

### 3. driverIdParamSchema

Validate:

id

Must be a valid UUID.

---

### 4. driverQuerySchema

Support:

Pagination

- page >= 1
- limit between 1 and 100

Filtering

- availability
- experienceLevel
- companyId (optional)

Searching

- employeeId
- licenseNumber

Sorting

Allow:

- createdAt
- employeeId
- licenseExpiry
- joiningDate

Sort Order

- asc
- desc

---

## Export Types

Infer the following TypeScript types using z.infer():

- CreateDriverInput
- UpdateDriverInput
- DriverIdInput
- DriverQueryInput

---

## Documentation

Create or update:

docs/backend/driver-module.md

Document:

- validation schemas
- validation rules
- inferred TypeScript types

---

## AI Development Log

Append SPEC-034 to:

docs/AI-DEVELOPMENT-LOG.md

---

## Prompt Archive

Create:

prompts/phase-5-backend/SPEC-034-driver-validation.md

---

## Validation

Run:

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

Commit:

git add .
git commit -m "feat(driver): add validation layer"
git push origin main

---

## Development Rules

- Follow the same architecture used by the Vehicle module.
- Reuse Prisma native enums wherever possible.
- Do not duplicate validation logic.
- Ensure all schemas are fully typed using Zod inference.
- If any bugs, security issues, tenant isolation issues, RBAC issues, validation gaps, or architectural inconsistencies are discovered during implementation, fix them before completing the specification.
- Do not proceed to the next SPEC until this one is fully validated and production-ready.
