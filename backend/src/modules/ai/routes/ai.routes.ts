import { Router } from 'express';
import { aiCopilotController } from '../controllers/ai.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { authorize } from '../../auth/middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('Administrator', 'Fleet Manager', 'Dispatcher', 'Accountant', 'Driver'));

router.get('/insights', (req, res) => aiCopilotController.getInsights(req, res));
router.post('/chat', (req, res) => aiCopilotController.chat(req, res));

export default router;
export { router as aiRoutes };
