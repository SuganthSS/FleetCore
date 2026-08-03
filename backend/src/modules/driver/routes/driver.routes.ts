import { Router } from 'express';
import { driverController } from '../controllers/driver.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all driver endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/drivers
 * List drivers with pagination, search, filtering, and sorting.
 * Roles: Administrator, Fleet Manager
 */
router.get(
  '/',
  authorize('Administrator', 'Fleet Manager'),
  (req, res) => driverController.getDrivers(req, res)
);

/**
 * GET /api/v1/drivers/:id
 * Retrieve single driver by UUID.
 * Roles: Administrator, Fleet Manager
 */
router.get(
  '/:id',
  authorize('Administrator', 'Fleet Manager'),
  (req, res) => driverController.getDriver(req, res)
);

/**
 * POST /api/v1/drivers
 * Create a new driver profile.
 * Roles: Administrator, Fleet Manager
 */
router.post(
  '/',
  authorize('Administrator', 'Fleet Manager'),
  (req, res) => driverController.createDriver(req, res)
);

/**
 * PUT /api/v1/drivers/:id
 * Update an existing driver profile by UUID.
 * Roles: Administrator, Fleet Manager
 */
router.put(
  '/:id',
  authorize('Administrator', 'Fleet Manager'),
  (req, res) => driverController.updateDriver(req, res)
);

/**
 * DELETE /api/v1/drivers/:id
 * Delete a driver profile by UUID.
 * Roles: Administrator, Fleet Manager
 */
router.delete(
  '/:id',
  authorize('Administrator', 'Fleet Manager'),
  (req, res) => driverController.deleteDriver(req, res)
);

export default router;
