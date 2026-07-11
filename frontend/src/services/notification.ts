import { apiClient } from './api';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message?: string;
  link?: string;
  readAt?: string;
  createdAt: string;
}

export const notificationService = {
  findAll: (params?: { unreadOnly?: boolean; limit?: number }) => {
    const sp = new URLSearchParams();
    if (params?.unreadOnly) sp.set('unreadOnly', 'true');
    if (params?.limit) sp.set('limit', String(params.limit));
    const qs = sp.toString();
    return apiClient.get<{ data: Notification[]; totalUnread: number }>(`/notifications${qs ? `?${qs}` : ''}`);
  },
  markAsRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all'),
};
