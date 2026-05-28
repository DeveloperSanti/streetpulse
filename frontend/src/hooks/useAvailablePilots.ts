import { useQuery } from '@tanstack/react-query';
import { usersApi, type ListPilotsParams } from '@/api/users.api';

export function useAvailablePilots(params: ListPilotsParams) {
  return useQuery({
    queryKey: ['pilots', 'available', params],
    queryFn: () => usersApi.listAvailablePilots(params),
  });
}
