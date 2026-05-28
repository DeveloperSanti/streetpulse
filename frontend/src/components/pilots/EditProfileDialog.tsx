import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from '@/shared/schemas';
import { usersApi } from '@/api/users.api';
import { useAuthStore } from '@/stores/auth.store';
import type { ErrorResponse, User } from '@/shared/types';

export function EditProfileDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: user.username ?? '',
      foto_perfil: user.foto_perfil ?? '',
      zona_localidad: user.zona_localidad ?? '',
      zona_ciudad: user.zona_ciudad ?? '',
      zona_estado: user.zona_estado ?? '',
      zona_pais: user.zona_pais ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => {
      const cleaned = Object.fromEntries(
        Object.entries(input).filter(([, v]) => v !== '' && v !== undefined)
      );
      return usersApi.updateProfile(cleaned);
    },
    onSuccess: (updated) => {
      setUser(updated);
      qc.invalidateQueries({ queryKey: ['user'] });
      toast.success('Perfil actualizado');
      setOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.error?.message ?? 'No se pudo actualizar'
      );
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Editar perfil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Actualizá tu información pública.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
        >
          <Field
            id="username"
            label="Nombre de piloto"
            register={register('username')}
            error={errors.username?.message}
          />
          <Field
            id="foto_perfil"
            label="Foto de perfil (URL)"
            register={register('foto_perfil')}
            error={errors.foto_perfil?.message}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="zona_ciudad"
              label="Ciudad"
              register={register('zona_ciudad')}
            />
            <Field
              id="zona_localidad"
              label="Localidad"
              register={register('zona_localidad')}
            />
            <Field
              id="zona_estado"
              label="Estado"
              register={register('zona_estado')}
            />
            <Field
              id="zona_pais"
              label="País"
              register={register('zona_pais')}
            />
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
  register,
  error,
}: {
  id: string;
  label: string;
  register: ReturnType<ReturnType<typeof useForm<UpdateProfileInput>>['register']>;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...register} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
