import { Router } from 'express';
import { tripController } from '../controllers/trip.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all trip endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/trips
 * List trips with pagination, search, filtering, and sorting.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => tripController.getTrips(req, res)
);

/**
 * GET /api/v1/trips/:id
 * Retrieve single trip by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => tripController.getTrip(req, res)
);

/**
 * POST /api/v1/trips
 * Create a new trip execution.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.post(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => tripController.createTrip(req, res)
);

/**
 * PUT /api/v1/trips/:id
 * Update an existing trip execution by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.put(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => tripController.updateTrip(req, res)
);

/**
 * DELETE /api/v1/trips/:id
 * Delete a trip execution by UUID.
 * Roles: Super Admin, Company Admin
 */
router.delete(
  '/:id',
  authorize('Super Admin', 'Company Admin'),
  (req, res) => tripController.deleteTrip(req, res)
);

export default router;
