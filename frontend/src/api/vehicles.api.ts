import { http } from './http';
import type { ApiSuccess, Vehicle } from '@/shared/types';

export const vehiclesApi = {
  list: () =>
    http.get<ApiSuccess<Vehicle[]>>('/vehicles').then((r) => r.data.data ?? []),
};
