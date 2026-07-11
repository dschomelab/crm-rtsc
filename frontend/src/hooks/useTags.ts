import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/services/tag';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.findAll(),
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; color?: string }) => tagService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tags'] }); },
  });
}

export function useAddTagToLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, tagId }: { leadId: string; tagId: string }) =>
      tagService.addToLead(leadId, tagId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads', variables.leadId] });
    },
  });
}

export function useRemoveTagFromLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, tagId }: { leadId: string; tagId: string }) =>
      tagService.removeFromLead(leadId, tagId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads', variables.leadId] });
    },
  });
}
