import { apiClient } from './api';

export const profileService = {
  list: () => apiClient.get<any[]>('/access-profiles'),
  create: (data: any) => apiClient.post<any>('/access-profiles', data),
  update: (id: string, data: any) => apiClient.patch<any>(`/access-profiles/${id}`, data),
  delete: (id: string) => apiClient.delete(`/access-profiles/${id}`),
};
