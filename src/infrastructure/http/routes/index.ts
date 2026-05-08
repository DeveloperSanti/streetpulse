import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import vehicleRoutes from './vehicle.routes';
import challengeRoutes from './challenge.routes';
import notificationRoutes from './notification.routes';
import ranksRoutes from './ranks.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/', challengeRoutes);
router.use('/', notificationRoutes);
router.use('/', ranksRoutes);

export default router;
