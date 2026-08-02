# ====================================================
# FleetCore
# SPEC-031
# Vehicle Controller Layer
# ====================================================

METADATA
----------------------------------------------------

SPEC ID:
SPEC-031

Phase:
Backend - Fleet Management

Module:
Vehicle

Title:
Vehicle Controller Layer

Dependencies:

- Vehicle Validation Layer
- Vehicle Service Layer
- Authentication Module

Outputs:

- Vehicle Controller
- Standardized API Responses
- Documentation
- Prompt Documentation

Forbidden:

- Business Logic
- Prisma Queries
- Database Schema Changes
- Express Router Definitions

# ====================================================
# CONTEXT
# ====================================================

The Vehicle Service has already been implemented.

This specification creates the HTTP controller layer only.

Controllers must remain extremely thin.

Their responsibility is limited to:

• Validate request input
• Delegate to Vehicle Service
• Return standardized HTTP responses

No business logic may exist inside controllers.

# ====================================================
# TASK 1
# CREATE CONTROLLER
# ====================================================

Create:

backend/src/modules/vehicle/controllers/

vehicle.controller.ts

Export through index.ts.

# ====================================================
# TASK 2
# IMPLEMENT METHODS
# ====================================================

Implement:

createVehicle()

getVehicle()

getVehicles()

updateVehicle()

deleteVehicle()

Each controller must call the corresponding Vehicle Service method.

# ====================================================
# createVehicle()
# ====================================================

Validate request body using:

createVehicleSchema

On success:

Return

HTTP 201 Created

Response:

{
  success: true,
  message: "Vehicle created successfully",
  data: vehicle
}

# ====================================================
# getVehicle()
# ====================================================

Validate:

vehicleIdParamSchema

Return:

HTTP 200

{
  success: true,
  data: vehicle
}

# ====================================================
# getVehicles()
# ====================================================

Validate:

vehicleQuerySchema

Return paginated result:

{
  success: true,
  data: {
      items,
      total,
      page,
      limit,
      totalPages
  }
}

# ====================================================
# updateVehicle()
# ====================================================

Validate:

vehicleIdParamSchema

updateVehicleSchema

Return

HTTP 200

{
   success: true,
   message: "Vehicle updated successfully",
   data: vehicle
}

# ====================================================
# deleteVehicle()
# ====================================================

Validate:

vehicleIdParamSchema

Call service.

Return

HTTP 200

{
   success: true,
   message: "Vehicle deleted successfully"
}

# ====================================================
# TASK 3
# ERROR HANDLING
# ====================================================

Standardize responses.

Validation errors

HTTP 400

Service not-found

HTTP 404

Duplicate resource

HTTP 409

Unexpected errors

HTTP 500

Never expose:

- stack traces
- Prisma errors
- internal implementation

# ====================================================
# TASK 4
# RESPONSE FORMAT
# ====================================================

Every endpoint must follow:

Success

{
    success: true,
    message: "...",
    data: ...
}

Failure

{
    success: false,
    message: "...",
    errors: [...]
}

Keep response formatting consistent with the Authentication module.

# ====================================================
# TASK 5
# DOCUMENTATION
# ====================================================

Update:

docs/backend/vehicle-module.md

Document:

- Controller methods
- Request lifecycle
- Response format
- Validation flow

# ====================================================
# TASK 6
# AI LOG
# ====================================================

Append:

SPEC-031

to

docs/AI-DEVELOPMENT-LOG.md

# ====================================================
# TASK 7
# PROMPT STORAGE
# ====================================================

Create:

prompts/phase-5-backend/

SPEC-031-vehicle-controller.md

Store this COMPLETE specification.

# ====================================================
# VALIDATION
# ====================================================

Run:

Prisma Generate

Backend Build

Backend Lint

Frontend Build

Frontend Lint

Everything must pass.

# ====================================================
# GIT
# ====================================================

Commit:

feat(vehicle): add controller layer

Push to GitHub.

# ====================================================
# FINAL SUMMARY
# ====================================================

Provide:

Controller Methods

Validation Flow

Response Structure

Files Created

Files Modified

Validation Results

Commit Hash

Push Status
