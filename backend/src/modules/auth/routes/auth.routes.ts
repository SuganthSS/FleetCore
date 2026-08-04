import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authLimiter } from '../../../middlewares/rateLimit.middleware';

const router = Router();

/**
 * Public Authentication Endpoints
 */
router.post('/login', authLimiter, (req, res) => authController.login(req, res));
router.post('/refresh', authLimiter, (req, res) => authController.refreshToken(req, res));
router.post('/forgot-password', authLimiter, (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', authLimiter, (req, res) => authController.resetPassword(req, res));

/**
 * Protected Authentication Endpoints (Requires valid Bearer access token)
 */
router.post('/logout', authenticate, (req, res) => authController.logout(req, res));
router.post('/change-password', authenticate, (req, res) => authController.changePassword(req, res));

export default router;
