# FleetCore — SPEC-011
## Trip Model

====================================================
CONTEXT
====================================================

You are continuing development of the existing FleetCore repository.

Already implemented:

- Company
- Role
- User
- Driver
- Vehicle
- Customer
- Shipment
- Route

The project architecture, Prisma conventions, documentation style, and coding standards are already established.

Do NOT recreate existing models.

Modify existing models only where required to establish proper relationships.

====================================================
OBJECTIVE
====================================================

Implement ONLY the Trip model.

Trip represents the EXECUTION of a planned shipment.

Trip links together:

- Driver
- Vehicle
- Shipment
- Route
- Company

Trip represents what actually happened.

Route represents what was planned.

Maintain this architectural separation.

Do NOT implement GPS tracking.

Do NOT implement fuel tracking.

Do NOT implement maintenance.

Do NOT implement notifications.

Do NOT implement APIs.

Do NOT create migrations.

Do NOT create seed data.

====================================================
EXISTING DEPENDENCIES
====================================================

Trip belongs to

✓ Company

✓ Driver

✓ Vehicle

✓ Shipment

✓ Route

Update relation arrays in existing models only where necessary.

====================================================
MODEL DOCUMENTATION
====================================================

Document the Trip model using Prisma documentation comments.

Use the same documentation style as all previous models.

====================================================
FIELD ORDER
====================================================

1. Primary Key

2. Trip Identity

3. Execution Information

4. Operational Metrics

5. Foreign Keys

6. Relations

7. Audit Fields

8. Indexes

====================================================
TASK 1
CREATE TRIP MODEL
====================================================

Implement Trip.

Typical fields include

Identity

- id

- tripNumber

Execution

- scheduledStartTime

- actualStartTime

- scheduledEndTime

- actualEndTime

Business

- status

Operational

- actualDistance

- actualDuration

- remarks

Foreign Keys

- companyId

- driverId

- vehicleId

- shipmentId

- routeId

Audit

- createdAt

- updatedAt

Only include fields supported by the FleetCore documentation.

====================================================
TASK 2
RELATIONSHIPS
====================================================

Trip

belongs to

Company

Trip

belongs to

Driver

Trip

belongs to

Vehicle

Trip

belongs to

Shipment

Trip

belongs to

Route

Prepare future relations only for

LocationHistory

FuelRecords

Notifications

Do NOT implement dependent models.

====================================================
TASK 3
ENUMS
====================================================

Create only required enums.

Example

TripStatus

Reuse existing enums whenever possible.

====================================================
TASK 4
CONSTRAINTS
====================================================

Implement

Unique tripNumber

Required

companyId

driverId

vehicleId

shipmentId

routeId

Use appropriate onDelete behavior consistent with existing schema.

====================================================
TASK 5
INDEXES
====================================================

Create indexes

companyId

driverId

vehicleId

shipmentId

routeId

status

scheduledStartTime

actualStartTime

createdAt

====================================================
TASK 6
DOCUMENTATION
====================================================

Update

docs/database/database-schema.md

Document

Trip model

Fields

Relationships

Indexes

Enums

Architectural responsibility

Explain that

Trip = execution

Route = planning

====================================================
TASK 7
AI DEVELOPMENT LOG
====================================================

Append

SPEC-011

Status

Date

Commit

to

docs/AI-DEVELOPMENT-LOG.md

====================================================
TASK 8
PROMPT DOCUMENTATION
====================================================

Create

prompts/phase-2-core/SPEC-011-trip-model.md

Store this COMPLETE specification.

Never summarize.

====================================================
SCHEMA QUALITY CHECK
====================================================

Before finishing verify

✓ Naming consistency

✓ Relation naming consistency

✓ Enum reuse

✓ Cascade rules

✓ Nullable fields

✓ Index quality

✓ Documentation comments

Fix consistency issues only if they do not change the approved architecture.

====================================================
ACCEPTANCE CRITERIA
====================================================

The specification is complete only if

✓ Prisma Format passes

✓ Prisma Validate passes

✓ Prisma Generate passes

✓ Backend Build passes

✓ Frontend Build passes

✓ Type Check passes

✓ Lint passes

✓ No duplicated enums

✓ No duplicated indexes

✓ All relations compile successfully

✓ Existing models remain unchanged except for required relation additions

====================================================
DO NOT IMPLEMENT
====================================================

GPS Tracking

Location History

Fuel

Maintenance

Notifications

AI

Authentication

REST APIs

Frontend

====================================================
GIT
====================================================

Commit

feat(database): add trip model

Push to GitHub.

====================================================
FINAL SUMMARY
====================================================

Provide

Fields Added

Relationships

Enums

Indexes

Constraints

Files Modified

Validation Results

Commit Hash

Push Status
