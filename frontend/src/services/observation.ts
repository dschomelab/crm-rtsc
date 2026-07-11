import { apiClient } from './api';
import type { Observation } from '@/types/auth';

export const observationService = {
  findByLead: (leadId: string) =>
    apiClient.get<Observation[]>(`/leads/${leadId}/observations`),
  create: (leadId: string, data: { content: string }) =>
    apiClient.post<Observation>(`/leads/${leadId}/observations`, data),
  update: (id: string, data: { content: string }) =>
    apiClient.patch<Observation>(`/observations/${id}`, data),
  delete: (id: string) => apiClient.delete(`/observations/${id}`),
};
