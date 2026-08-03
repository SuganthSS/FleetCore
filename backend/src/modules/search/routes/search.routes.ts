import { Router } from 'express';
import { searchController } from '../controllers/search.controller';
import { authenticate } from '../../auth/middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => searchController.globalSearch(req, res));

export default router;
export { router as searchRoutes };
