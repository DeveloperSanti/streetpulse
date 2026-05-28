import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';

export function useUserProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getPublicProfile(id as string),
    enabled: !!id,
  });
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: usersApi.getMe,
    enabled,
  });
}
