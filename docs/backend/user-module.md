# FleetCore User Management Backend Module

This document outlines the API specifications, validation criteria, data models, tenant isolation, and RBAC permissions for the User Management module implemented in `backend/src/modules/user`.

---

## 🛠️ API Endpoints & Route Definitions

All routes require a valid access token in the `Authorization: Bearer <token>` header, and are restricted to **Super Admin** and **Company Admin** roles.

| HTTP Method | Route | Description | RBAC Allowed Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users` | List users with pagination, filters, search, and sorting | `Super Admin`, `Company Admin` |
| `GET` | `/api/v1/users/:id` | Retrieve a single user profile | `Super Admin`, `Company Admin` |
| `POST` | `/api/v1/users` | Create a new user record | `Super Admin`, `Company Admin` |
| `PUT` | `/api/v1/users/:id` | Update an existing user record | `Super Admin`, `Company Admin` |
| `DELETE` | `/api/v1/users/:id` | Soft delete a user record | `Super Admin`, `Company Admin` |
| `PATCH` | `/api/v1/users/:id/status` | Activate, deactivate, or suspend a user | `Super Admin`, `Company Admin` |
| `PATCH` | `/api/v1/users/:id/reset-password` | Reset a user's password | `Super Admin`, `Company Admin` |

---

## 🛡️ Role-Based Access Control (RBAC) & Tenant Isolation

### 1. Data Scoping & Multi-Tenancy
* **Super Admin**:
  * Global access scope across the entire platform.
  * Can view, filter, update, and soft-delete users belonging to **any** tenant company.
  * Can reassign users between tenant companies via `companyId` in update requests.
* **Company Admin**:
  * Scoped strictly to their own tenant company.
  * The middleware automatically enforces tenant filtering: `companyId` is set to `req.authenticatedUser.companyId` for all list, find, and create queries.
  * **Cannot** view, update, delete, or modify users from other companies.
  * **Cannot** assign a user to another company.
  * **Cannot** modify or delete any user holding the `Super Admin` role.

### 2. Functional Restrictions
* **Fleet Managers**, **Dispatchers**, and **Drivers** have **zero** access to any user management endpoints. Requests from these roles will instantly receive a `403 Forbidden` (`INSUFFICIENT_PERMISSIONS`) error.

---

## 📋 Request Validation & Schemes (Zod)

### 1. Create User Schema (`POST /`)
* `firstName`: String, min 1 character, max 100 characters.
* `lastName`: String, min 1 character, max 100 characters.
* `email`: Valid email address string.
* `phone`: Optional, max 20 characters.
* `password`: String, min 6 characters.
* `companyId`: Valid UUID string (overwritten with actor's `companyId` for Company Admins).
* `roleId`: Valid UUID string representing a role.
* `status`: Enum (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`), defaults to `ACTIVE`.
* `department`: Optional, max 100 characters.
* `designation`: Optional, max 100 characters.

### 2. Update User Schema (`PUT /:id`)
* Identical to the Create User Schema, but all fields are optional. Excludes the `password` field (which must be updated via the `/reset-password` endpoint).

### 3. Query Listing Filters (`GET /`)
* `page`: Numeric integer >= 1, defaults to 1.
* `limit`: Numeric integer between 1 and 100, defaults to 10.
* `search`: String matching against `firstName`, `lastName`, `email`, `department`, or `designation`.
* `companyId`: UUID (accessible only to Super Admins).
* `roleId`: UUID filtering.
* `status`: UserStatus filtering.
* `sortBy`: `createdAt`, `firstName`, `lastName`, `email`, or `lastLogin` (defaults to `createdAt`).
* `sortOrder`: `asc` or `desc` (defaults to `desc`).

---

## 🔒 Security Implementation Details

1. **Password Hashing**: Plaintext passwords are automatically hashed asynchronously using `bcryptjs` with configured rounds (`BCRYPT_ROUNDS` from environment variables) prior to database insertion.
2. **Safe JSON Projection**: The `passwordHash` field is explicitly omitted from all database selection payloads (`select: defaultUserSelect`) to ensure hashes are never exposed in API response bodies.
3. **Soft Delete**: When `DELETE /api/v1/users/:id` is invoked, the record is **not** purged from Neon PostgreSQL. Instead:
   * The `deletedAt` field is populated with the current timestamp (`new Date()`).
   * The user's status is toggled to `INACTIVE` to immediately revoke session credentials.
   * All find and list operations automatically filter for `deletedAt: null`.
4. **Email Uniqueness Constraint**: The email is verified to be unique globally (ignoring whitespace and case-insensitive) before creating or updating a user account.
