import { Router, Request, Response, NextFunction } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';

const router = Router();

// Middleware to restrict audit access exclusively to Administrator role
const authorizeAdministrator = (req: Request, res: Response, next: NextFunction): void => {
  const reqWithUser = req as Request & { user?: { role?: string | { name?: string } } };
  const userRole =
    typeof reqWithUser.user?.role === 'object'
      ? reqWithUser.user?.role?.name
      : reqWithUser.user?.role;

  if (userRole && userRole !== 'Administrator' && userRole !== 'ADMINISTRATOR') {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Access restricted to Administrator role',
    });
    return;
  }
  next();
};


router.use(authenticate);
router.use(authorizeAdministrator);


/**
 * @route   GET /api/v1/audit
 * @desc    Get paginated enterprise audit logs with search & filters
 * @access  Private (Administrator only)
 */
router.get('/', AuditController.getAuditLogs);

/**
 * @route   GET /api/v1/audit/meta
 * @desc    Get audit filter metadata taxonomy (modules, severities, actions, users)
 * @access  Private (Administrator only)
 */
router.get('/meta', AuditController.getAuditMeta);

/**
 * @route   GET /api/v1/audit/:id
 * @desc    Get single audit log entry by ID
 * @access  Private (Administrator only)
 */
router.get('/:id', AuditController.getAuditLogById);

export default router;
