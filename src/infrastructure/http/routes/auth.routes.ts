import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', authLimiter, AuthController.refresh);

export default router;
