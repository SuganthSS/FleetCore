# SPEC-046 — Shipment Controller Layer

## Objective
Implement the complete HTTP Controller layer for the Shipment module following the exact architectural conventions established in the Vehicle, Driver, and Customer modules.

---

## Files Created

backend/src/modules/shipment/controllers/shipment.controller.ts
backend/src/modules/shipment/controllers/index.ts

---

## Controller Methods

### createShipment(req, res)
- Validates body with `createShipmentSchema`
- Delegates to `shipmentService.createShipment()`
- Returns HTTP 201

### getShipment(req, res)
- Validates params with `shipmentIdParamSchema`
- Extracts `req.authenticatedUser.companyId`
- Delegates to `shipmentService.getShipmentById(id, companyId)`
- Returns HTTP 200

### getShipments(req, res)
- Validates query with `shipmentQuerySchema`
- Extracts `req.authenticatedUser.companyId`
- Delegates to `shipmentService.getShipments(query, companyId)`
- Returns HTTP 200 with paginated data

### updateShipment(req, res)
- Validates params and body
- Extracts `req.authenticatedUser.companyId`
- Delegates to `shipmentService.updateShipment(id, input, companyId)`
- Returns HTTP 200

### deleteShipment(req, res)
- Validates params
- Extracts `req.authenticatedUser.companyId`
- Delegates to `shipmentService.deleteShipment(id, companyId)`
- Returns HTTP 200

---

## Error Mapping

409 — duplicate shipmentNumber
404 — not found / does not exist / does not belong
400 — validation failure
500 — unhandled server error

---

## Git

git commit -m "feat(shipment): add controller layer"
git push origin main
