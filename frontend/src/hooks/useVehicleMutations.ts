import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from '@/api/vehicles.api';
import type {
  AddVehicleInput,
  UpdateVehicleInput,
} from '@/shared/schemas';

export function useAddVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddVehicleInput) => vehiclesApi.add(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useUpdateVehicle(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateVehicleInput) => vehiclesApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehiclesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}

export function useActivateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehiclesApi.activate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });
}
