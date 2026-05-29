import { useState } from 'react';
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
  sendChallengeSchema,
  type SendChallengeInput,
} from '@/shared/schemas';
import { useVehicles } from '@/hooks/useVehicles';
import { useSendChallenge } from '@/hooks/useChallenges';
import type { ErrorResponse, TipoCarrera, User } from '@/shared/types';

const TIPOS: { value: TipoCarrera; label: string }[] = [
  { value: 'cuarto_milla', label: 'Cuarto de milla' },
  { value: 'vueltas', label: 'Vueltas' },
  { value: 'derrape', label: 'Derrape' },
];

const ERROR_MAP: Record<string, string> = {
  SAME_USER: 'No podés retarte a vos mismo',
  DIFFERENT_RANK: 'Solo podés retar pilotos de tu mismo rango',
  DIFFERENT_VEHICLE_TYPE:
    'Tu vehículo y el del piloto deben ser del mismo tipo',
  ACTIVE_CHALLENGE_EXISTS: 'Ya tenés un reto activo con este piloto',
  NO_VEHICLE_REGISTERED: 'El piloto no tiene un vehículo activo',
  VEHICLE_NOT_ACTIVE: 'El vehículo seleccionado no está activo',
};

export function SendChallengeDialog({
  pilot,
  trigger,
}: {
  pilot: User;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const vehicles = useVehicles(open);
  const mutation = useSendChallenge();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<SendChallengeInput>({
    resolver: zodResolver(sendChallengeSchema),
    defaultValues: {
      retado_id: pilot.id ?? '',
      vehiculo_retador_id: '',
      tipo_carrera: 'cuarto_milla',
      ubicacion_acordada: '',
      notas: '',
    },
  });

  const onSubmit = (data: SendChallengeInput) => {
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '')
    ) as SendChallengeInput;
    mutation.mutate(cleaned, {
      onSuccess: () => {
        toast.success(`Reto enviado a ${pilot.username}`);
        setOpen(false);
        reset();
      },
      onError: (error: unknown) => {
        const axiosError = error as AxiosError<ErrorResponse>;
        const code = axiosError.response?.data?.error?.code ?? '';
        toast.error(
          ERROR_MAP[code] ??
            axiosError.response?.data?.error?.message ??
            'No se pudo enviar el reto'
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Retar a {pilot.username}</DialogTitle>
          <DialogDescription>
            Elegí el vehículo y el tipo de carrera.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <Label>Tu vehículo</Label>
            <Controller
              control={control}
              name="vehiculo_retador_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná un vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.data?.length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No tenés vehículos registrados.
                      </div>
                    )}
                    {vehicles.data?.map((v) => (
                      <SelectItem key={v.id} value={v.id as string}>
                        {v.marca} {v.modelo} · {v.placa}
                        {v.activo && ' (activo)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.vehiculo_retador_id && (
              <p className="text-xs text-destructive">
                {errors.vehiculo_retador_id.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Tipo de carrera</Label>
            <Controller
              control={control}
              name="tipo_carrera"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v as TipoCarrera)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
          </div>
          <div className="space-y-1">
            <Label htmlFor="ubicacion">Ubicación (opcional)</Label>
            <Input id="ubicacion" {...register('ubicacion_acordada')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="notas">Notas (opcional)</Label>
            <Textarea id="notas" rows={2} {...register('notas')} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Enviando...' : 'Enviar reto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
