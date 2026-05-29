import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  addVehicleSchema,
  type AddVehicleInput,
} from '@/shared/schemas';
import { useAddVehicle, useUpdateVehicle } from '@/hooks/useVehicleMutations';
import type { ErrorResponse, TipoVehiculo, Vehicle } from '@/shared/types';

type Props = {
  trigger: React.ReactNode;
  vehicle?: Vehicle;
};

const TIPOS: { value: TipoVehiculo; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'moto', label: 'Moto' },
  { value: 'monopatin_electrico', label: 'Monopatín eléctrico' },
];

export function VehicleFormDialog({ trigger, vehicle }: Props) {
  const [open, setOpen] = useState(false);
  const isEdit = !!vehicle;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<AddVehicleInput>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      tipo_vehiculo: vehicle?.tipo_vehiculo,
      marca: vehicle?.marca ?? '',
      modelo: vehicle?.modelo ?? '',
      anio: vehicle?.anio ?? new Date().getFullYear(),
      placa: vehicle?.placa ?? '',
      color: vehicle?.color ?? '',
      foto: vehicle?.foto ?? '',
      modificaciones: vehicle?.modificaciones ?? '',
    },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const addMutation = useAddVehicle();
  const updateMutation = useUpdateVehicle(vehicle?.id ?? '');
  const mutation = isEdit ? updateMutation : addMutation;

  const onSubmit = (data: AddVehicleInput) => {
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== undefined)
    ) as AddVehicleInput;
    mutation.mutate(cleaned, {
      onSuccess: () => {
        toast.success(isEdit ? 'Vehículo actualizado' : 'Vehículo agregado');
        setOpen(false);
      },
      onError: (error: unknown) => {
        const axiosError = error as AxiosError<ErrorResponse>;
        const code = axiosError.response?.data?.error?.code;
        const msg = axiosError.response?.data?.error?.message;
        if (code === 'MAX_VEHICLES_REACHED') {
          toast.error('Llegaste al máximo de 5 vehículos');
        } else {
          toast.error(msg ?? 'No se pudo guardar el vehículo');
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar vehículo' : 'Agregar vehículo'}
          </DialogTitle>
          <DialogDescription>
            Máximo 5 vehículos por piloto. La placa debe ser única.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <Label>Tipo</Label>
            <Controller
              control={control}
              name="tipo_vehiculo"
              render={({ field }) => (
                <Select
                  value={field.value ?? ''}
                  onValueChange={(v) => field.onChange(v as TipoVehiculo)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tipo_vehiculo && (
              <p className="text-xs text-destructive">
                {errors.tipo_vehiculo.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field id="marca" label="Marca" register={register('marca')} error={errors.marca?.message} />
            <Field id="modelo" label="Modelo" register={register('modelo')} error={errors.modelo?.message} />
            <Field
              id="anio"
              label="Año"
              type="number"
              register={register('anio', { valueAsNumber: true })}
              error={errors.anio?.message}
            />
            <Field id="placa" label="Placa" register={register('placa')} error={errors.placa?.message} />
            <Field id="color" label="Color" register={register('color')} />
            <Field id="foto" label="Foto (URL)" register={register('foto')} error={errors.foto?.message} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="modificaciones">Modificaciones</Label>
            <Textarea id="modificaciones" rows={3} {...register('modificaciones')} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  type = 'text',
  register,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  register: ReturnType<ReturnType<typeof useForm<AddVehicleInput>>['register']>;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} {...register} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
