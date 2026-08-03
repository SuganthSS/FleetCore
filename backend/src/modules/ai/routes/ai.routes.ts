import { Router } from 'express';
import { aiCopilotController } from '../controllers/ai.controller';

const router = Router();

router.get('/insights', (req, res) => aiCopilotController.getInsights(req, res));
router.post('/chat', (req, res) => aiCopilotController.chat(req, res));

export default router;
export { router as aiRoutes };
