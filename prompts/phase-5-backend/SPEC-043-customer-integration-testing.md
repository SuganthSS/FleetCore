# SPEC-043 — Customer Integration Testing & Production Hardening

## Objective

Perform comprehensive end-to-end integration testing of the Customer module to verify validation, controller, service, routing, RBAC, authentication, tenant isolation, and database interactions.

Any issue discovered during testing must be fixed before this specification is considered complete.

---

## Test Matrix

Execute and verify all scenarios.

### CRUD Operations

Verify:

POST /api/v1/customers

GET /api/v1/customers

GET /api/v1/customers/:id

PUT /api/v1/customers/:id

DELETE /api/v1/customers/:id

Expected

Correct HTTP status codes

Correct JSON responses

Correct database persistence

---

## Validation Testing

Verify

Invalid UUID

Missing customerCode

Missing companyName

Invalid email

Invalid companyId

Invalid pagination

limit > 100

Invalid enum

Invalid query parameters

Expected

HTTP 400

Human-readable validation errors

---

## Duplicate Constraint Testing

Verify rejection of

Duplicate customerCode

Duplicate email within same company

Expected

HTTP 409 Conflict

---

## Authentication Testing

Verify

Missing Authorization header

Malformed Bearer token

Expired JWT

Invalid JWT

Expected

HTTP 401 Unauthorized

---

## RBAC Testing

GET

Allowed

Super Admin

Company Admin

Fleet Manager

Dispatcher

Denied

Driver

POST

Allowed

Super Admin

Company Admin

Fleet Manager

Denied

Dispatcher

Driver

PUT

Allowed

Super Admin

Company Admin

Fleet Manager

Denied

Dispatcher

Driver

DELETE

Allowed

Super Admin

Company Admin

Denied

Fleet Manager

Dispatcher

Driver

Expected

HTTP 403 Forbidden

---

## Multi-Tenant Isolation

Verify users from Company A cannot

Read Company B customers

Update Company B customers

Delete Company B customers

List Company B customers

Expected

404 Not Found

or isolated empty results

No tenant data leakage

If any issue exists

Fix CustomerService immediately

---

## Search & Filtering

Verify

customerCode search

companyName search

contactPerson search

email search

status filter

Sorting

Pagination metadata

Expected

Correct filtered results

---

## Database Integrity

Verify

Company existence validation

Duplicate prevention

Foreign key integrity

Tenant boundary enforcement

---

## Security Audit

Verify

No Prisma exceptions exposed

No SQL errors exposed

No stack traces returned

No tenant leakage

No sensitive information exposed

---

## Documentation

Create

docs/backend/customer-testing.md

Document

Complete testing matrix

RBAC verification

Tenant isolation verification

Security audit

Issues discovered

Fixes applied

Production readiness assessment

---

## AI Development Log

Append SPEC-043 completion.

---

## Prompt Archive

Create

prompts/phase-5-backend/SPEC-043-customer-integration-testing.md

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

git commit -m "test(customer): verify customer module integration"

git push origin main

---

## Production Hardening

During testing actively verify

Tenant isolation

RBAC correctness

Authentication

Duplicate validation

HTTP status codes

Validation errors

Unhandled exceptions

Information disclosure

Fix every discovered issue before completing this specification.

Do not proceed until the Customer module is production-ready.
