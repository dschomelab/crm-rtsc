import { apiClient } from './api';
import type { Attachment } from '@/types/auth';

export const attachmentService = {
  findByLead: (leadId: string) => apiClient.get<Attachment[]>(`/leads/${leadId}/attachments`),
  create: (leadId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<Attachment>(`/leads/${leadId}/attachments`, formData);
  },
  delete: (id: string) => apiClient.delete(`/attachments/${id}`),
};
