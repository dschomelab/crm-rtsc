import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attachmentService } from '@/services/attachment';

export function useAttachments(leadId: string | undefined | null) {
  return useQuery({
    queryKey: ['attachments', leadId],
    queryFn: () => attachmentService.findByLead(leadId!),
    enabled: !!leadId,
  });
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, file }: { leadId: string; file: File }) =>
      attachmentService.create(leadId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attachments', variables.leadId] });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => attachmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });
}
