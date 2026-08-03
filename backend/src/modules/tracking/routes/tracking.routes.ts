import { Router } from 'express';
import { trackingController } from '../controllers/tracking.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all tracking endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/tracking
 * List tracking location history entries with pagination, search, filtering, and sorting.
 * Roles: Administrator, Fleet Manager, Dispatcher, Driver
 */
router.get(
  '/',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher', 'Driver'),
  (req, res) => trackingController.getTrackingHistory(req, res)
);

/**
 * GET /api/v1/tracking/:id
 * Retrieve single tracking location history entry by UUID.
 * Roles: Administrator, Fleet Manager, Dispatcher, Driver
 */
router.get(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher', 'Driver'),
  (req, res) => trackingController.getTracking(req, res)
);

/**
 * POST /api/v1/tracking
 * Create a new tracking location history breadcrumb entry.
 * Roles: Administrator, Fleet Manager, Dispatcher, Driver
 */
router.post(
  '/',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher', 'Driver'),
  (req, res) => trackingController.createTracking(req, res)
);

/**
 * PUT /api/v1/tracking/:id
 * Update an existing tracking location history entry by UUID.
 * Roles: Administrator, Fleet Manager, Dispatcher
 */
router.put(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher'),
  (req, res) => trackingController.updateTracking(req, res)
);

/**
 * DELETE /api/v1/tracking/:id
 * Delete a tracking location history entry by UUID.
 * Roles: Administrator, Fleet Manager
 */
router.delete(
  '/:id',
  authorize('Administrator', 'Fleet Manager'),
  (req, res) => trackingController.deleteTracking(req, res)
);

export default router;
