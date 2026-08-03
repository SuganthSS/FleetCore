import { Router, Request, Response, NextFunction } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';

const router = Router();

// Restrict all settings endpoints exclusively to Administrator role
const authorizeAdministrator = (req: Request, res: Response, next: NextFunction): void => {
  const reqWithUser = req as Request & { user?: { role?: string | { name?: string } } };
  const userRole =
    typeof reqWithUser.user?.role === 'object'
      ? reqWithUser.user?.role?.name
      : reqWithUser.user?.role;

  if (userRole && userRole !== 'Administrator' && userRole !== 'ADMINISTRATOR') {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Organization settings access is restricted to Administrator role',
    });
    return;
  }
  next();
};

router.use(authenticate);
router.use(authorizeAdministrator);

/**
 * @route   GET /api/v1/settings
 * @desc    Get all combined organization settings & company profile
 */
router.get('/', SettingsController.getAllSettings);

/**
 * @route   GET /api/v1/settings/company
 * @route   PUT /api/v1/settings/company
 */
router.get('/company', SettingsController.getCompanyProfile);
router.put('/company', SettingsController.updateCompanyProfile);

/**
 * @route   POST /api/v1/settings/company/logo
 * @route   DELETE /api/v1/settings/company/logo
 */
router.post('/company/logo', SettingsController.uploadCompanyLogo);
router.delete('/company/logo', SettingsController.deleteCompanyLogo);

/**
 * @route   GET /api/v1/settings/general
 * @route   PUT /api/v1/settings/general
 * @route   GET /api/v1/settings/preferences
 * @route   PUT /api/v1/settings/preferences
 */
router.get('/general', SettingsController.getGeneralSettings);
router.put('/general', SettingsController.updateGeneralSettings);
router.get('/preferences', SettingsController.getGeneralSettings);
router.put('/preferences', SettingsController.updateGeneralSettings);

/**
 * @route   GET /api/v1/settings/security
 * @route   PUT /api/v1/settings/security
 */
router.get('/security', SettingsController.getSecuritySettings);
router.put('/security', SettingsController.updateSecuritySettings);

/**
 * @route   GET /api/v1/settings/notifications
 * @route   PUT /api/v1/settings/notifications
 */
router.get('/notifications', SettingsController.getNotificationSettings);
router.put('/notifications', SettingsController.updateNotificationSettings);

/**
 * @route   GET /api/v1/settings/ai
 * @route   PUT /api/v1/settings/ai
 */
router.get('/ai', SettingsController.getAISettings);
router.put('/ai', SettingsController.updateAISettings);

/**
 * @route   GET /api/v1/settings/integrations
 * @route   PUT /api/v1/settings/integrations
 */
router.get('/integrations', SettingsController.getIntegrationSettings);
router.put('/integrations', SettingsController.updateIntegrationSettings);

export default router;
