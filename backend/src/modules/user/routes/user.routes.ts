import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

// Apply global authentication middleware to all user endpoints
router.use(authenticate);

// Restrict access to all endpoints to Administrator role only
router.use(authorize('Administrator'));

/**
 * GET /api/v1/users
 * List users with pagination, filters, search, and sorting.
 */
router.get('/', (req, res) => userController.getUsers(req, res));

/**
 * GET /api/v1/users/:id
 * Retrieve a single user profile.
 */
router.get('/:id', (req, res) => userController.getUser(req, res));

/**
 * POST /api/v1/users
 * Create a new user record.
 */
router.post('/', (req, res) => userController.createUser(req, res));

/**
 * PUT /api/v1/users/:id
 * Update an existing user record.
 */
router.put('/:id', (req, res) => userController.updateUser(req, res));

/**
 * DELETE /api/v1/users/:id
 * Soft delete a user record.
 */
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

/**
 * PATCH /api/v1/users/:id/status
 * Activate, deactivate, or suspend a user.
 */
router.patch('/:id/status', (req, res) => userController.updateUserStatus(req, res));

/**
 * PATCH /api/v1/users/:id/reset-password
 * Reset a user's password.
 */
router.patch('/:id/reset-password', (req, res) => userController.resetUserPassword(req, res));

export default router;
