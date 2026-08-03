import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all vehicle endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/vehicles
 * List vehicles with pagination, search, filtering, and sorting.
 * Roles: Administrator, Fleet Manager, Maintenance Manager
 */
router.get(
  '/',
  authorize('Administrator', 'Fleet Manager', 'Maintenance Manager'),
  (req, res) => vehicleController.getVehicles(req, res)
);

/**
 * GET /api/v1/vehicles/:id
 * Retrieve single vehicle profile by UUID.
 * Roles: Administrator, Fleet Manager, Maintenance Manager
 */
router.get(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Maintenance Manager'),
  (req, res) => vehicleController.getVehicle(req, res)
);

/**
 * POST /api/v1/vehicles
 * Create a new vehicle record.
 * Roles: Administrator, Fleet Manager, Maintenance Manager
 */
router.post(
  '/',
  authorize('Administrator', 'Fleet Manager', 'Maintenance Manager'),
  (req, res) => vehicleController.createVehicle(req, res)
);

/**
 * PUT /api/v1/vehicles/:id
 * Update an existing vehicle record by UUID.
 * Roles: Administrator, Fleet Manager, Maintenance Manager
 */
router.put(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Maintenance Manager'),
  (req, res) => vehicleController.updateVehicle(req, res)
);

/**
 * DELETE /api/v1/vehicles/:id
 * Delete a vehicle record by UUID.
 * Roles: Administrator, Fleet Manager
 */
router.delete(
  '/:id',
  authorize('Administrator', 'Fleet Manager'),
  (req, res) => vehicleController.deleteVehicle(req, res)
);

export default router;
