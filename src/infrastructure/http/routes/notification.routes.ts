import { Router } from 'express';
import * as NotificationController from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/notifications', authMiddleware, NotificationController.listNotifications);
router.get('/notifications/unread-count', authMiddleware, NotificationController.getUnreadCount);
router.patch('/notifications/:id/read', authMiddleware, NotificationController.markAsRead);
router.patch('/notifications/read-all', authMiddleware, NotificationController.markAllAsRead);
router.delete('/notifications/:id', authMiddleware, NotificationController.deleteNotification);

export default router;
