import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all notification endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/notifications
 * List notification history entries with pagination, search, filtering, and sorting.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => notificationController.getNotifications(req, res)
);

/**
 * GET /api/v1/notifications/:id
 * Retrieve single notification history entry by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => notificationController.getNotification(req, res)
);

/**
 * POST /api/v1/notifications
 * Create a new notification history entry.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.post(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => notificationController.createNotification(req, res)
);

/**
 * PUT /api/v1/notifications/:id
 * Update an existing notification history entry by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.put(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => notificationController.updateNotification(req, res)
);

/**
 * DELETE /api/v1/notifications/:id
 * Delete a notification history entry by UUID.
 * Roles: Super Admin, Company Admin
 */
router.delete(
  '/:id',
  authorize('Super Admin', 'Company Admin'),
  (req, res) => notificationController.deleteNotification(req, res)
);

export default router;
