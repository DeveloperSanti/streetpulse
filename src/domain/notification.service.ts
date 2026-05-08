import { prisma } from '../lib/prisma';
import { AppError, ErrorCodes } from '../shared/errors';

export async function listNotifications(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const where = { user_id: userId };

  const [data, total] = await Promise.all([
    prisma.notification.findMany({ skip, take: limit, where, orderBy: { created_at: 'desc' } }),
    prisma.notification.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getUnreadCount(userId: string) {
  const count = await prisma.notification.count({ where: { user_id: userId, leida: false } });
  return { count };
}

export async function markAsRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification) throw new AppError('Notificación no encontrada', 404, ErrorCodes.NOT_FOUND);
  if (notification.user_id !== userId) throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  return prisma.notification.update({ where: { id: notificationId }, data: { leida: true } });
}

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({ where: { user_id: userId, leida: false }, data: { leida: true } });
}

export async function deleteNotification(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification) throw new AppError('Notificación no encontrada', 404, ErrorCodes.NOT_FOUND);
  if (notification.user_id !== userId) throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  await prisma.notification.delete({ where: { id: notificationId } });
}
