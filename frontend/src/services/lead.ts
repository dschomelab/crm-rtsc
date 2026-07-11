import { apiClient } from './api';
import type { Lead, PaginatedResponse } from '@/types/auth';

export interface LeadFilters {
  pipelineId?: string;
  stageId?: string;
  search?: string;
  status?: string;
  source?: string;
  minValue?: number;
  maxValue?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const leadService = {
  findAll: (params?: LeadFilters) => {
    const searchParams = new URLSearchParams();
    if (params?.pipelineId) searchParams.set('pipelineId', params.pipelineId);
    if (params?.stageId) searchParams.set('stageId', params.stageId);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.source) searchParams.set('source', params.source);
    if (params?.minValue !== undefined) searchParams.set('minValue', String(params.minValue));
    if (params?.maxValue !== undefined) searchParams.set('maxValue', String(params.maxValue));
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const qs = searchParams.toString();
    return apiClient.get<PaginatedResponse<Lead>>(`/leads${qs ? `?${qs}` : ''}`);
  },
  findById: (id: string) => apiClient.get<Lead>(`/leads/${id}`),
  create: (data: Partial<Lead>) => apiClient.post<Lead>('/leads', data),
  update: (id: string, data: Partial<Lead>) => apiClient.patch<Lead>(`/leads/${id}`, data),
  moveToStage: (id: string, stageId: string) => apiClient.patch<Lead>(`/leads/${id}/move`, { stageId }),
  delete: (id: string) => apiClient.delete(`/leads/${id}`),
};
