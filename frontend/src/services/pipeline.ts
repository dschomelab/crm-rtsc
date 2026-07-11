import { apiClient } from './api';
import type { Pipeline } from '@/types/auth';

export const pipelineService = {
  findAll: () => apiClient.get<Pipeline[]>('/pipelines'),
  findById: (id: string) => apiClient.get<Pipeline>(`/pipelines/${id}`),
};
