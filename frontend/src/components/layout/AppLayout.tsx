import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogOut, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RankBadge } from '@/components/pilots/RankBadge';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/api/auth.api';
import { useSocket } from '@/hooks/useSocket';

export default function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clear = useAuthStore((s) => s.clear);

  useSocket();

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(refreshToken),
    onSettled: () => {
      clear();
      navigate('/', { replace: true });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/dashboard" className="text-xl font-bold tracking-tight">
            StreetPulse
          </Link>
          <div className="flex items-center gap-2">
            <NotificationPanel />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <UserIcon className="h-4 w-4" />
                  {user?.username ?? 'Usuario'}
                  {user?.rango && <RankBadge rango={user.rango} className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/me">Mi perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/vehicles">Mis vehículos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/challenges">Mis retos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => logoutMutation.mutate()}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
