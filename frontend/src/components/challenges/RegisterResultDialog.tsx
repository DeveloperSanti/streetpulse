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
  registerResultSchema,
  type RegisterResultInput,
} from '@/shared/schemas';
import { useRegisterResult } from '@/hooks/useChallenges';
import type { Challenge, ErrorResponse } from '@/shared/types';

type Props = {
  challenge: Challenge;
  trigger: React.ReactNode;
  retadorLabel: string;
  retadoLabel: string;
};

export function RegisterResultDialog({
  challenge,
  trigger,
  retadorLabel,
  retadoLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const mutation = useRegisterResult(challenge.id as string);

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    reset,
  } = useForm<RegisterResultInput>({
    resolver: zodResolver(registerResultSchema),
    defaultValues: {
      ganador_id: '',
      notas_resultado: '',
    },
  });

  const onSubmit = (data: RegisterResultInput) => {
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '')
    ) as RegisterResultInput;
    mutation.mutate(cleaned, {
      onSuccess: () => {
        toast.success('Resultado registrado, esperando confirmación');
        setOpen(false);
        reset();
      },
      onError: (error: unknown) => {
        const axiosError = error as AxiosError<ErrorResponse>;
        toast.error(
          axiosError.response?.data?.error?.message ??
            'No se pudo registrar el resultado'
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar resultado</DialogTitle>
          <DialogDescription>
            El otro piloto deberá confirmar para cerrar el reto.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <Label>Ganador</Label>
            <Controller
              control={control}
              name="ganador_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná al ganador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={challenge.retador_id as string}>
                      {retadorLabel}
                    </SelectItem>
                    <SelectItem value={challenge.retado_id as string}>
                      {retadoLabel}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.ganador_id && (
              <p className="text-xs text-destructive">
                {errors.ganador_id.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="notas_resultado">Notas (opcional)</Label>
            <Textarea
              id="notas_resultado"
              rows={3}
              {...register('notas_resultado')}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Guardando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
