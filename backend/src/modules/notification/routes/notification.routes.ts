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
 * Roles: Administrator, Fleet Manager, Dispatcher, Maintenance Manager, Accountant, Driver
 */
router.get(
  '/',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher', 'Accountant', 'Driver'),
  (req, res) => notificationController.getNotifications(req, res)
);

/**
 * GET /api/v1/notifications/:id
 * Retrieve single notification history entry by UUID.
 * Roles: Administrator, Fleet Manager, Dispatcher, Accountant, Driver
 */
router.get(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher', 'Accountant', 'Driver'),
  (req, res) => notificationController.getNotification(req, res)
);

/**
 * POST /api/v1/notifications
 * Create a new notification history entry.
 * Roles: Administrator, Fleet Manager, Dispatcher
 */
router.post(
  '/',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher'),
  (req, res) => notificationController.createNotification(req, res)
);

/**
 * PUT /api/v1/notifications/:id
 * Update an existing notification history entry by UUID.
 * Roles: Administrator, Fleet Manager, Dispatcher
 */
router.put(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher'),
  (req, res) => notificationController.updateNotification(req, res)
);

/**
 * DELETE /api/v1/notifications/:id
 * Delete a notification history entry by UUID.
 * Roles: Administrator, Fleet Manager, Dispatcher
 */
router.delete(
  '/:id',
  authorize('Administrator', 'Fleet Manager', 'Dispatcher'),
  (req, res) => notificationController.deleteNotification(req, res)
);

export default router;
