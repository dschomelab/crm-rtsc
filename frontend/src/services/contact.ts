import { apiClient } from './api';

export const contactService = {
  list: (customerId?: string) => {
    const qs = customerId ? `?customerId=${customerId}` : '';
    return apiClient.get<any[]>(`/contacts${qs}`);
  },
  create: (data: any) => apiClient.post<any>('/contacts', data),
  update: (id: string, data: any) => apiClient.patch<any>(`/contacts/${id}`, data),
  delete: (id: string) => apiClient.delete(`/contacts/${id}`),
};
