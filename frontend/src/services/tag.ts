import { apiClient } from './api';
import type { Tag } from '@/types/auth';

export const tagService = {
  findAll: () => apiClient.get<Tag[]>('/tags'),
  findById: (id: string) => apiClient.get<Tag>(`/tags/${id}`),
  create: (data: { name: string; color?: string }) =>
    apiClient.post<Tag>('/tags', data),
  update: (id: string, data: { name?: string; color?: string }) =>
    apiClient.patch<Tag>(`/tags/${id}`, data),
  delete: (id: string) => apiClient.delete(`/tags/${id}`),
  addToLead: (leadId: string, tagId: string) =>
    apiClient.post(`/leads/${leadId}/tags`, { tagId }),
  removeFromLead: (leadId: string, tagId: string) =>
    apiClient.delete(`/leads/${leadId}/tags/${tagId}`),
};
