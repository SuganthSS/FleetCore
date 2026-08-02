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
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => shipmentController.getShipments(req, res)
);

/**
 * GET /api/v1/shipments/:id
 * Retrieve single shipment by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => shipmentController.getShipment(req, res)
);

/**
 * POST /api/v1/shipments
 * Create a new shipment order.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.post(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => shipmentController.createShipment(req, res)
);

/**
 * PUT /api/v1/shipments/:id
 * Update an existing shipment by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.put(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => shipmentController.updateShipment(req, res)
);

/**
 * DELETE /api/v1/shipments/:id
 * Delete a shipment order by UUID.
 * Roles: Super Admin, Company Admin
 */
router.delete(
  '/:id',
  authorize('Super Admin', 'Company Admin'),
  (req, res) => shipmentController.deleteShipment(req, res)
);

export default router;
