import { apiClient } from './api';

export const teamService = {
  list: (companyId?: string) => {
    const qs = companyId ? `?companyId=${companyId}` : '';
    return apiClient.get<any[]>(`/teams${qs}`);
  },
  create: (data: any) => apiClient.post<any>('/teams', data),
  update: (id: string, data: any) => apiClient.patch<any>(`/teams/${id}`, data),
  delete: (id: string) => apiClient.delete(`/teams/${id}`),
};
