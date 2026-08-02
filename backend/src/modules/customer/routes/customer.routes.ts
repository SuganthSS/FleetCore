import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

/**
 * Apply global authentication middleware to all customer endpoints.
 */
router.use(authenticate);

/**
 * GET /api/v1/customers
 * List customers with pagination, search, filtering, and sorting.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => customerController.getCustomers(req, res)
);

/**
 * GET /api/v1/customers/:id
 * Retrieve single customer profile by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager, Dispatcher
 */
router.get(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager', 'Dispatcher'),
  (req, res) => customerController.getCustomer(req, res)
);

/**
 * POST /api/v1/customers
 * Create a new customer profile.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.post(
  '/',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => customerController.createCustomer(req, res)
);

/**
 * PUT /api/v1/customers/:id
 * Update an existing customer profile by UUID.
 * Roles: Super Admin, Company Admin, Fleet Manager
 */
router.put(
  '/:id',
  authorize('Super Admin', 'Company Admin', 'Fleet Manager'),
  (req, res) => customerController.updateCustomer(req, res)
);

/**
 * DELETE /api/v1/customers/:id
 * Delete a customer profile by UUID.
 * Roles: Super Admin, Company Admin
 */
router.delete(
  '/:id',
  authorize('Super Admin', 'Company Admin'),
  (req, res) => customerController.deleteCustomer(req, res)
);

export default router;
