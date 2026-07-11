import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '@/services/activity';

export function useActivities(leadId: string | undefined | null) {
  return useQuery({
    queryKey: ['activities', leadId],
    queryFn: () => activityService.findByLead(leadId!),
    enabled: !!leadId,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: { type: string; description?: string } }) =>
      activityService.create(leadId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activities', variables.leadId] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, id, data }: { leadId: string; id: string; data: { type?: string; description?: string } }) =>
      activityService.update(leadId, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activities', variables.leadId] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, id }: { leadId: string; id: string }) =>
      activityService.delete(leadId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activities', variables.leadId] });
    },
  });
}
