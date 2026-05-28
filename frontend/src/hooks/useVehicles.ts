import { useQuery } from '@tanstack/react-query';
import { vehiclesApi } from '@/api/vehicles.api';

export function useVehicles(enabled = true) {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.list,
    enabled,
  });
}
