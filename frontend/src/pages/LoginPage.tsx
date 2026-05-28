import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '@/shared/schemas';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import type { ErrorResponse } from '@/shared/types';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (tokens) => {
      setSession(tokens);
      const from =
        (location.state as { from?: { pathname: string } } | null)?.from
          ?.pathname ?? '/dashboard';
      navigate(from, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const code = error.response?.data?.error?.code;
      const msg = error.response?.data?.error?.message;
      if (code === 'INVALID_CREDENTIALS')
        toast.error('Credenciales inválidas');
      else toast.error(msg ?? 'Error al iniciar sesión');
    },
  });

  return (
    <div className="container mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Iniciar sesión
      </h1>
      <form
        className="space-y-4"
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
      >
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
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Iniciando...' : 'Iniciar sesión'}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}
