import { Router } from 'express';
import * as RanksController from '../controllers/ranks.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/ranks', authMiddleware, RanksController.listRanks);
router.get('/ranks/global-leaderboard', authMiddleware, RanksController.globalLeaderboard);
router.get('/ranks/:rango/leaderboard', authMiddleware, RanksController.getLeaderboard);
router.get('/categories', RanksController.listCategories);

export default router;
