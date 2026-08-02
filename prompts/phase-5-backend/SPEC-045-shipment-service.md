# SPEC-045 — Shipment Service Layer

## Objective

Implement the complete Shipment Service Layer.

The service must remain framework-independent and contain only business logic.

Follow exactly the implementation style used in:

- VehicleService
- DriverService
- CustomerService

---

## Create

backend/src/modules/shipment/services/shipment.service.ts

backend/src/modules/shipment/services/index.ts

---

## Implement ShipmentService

Export a singleton:

shipmentService

---

## Implement Methods

### createShipment(input: CreateShipmentInput)

Business Rules

1. Verify Company exists.

2. Verify Customer exists.

3. Customer must belong to the same company.

4. shipmentNumber must be globally unique.

5. Create Shipment.

6. Return Shipment including Customer and Company relations.

---

### getShipmentById(id, companyId?)

Requirements

Find Shipment by UUID.

Include Customer and Company.

If companyId provided, enforce tenant isolation.

Cross-tenant access must return Not Found.

---

### getShipments(query, companyId?)

Support pagination, search, filters, sorting.

Return paginated result with metadata.

---

### updateShipment(id, input, companyId?)

Verify shipment exists. Enforce tenant isolation.

Reject duplicate shipmentNumber if changed.

Verify new customer exists and belongs to same company if customerId changes.

---

### deleteShipment(id, companyId?)

Verify shipment exists. Enforce tenant isolation. Delete shipment.

---

## Error Handling

Company not found, Customer not found, Shipment not found, Duplicate shipmentNumber, Cross-tenant access.

---

## Validation

Run full validation suite (prisma format, validate, generate, tsc, eslint, frontend build + lint).

---

## Git

git add .

git commit -m "feat(shipment): add service layer"

git push origin main
