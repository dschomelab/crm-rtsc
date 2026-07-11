import { apiClient } from './api';
import type { Activity } from '@/types/auth';

export interface MyActivitiesQuery {
  dateFrom?: string;
  dateTo?: string;
  status?: 'pending' | 'completed' | 'all';
  type?: string;
  leadId?: string;
}

export const activityService = {
  findByLead: (leadId: string) => apiClient.get<Activity[]>(`/leads/${leadId}/activities`),
  create: (leadId: string, data: { type: string; description?: string; dueDate?: string }) =>
    apiClient.post<Activity>(`/leads/${leadId}/activities`, data),
  update: (leadId: string, id: string, data: { type?: string; description?: string }) =>
    apiClient.patch<Activity>(`/leads/${leadId}/activities/${id}`, data),
  delete: (leadId: string, id: string) =>
    apiClient.delete(`/leads/${leadId}/activities/${id}`),
  findMyActivities: (query?: MyActivitiesQuery) => {
    const params = new URLSearchParams();
    if (query?.dateFrom) params.set('dateFrom', query.dateFrom);
    if (query?.dateTo) params.set('dateTo', query.dateTo);
    if (query?.status && query.status !== 'all') params.set('status', query.status);
    if (query?.type) params.set('type', query.type);
    if (query?.leadId) params.set('leadId', query.leadId);
    const qs = params.toString();
    return apiClient.get<Activity[]>(`/activities/my${qs ? `?${qs}` : ''}`);
  },
  complete: (id: string) => apiClient.patch<Activity>(`/activities/${id}/complete`),
};
