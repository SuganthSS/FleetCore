import { Router } from 'express';
import { shipmentController } from '../controllers/shipment.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all shipment endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/shipments
 * List shipments with pagination, search, filtering, and sorting.
 * Roles: Administrator, Dispatcher
 */
router.get(
  '/',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => shipmentController.getShipments(req, res)
);

/**
 * GET /api/v1/shipments/:id
 * Retrieve single shipment by UUID.
 * Roles: Administrator, Dispatcher
 */
router.get(
  '/:id',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => shipmentController.getShipment(req, res)
);

/**
 * POST /api/v1/shipments
 * Create a new shipment order.
 * Roles: Administrator, Dispatcher
 */
router.post(
  '/',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => shipmentController.createShipment(req, res)
);

/**
 * PUT /api/v1/shipments/:id
 * Update an existing shipment by UUID.
 * Roles: Administrator, Dispatcher
 */
router.put(
  '/:id',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => shipmentController.updateShipment(req, res)
);

/**
 * DELETE /api/v1/shipments/:id
 * Delete a shipment order by UUID.
 * Roles: Administrator, Dispatcher
 */
router.delete(
  '/:id',
  authorize('Administrator', 'Dispatcher'),
  (req, res) => shipmentController.deleteShipment(req, res)
);

export default router;
