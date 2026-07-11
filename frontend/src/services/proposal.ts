import { apiClient } from './api';
import type { Proposal, PaginatedResponse } from '@/types/auth';

export interface CreateProposalData {
  title: string;
  customerId?: string;
  description?: string;
  validUntil?: string;
  discount?: number;
  shipping?: number;
  terms?: string;
  notes?: string;
  items?: { description: string; quantity: number; unitPrice: number }[];
}

export const proposalService = {
  findAll: (params?: { search?: string; status?: string; customerId?: string; page?: number; limit?: number }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.set('search', params.search);
    if (params?.status) sp.set('status', params.status);
    if (params?.customerId) sp.set('customerId', params.customerId);
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    const qs = sp.toString();
    return apiClient.get<PaginatedResponse<Proposal>>(`/proposals${qs ? `?${qs}` : ''}`);
  },
  findById: (id: string) => apiClient.get<Proposal>(`/proposals/${id}`),
  create: (data: CreateProposalData) => apiClient.post<Proposal>('/proposals', data),
  update: (id: string, data: CreateProposalData) => apiClient.patch<Proposal>(`/proposals/${id}`, data),
  send: (id: string) => apiClient.patch<Proposal>(`/proposals/${id}/send`),
  approve: (id: string, data: { action: string; rejectedReason?: string }) => apiClient.patch<Proposal>(`/proposals/${id}/approve`, data),
  delete: (id: string) => apiClient.delete(`/proposals/${id}`),
};
