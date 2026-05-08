import { Request, Response } from 'express';
import * as NotificationService from '../../../domain/notification.service';
import { ApiResponse } from '../../../shared/response';

export const listNotifications = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await NotificationService.listNotifications(req.user!.id, page, limit);
  res.status(200).json(ApiResponse.success(result));
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  const result = await NotificationService.getUnreadCount(req.user!.id);
  res.status(200).json(ApiResponse.success(result));
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const result = await NotificationService.markAsRead(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(result, 'Notificación marcada como leída'));
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  await NotificationService.markAllAsRead(req.user!.id);
  res.status(200).json(ApiResponse.success(null, 'Todas las notificaciones marcadas como leídas'));
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  await NotificationService.deleteNotification(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(null, 'Notificación eliminada'));
};
