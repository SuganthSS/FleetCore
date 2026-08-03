import { Router } from 'express';
import { routeController } from '../controllers/route.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all route endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/routes
 * List routes with pagination, search, filtering, and sorting.
 * Roles: Administrator, Dispatcher
 */
router.get(
  '/',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => routeController.getRoutes(req, res)
);

/**
 * GET /api/v1/routes/:id
 * Retrieve single route by UUID.
 * Roles: Administrator, Dispatcher
 */
router.get(
  '/:id',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => routeController.getRoute(req, res)
);

/**
 * POST /api/v1/routes
 * Create a new route path.
 * Roles: Administrator, Dispatcher
 */
router.post(
  '/',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => routeController.createRoute(req, res)
);

/**
 * PUT /api/v1/routes/:id
 * Update an existing route by UUID.
 * Roles: Administrator, Dispatcher
 */
router.put(
  '/:id',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => routeController.updateRoute(req, res)
);

/**
 * DELETE /api/v1/routes/:id
 * Delete a route by UUID.
 * Roles: Administrator, Dispatcher
 */
router.delete(
  '/:id',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => routeController.deleteRoute(req, res)
);

export default router;
