import { Router } from 'express';
import * as ChallengeController from '../controllers/challenge.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/challenges', authMiddleware, ChallengeController.listChallenges);
router.post('/challenges', authMiddleware, ChallengeController.sendChallenge);
router.get('/challenges/:id', authMiddleware, ChallengeController.getChallenge);
router.patch('/challenges/:id/accept', authMiddleware, ChallengeController.acceptChallenge);
router.patch('/challenges/:id/reject', authMiddleware, ChallengeController.rejectChallenge);
router.patch('/challenges/:id/cancel', authMiddleware, ChallengeController.cancelChallenge);
router.patch('/challenges/:id/start', authMiddleware, ChallengeController.startChallenge);
router.post('/challenges/:id/result', authMiddleware, ChallengeController.registerResult);
router.post('/challenges/:id/confirm', authMiddleware, ChallengeController.confirmResult);

export default router;
