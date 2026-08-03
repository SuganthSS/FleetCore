# Enterprise Audit Module API Specification (SPEC-106)

## Overview
The **Audit Module** in the FleetCore backend (`backend/src/modules/audit/`) manages system-wide security, user actions, role modifications, and operational events. Access is restricted strictly to users with the `Administrator` role.

---

## API Endpoints

### 1. List Audit Logs
- **Endpoint**: `GET /api/v1/audit`
- **Access**: Private (`Administrator` only)
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 15)
  - `search` (string, searches user, email, module, action, description, IP)
  - `sortBy` (`timestamp` | `userName` | `roleName` | `module` | `action` | `severity`)
  - `sortOrder` (`asc` | `desc`)
  - `startDate` (ISO string)
  - `endDate` (ISO string)
  - `user` (string)
  - `role` (string)
  - `module` (string)
  - `severity` (`INFO` | `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`)
  - `action` (string)
  - `status` (`SUCCESS` | `WARNING` | `FAILED`)

### Response Format
```json
{
  "success": true,
  "data": [
    {
      "id": "aud-1001",
      "timestamp": "2026-08-03T18:10:00.000Z",
      "userName": "Sarah Jenkins",
      "userEmail": "sarah.j@fleetcore.io",
      "roleName": "Administrator",
      "module": "Role Changes",
      "action": "UPDATE_PERMISSIONS",
      "severity": "HIGH",
      "ipAddress": "192.168.1.104",
      "device": "Chrome v122 / macOS Sonoma",
      "status": "SUCCESS",
      "description": "Updated permissions for Fleet Manager role",
      "metadata": { "roleId": "role-fleet-mgr" }
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 15,
    "totalPages": 1
  }
}
```

---

### 2. Audit Taxonomy Metadata
- **Endpoint**: `GET /api/v1/audit/meta`
- **Access**: Private (`Administrator` only)
- **Response**: Returns arrays of available `modules`, `roles`, `severities`, `actions`, and `users` for frontend filter dropdown populators.

---

### 3. Audit Log Entry Detail
- **Endpoint**: `GET /api/v1/audit/:id`
- **Access**: Private (`Administrator` only)
- **Response**: Returns single detailed audit log record by ID.
