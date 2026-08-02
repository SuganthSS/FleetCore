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
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => vehicleController.getVehicles(req, res)
);

/**
 * GET /api/v1/vehicles/:id
 * Retrieve single vehicle by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => vehicleController.getVehicle(req, res)
);

/**
 * POST /api/v1/vehicles
 * Create a new vehicle record.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.post(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => vehicleController.createVehicle(req, res)
);

/**
 * PUT /api/v1/vehicles/:id
 * Update an existing vehicle record by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.put(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => vehicleController.updateVehicle(req, res)
);

/**
 * DELETE /api/v1/vehicles/:id
 * Delete a vehicle record by UUID.
 * Roles: Super Admin, Company Admin
 */
router.delete(
  '/:id',
  authorize('Super Admin', 'Company Admin'),
  (req, res) => vehicleController.deleteVehicle(req, res)
);

export default router;
