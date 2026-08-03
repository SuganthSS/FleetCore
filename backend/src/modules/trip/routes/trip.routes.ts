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
 * Roles: Administrator, Dispatcher, Driver
 */
router.get(
  '/',
  authorize('Administrator', 'Dispatcher', 'Driver'),
  (req, res) => tripController.getTrips(req, res)
);

/**
 * GET /api/v1/trips/:id
 * Retrieve single trip by UUID.
 * Roles: Administrator, Dispatcher, Driver
 */
router.get(
  '/:id',
  authorize('Administrator', 'Dispatcher', 'Driver'),
  (req, res) => tripController.getTrip(req, res)
);

/**
 * POST /api/v1/trips
 * Create a new trip execution.
 * Roles: Administrator, Dispatcher
 */
router.post(
  '/',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => tripController.createTrip(req, res)
);

/**
 * PUT /api/v1/trips/:id
 * Update an existing trip execution by UUID.
 * Roles: Administrator, Dispatcher, Driver
 */
router.put(
  '/:id',
  authorize('Administrator', 'Dispatcher', 'Driver'),
  (req, res) => tripController.updateTrip(req, res)
);

/**
 * DELETE /api/v1/trips/:id
 * Delete a trip execution by UUID.
 * Roles: Administrator, Dispatcher
 */
router.delete(
  '/:id',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => tripController.deleteTrip(req, res)
);

export default router;
