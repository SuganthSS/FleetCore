import { Router } from 'express';
import { roleController } from '../controllers/role.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

// Apply authentication to all role routes
router.use(authenticate);

// Restrict role modification and matrix viewing to Administrator role
router.use(authorize('Administrator'));

/**
 * GET /api/v1/roles
 * List all enterprise roles with assigned user counts.
 */
router.get('/', (req, res) => roleController.getRoles(req, res));

/**
 * GET /api/v1/roles/permissions
 * Get enterprise permission matrix definition.
 */
router.get('/permissions', (req, res) => roleController.getPermissionMatrix(req, res));

/**
 * GET /api/v1/roles/:id
 * Retrieve single role detail.
 */
router.get('/:id', (req, res) => roleController.getRoleById(req, res));

/**
 * PUT /api/v1/roles/:id/permissions
 * Update role permissions.
 */
router.put('/:id/permissions', (req, res) => roleController.updateRolePermissions(req, res));

export default router;
