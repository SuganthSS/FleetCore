import { Router } from 'express';
import { maintenanceController } from '../controllers/maintenance.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all maintenance endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/maintenance
 * List maintenance work orders with pagination, search, filtering, and sorting.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => maintenanceController.getMaintenances(req, res)
);

/**
 * GET /api/v1/maintenance/:id
 * Retrieve single maintenance work order by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => maintenanceController.getMaintenance(req, res)
);

/**
 * POST /api/v1/maintenance
 * Create a new maintenance work order.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.post(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => maintenanceController.createMaintenance(req, res)
);

/**
 * PUT /api/v1/maintenance/:id
 * Update an existing maintenance work order by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.put(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => maintenanceController.updateMaintenance(req, res)
);

/**
 * DELETE /api/v1/maintenance/:id
 * Delete a maintenance work order by UUID.
 * Roles: Super Admin, Company Admin
 */
router.delete(
  '/:id',
  authorize('Super Admin', 'Company Admin'),
  (req, res) => maintenanceController.deleteMaintenance(req, res)
);

export default router;
