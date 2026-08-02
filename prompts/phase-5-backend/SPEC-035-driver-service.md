# SPEC-035 — Driver Service Layer

## Objective

Implement the complete Driver Service following the same architecture, coding standards, and security model used by the Vehicle Service.

---

## Create Structure

backend/src/modules/driver/
├── services/
│   ├── driver.service.ts
│   └── index.ts

Update:

backend/src/modules/driver/index.ts

---

## Implement DriverService

Create the following methods.

---

### 1. createDriver(input: CreateDriverInput)

Business Rules

- Verify Company exists.
- Verify User exists.
- Verify User belongs to same Company.
- Reject duplicate:
  - employeeId
  - licenseNumber
  - userId

Create Driver.

Return created Driver.

---

### 2. getDriverById(id: string, companyId?: string)

Fetch Driver by UUID.

Include:

- User
- Company

If companyId is supplied

Only return Driver belonging to that company.

Otherwise

Return NOT FOUND.

This prevents cross-tenant access.

---

### 3. getDrivers(query: DriverQueryInput, companyId?: string)

Support

Pagination

- page
- limit

Filtering

- availability
- experienceLevel
- companyId

Searching

Case-insensitive search on

- employeeId
- licenseNumber
- User.firstName
- User.lastName
- User.email

Sorting

Support

- createdAt
- employeeId
- licenseExpiry
- joiningDate

Return

{
items,
total,
page,
limit,
totalPages
}

---

### 4. updateDriver(id: string, input: UpdateDriverInput, companyId?: string)

Verify Driver exists.

Enforce tenant isolation.

Reject duplicate

- employeeId
- licenseNumber

Update only supplied fields.

Return updated Driver.

---

### 5. deleteDriver(id: string, companyId?: string)

Verify Driver exists.

Enforce tenant isolation.

Delete Driver.

Return success.

---

## Requirements

Reuse Prisma Client.

No Express imports.

No req/res usage.

No HTTP logic.

Business logic only.

---

## Error Handling

Throw meaningful errors for

- Driver not found
- Company not found
- User not found
- User belongs to another company
- Duplicate employeeId
- Duplicate licenseNumber
- Duplicate user assignment

---

## Documentation

Update

docs/backend/driver-module.md

Document

- service methods
- business rules
- tenant isolation
- duplicate prevention

---

## AI Development Log

Append SPEC-035.

---

## Prompt Archive

Create

prompts/phase-5-backend/SPEC-035-driver-service.md

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
git commit -m "feat(driver): add service layer"
git push origin main

---

## Production Hardening

If any bugs, security issues, tenant isolation issues, duplicate validation issues, RBAC issues, architectural inconsistencies, or code quality problems are discovered during implementation, fix them before completing the specification.

Do not continue until the module is production-ready.
