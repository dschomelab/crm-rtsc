import type { Customer } from '@/types/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer';

export function useCustomers(params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.findAll(params),
  });
}

export function useCustomer(id: string | undefined | null) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customerService.findById(id!),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Customer>) => customerService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); },
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => customerService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); },
  });
}
