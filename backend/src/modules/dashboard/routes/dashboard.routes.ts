import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all dashboard endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/dashboard
 * Return aggregated dashboard analytics overview.
 * Roles: Administrator, Fleet Manager, Dispatcher, Maintenance Manager, Accountant
 */
router.get(
  '/',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher', 'Maintenance Manager', 'Accountant'),
  (req, res) => dashboardController.getDashboardOverview(req, res)
);

export default router;
