import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterInput } from '@/shared/schemas';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import type { ErrorResponse } from '@/shared/types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (tokens) => {
      setSession(tokens);
      navigate('/dashboard', { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const code = error.response?.data?.error?.code;
      const msg = error.response?.data?.error?.message;
      if (code === 'EMAIL_TAKEN') {
        setError('email', { message: 'Email ya registrado' });
      } else if (code === 'USERNAME_TAKEN') {
        setError('username', { message: 'Username ya en uso' });
      } else {
        toast.error(msg ?? 'Error al crear la cuenta');
      }
    },
  });

  return (
    <div className="container mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold mb-6 text-center">Crear cuenta</h1>
      <form
        className="space-y-4"
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
      >
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de piloto</Label>
          <Input
            id="username"
            autoComplete="username"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-sm text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creando...' : 'Crear cuenta'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{' '}
          <Link
            to="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
