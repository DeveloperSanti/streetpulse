import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, UserController.getMe);
router.put('/me', authMiddleware, UserController.updateProfile);
router.delete('/me', authMiddleware, UserController.deleteAccount);
router.get('/', UserController.listAvailablePilots);
router.get('/:id', UserController.getPublicProfile);
router.get('/:id/challenges', UserController.getUserChallenges);

export default router;
