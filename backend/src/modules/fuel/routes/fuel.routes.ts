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
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => fuelController.getFuelRecords(req, res)
);

/**
 * GET /api/v1/fuel/:id
 * Retrieve single fuel record by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => fuelController.getFuelRecord(req, res)
);

/**
 * POST /api/v1/fuel
 * Create a new vehicle refueling record.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.post(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => fuelController.createFuelRecord(req, res)
);

/**
 * PUT /api/v1/fuel/:id
 * Update an existing fuel record by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.put(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => fuelController.updateFuelRecord(req, res)
);

/**
 * DELETE /api/v1/fuel/:id
 * Delete a fuel record by UUID.
 * Roles: Super Admin, Company Admin
 */
router.delete(
  '/:id',
  authorize('Super Admin', 'Company Admin'),
  (req, res) => fuelController.deleteFuelRecord(req, res)
);

export default router;
