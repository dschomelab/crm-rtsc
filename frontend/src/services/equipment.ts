import { apiClient } from './api';

export const equipmentService = {
  list: (params?: { type?: string; brand?: string }) => {
    const sp = new URLSearchParams();
    if (params?.type) sp.set('type', params.type);
    if (params?.brand) sp.set('brand', params.brand);
    const qs = sp.toString();
    return apiClient.get<any[]>(`/equipments${qs ? `?${qs}` : ''}`);
  },
  get: (id: string) => apiClient.get<any>(`/equipments/${id}`),
  create: (data: any) => apiClient.post<any>('/equipments', data),
  update: (id: string, data: any) => apiClient.patch<any>(`/equipments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/equipments/${id}`),
};
