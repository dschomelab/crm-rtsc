import { apiClient } from './api';
import type { Customer, PaginatedResponse } from '@/types/auth';

export const customerService = {
  findAll: (params?: { search?: string; page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return apiClient.get<PaginatedResponse<Customer>>(`/customers${qs ? `?${qs}` : ''}`);
  },
  findById: (id: string) => apiClient.get<Customer>(`/customers/${id}`),
  create: (data: Partial<Customer>) => apiClient.post<Customer>('/customers', data),
  update: (id: string, data: Partial<Customer>) => apiClient.patch<Customer>(`/customers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/customers/${id}`),
};
