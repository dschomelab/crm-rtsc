import { apiClient } from './api';

export const auditService = {
  list: (params?: { userId?: string; entity?: string; action?: string }) => {
    const sp = new URLSearchParams();
    if (params?.userId) sp.set('userId', params.userId);
    if (params?.entity) sp.set('entity', params.entity);
    if (params?.action) sp.set('action', params.action);
    const qs = sp.toString();
    return apiClient.get<any[]>(`/audit-logs${qs ? `?${qs}` : ''}`);
  },
};
