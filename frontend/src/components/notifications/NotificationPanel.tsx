import { Bell, Check, CheckCheck } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
  useUnreadCount,
} from '@/hooks/useNotifications';

export function NotificationPanel() {
  const notifs = useNotifications();
  const unread = useUnreadCount();
  const markRead = useMarkAsRead();
  const markAll = useMarkAllAsRead();

  const count = unread.data ?? 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notificaciones"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px] rounded-full bg-destructive hover:bg-destructive">
              {count > 99 ? '99+' : count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 gap-0">
        <SheetHeader className="border-b py-3 px-4">
          <SheetTitle className="flex items-center justify-between">
            <span>Notificaciones</span>
            {count > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}
              >
                <CheckCheck className="h-4 w-4" />
                Marcar todas
              </Button>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Lista de notificaciones recibidas en tiempo real.
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-4rem)]">
          {notifs.isLoading && (
            <div className="p-4 space-y-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          )}
          {notifs.isSuccess && notifs.data.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">
              No tenés notificaciones.
            </p>
          )}
          {notifs.isSuccess &&
            notifs.data.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'border-b p-4 flex items-start gap-3',
                  !n.leida && 'bg-accent/40'
                )}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      n.leida && 'text-muted-foreground'
                    )}
                  >
                    {n.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {n.mensaje}
                  </p>
                </div>
                {!n.leida && (
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Marcar como leída"
                    onClick={() => markRead.mutate(n.id as string)}
                    disabled={markRead.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
