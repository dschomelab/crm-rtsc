import type { CreateProposalData } from '@/services/proposal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalService } from '@/services/proposal';

export function useProposals(params?: { search?: string; status?: string; customerId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['proposals', params],
    queryFn: () => proposalService.findAll(params),
  });
}

export function useProposal(id: string | undefined | null) {
  return useQuery({
    queryKey: ['proposals', id],
    queryFn: () => proposalService.findById(id!),
    enabled: !!id,
  });
}

export function useCreateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProposalData) => proposalService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['proposals'] }); },
  });
}

export function useUpdateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProposalData }) => proposalService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['proposals'] }); },
  });
}

export function useSendProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => proposalService.send(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['proposals'] }); },
  });
}

export function useApproveProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { action: string; rejectedReason?: string } }) => proposalService.approve(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['proposals'] }); },
  });
}

export function useDeleteProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => proposalService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['proposals'] }); },
  });
}
