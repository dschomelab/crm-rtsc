import { useQuery } from '@tanstack/react-query';
import { pipelineService } from '@/services/pipeline';

export function usePipelines() {
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: () => pipelineService.findAll(),
  });
}

export function usePipeline(id: string | undefined | null) {
  return useQuery({
    queryKey: ['pipelines', id],
    queryFn: () => pipelineService.findById(id!),
    enabled: !!id,
  });
}
