import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService, type MyActivitiesQuery } from '@/services/activity';

export function useMyActivities(query?: MyActivitiesQuery) {
  return useQuery({
    queryKey: ['my-activities', query],
    queryFn: () => activityService.findMyActivities(query),
  });
}

export function useCompleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}
