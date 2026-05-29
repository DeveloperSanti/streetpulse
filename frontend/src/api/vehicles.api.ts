import { http } from './http';
import type { ApiSuccess, Vehicle } from '@/shared/types';
import type {
  AddVehicleInput,
  UpdateVehicleInput,
} from '@/shared/schemas';

export const vehiclesApi = {
  list: () =>
    http.get<ApiSuccess<Vehicle[]>>('/vehicles').then((r) => r.data.data ?? []),
  add: (input: AddVehicleInput) =>
    http
      .post<ApiSuccess<Vehicle>>('/vehicles', input)
      .then((r) => r.data.data as Vehicle),
  update: (id: string, input: UpdateVehicleInput) =>
    http
      .put<ApiSuccess<Vehicle>>(`/vehicles/${id}`, input)
      .then((r) => r.data.data as Vehicle),
  remove: (id: string) => http.delete(`/vehicles/${id}`),
  activate: (id: string) =>
    http
      .patch<ApiSuccess<Vehicle>>(`/vehicles/${id}/activate`)
      .then((r) => r.data.data as Vehicle),
};
