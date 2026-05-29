import { http } from './http';
import type { ApiSuccess, Notification, Paginated } from '@/shared/types';

export const notificationsApi = {
  list: (params: { page?: number; limit?: number } = {}) =>
    http
      .get<ApiSuccess<Paginated<Notification>>>('/notifications', { params })
      .then((r) => r.data.data?.data ?? []),
  unreadCount: () =>
    http
      .get<ApiSuccess<{ count: number }>>('/notifications/unread-count')
      .then((r) => r.data.data?.count ?? 0),
  markAsRead: (id: string) => http.patch(`/notifications/${id}/read`),
  markAllAsRead: () => http.patch('/notifications/read-all'),
  remove: (id: string) => http.delete(`/notifications/${id}`),
};
