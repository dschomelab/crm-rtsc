import { useMutation, type UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useApiMutation<TData = unknown, TError = unknown, TVariables = unknown, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    successMessage?: string;
    invalidateKeys?: string[];
  },
) {
  const qc = useQueryClient();
  return useMutation({
    ...options,
    onSuccess: (...args) => {
      if (options.successMessage) toast.success(options.successMessage);
      if (options.invalidateKeys) options.invalidateKeys.forEach((key) => qc.invalidateQueries({ queryKey: [key] }));
      options.onSuccess?.(...args);
    },
    onError: (error: any, ...args) => {
      toast.error(error?.message ?? 'Erro inesperado');
      options.onError?.(error, ...args);
    },
  });
}
