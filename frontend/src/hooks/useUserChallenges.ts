import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';

export function useUserChallenges(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id, 'challenges'],
    queryFn: () => usersApi.getUserChallenges(id as string),
    enabled: !!id,
  });
}
