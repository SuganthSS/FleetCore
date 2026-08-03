import { Router } from 'express';
import { fuelController } from '../controllers/fuel.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all fuel endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/fuel
 * List fuel records with pagination, search, filtering, and sorting.
 * Roles: Administrator, Fleet Manager, Accountant, Driver
 */
router.get(
  '/',
  authorize('Administrator', 'Fleet Manager', 'Accountant', 'Driver'),
  (req, res) => fuelController.getFuelRecords(req, res)
);

/**
 * GET /api/v1/fuel/:id
 * Retrieve single fuel record by UUID.
 * Roles: Administrator, Fleet Manager, Accountant, Driver
 */
router.get(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Accountant', 'Driver'),
  (req, res) => fuelController.getFuelRecord(req, res)
);

/**
 * POST /api/v1/fuel
 * Create a new vehicle refueling record.
 * Roles: Administrator, Fleet Manager, Accountant, Driver
 */
router.post(
  '/',
  authorize('Administrator', 'Fleet Manager', 'Accountant', 'Driver'),
  (req, res) => fuelController.createFuelRecord(req, res)
);

/**
 * PUT /api/v1/fuel/:id
 * Update an existing fuel record by UUID.
 * Roles: Administrator, Fleet Manager, Accountant
 */
router.put(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Accountant'),
  (req, res) => fuelController.updateFuelRecord(req, res)
);

/**
 * DELETE /api/v1/fuel/:id
 * Delete a fuel record by UUID.
 * Roles: Administrator, Fleet Manager, Accountant
 */
router.delete(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Accountant'),
  (req, res) => fuelController.deleteFuelRecord(req, res)
);

export default router;
