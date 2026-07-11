import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observationService } from '@/services/observation';

export function useObservations(leadId: string | undefined | null) {
  return useQuery({
    queryKey: ['observations', leadId],
    queryFn: () => observationService.findByLead(leadId!),
    enabled: !!leadId,
  });
}

export function useCreateObservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, content }: { leadId: string; content: string }) =>
      observationService.create(leadId, { content }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['observations', variables.leadId] });
      queryClient.invalidateQueries({ queryKey: ['leads', variables.leadId] });
    },
  });
}

export function useDeleteObservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; leadId: string }) =>
      observationService.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['observations', variables.leadId] });
      queryClient.invalidateQueries({ queryKey: ['leads', variables.leadId] });
    },
  });
}
