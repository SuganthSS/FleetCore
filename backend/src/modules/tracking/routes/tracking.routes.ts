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
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => trackingController.getTrackingHistory(req, res)
);

/**
 * GET /api/v1/tracking/:id
 * Retrieve single tracking location history entry by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => trackingController.getTracking(req, res)
);

/**
 * POST /api/v1/tracking
 * Create a new tracking location history breadcrumb entry.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.post(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => trackingController.createTracking(req, res)
);

/**
 * PUT /api/v1/tracking/:id
 * Update an existing tracking location history entry by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.put(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => trackingController.updateTracking(req, res)
);

/**
 * DELETE /api/v1/tracking/:id
 * Delete a tracking location history entry by UUID.
 * Roles: Super Admin, Company Admin
 */
router.delete(
  '/:id',
  authorize('Super Admin', 'Company Admin'),
  (req, res) => trackingController.deleteTracking(req, res)
);

export default router;
