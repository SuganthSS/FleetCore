# SPEC-047 — Shipment Routes

## Objective

Implement the complete Express Router for the Shipment module following the exact architecture used in the Vehicle, Driver, and Customer modules.

---

## Files Created

backend/src/modules/shipment/routes/shipment.routes.ts
backend/src/modules/shipment/routes/index.ts

## Files Updated

backend/src/modules/shipment/index.ts
backend/src/index.ts

---

## Route Registration

Base path: /api/v1/shipments

Global middleware: authenticate()

---

## Endpoint Matrix

| Method | Path | Controller | Allowed Roles |
| :--- | :--- | :--- | :--- |
| GET | / | getShipments | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| GET | /:id | getShipment | Super Admin, Company Admin, Fleet Manager, Dispatcher |
| POST | / | createShipment | Super Admin, Company Admin, Fleet Manager |
| PUT | /:id | updateShipment | Super Admin, Company Admin, Fleet Manager |
| DELETE | /:id | deleteShipment | Super Admin, Company Admin |

---

## Middleware Execution Order

authenticate() → authorize(...roles) → ShipmentController handler

---

## Application Routes

/api/v1          (Health)
/api/v1/auth     (Authentication)
/api/v1/vehicles (Vehicle Management)
/api/v1/drivers  (Driver Management)
/api/v1/customers (Customer Management)
/api/v1/shipments (Shipment Management)

---

## Git

git commit -m "feat(shipment): add routes"
git push origin main
