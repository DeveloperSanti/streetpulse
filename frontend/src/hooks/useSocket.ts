import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/auth.store';
import { useSocketStore } from '@/stores/socket.store';

const EVENT_TOASTS: Record<string, string> = {
  'challenge:received': 'Te llegó un nuevo reto',
  'challenge:accepted': 'Tu reto fue aceptado',
  'challenge:rejected': 'Tu reto fue rechazado',
  'challenge:cancelled': 'Un reto fue cancelado',
  'challenge:completed': 'Reto completado',
  'challenge:result:pending': 'Hay un resultado por confirmar',
  'rank:upgraded': '¡Subiste de rango!',
};

const ALL_EVENTS = [...Object.keys(EVENT_TOASTS), 'notification:new'];

export function useSocket() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const socket = useSocketStore((s) => s.socket);
  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);
  const qc = useQueryClient();

  useEffect(() => {
    if (accessToken) connect(accessToken);
    else disconnect();
    return () => {
      if (!accessToken) disconnect();
    };
  }, [accessToken, connect, disconnect]);

  useEffect(() => {
    if (!socket) return;

    const handlers = ALL_EVENTS.map((eventName) => {
      const handler = () => {
        const msg = EVENT_TOASTS[eventName];
        if (msg) toast.info(msg);
        qc.invalidateQueries({ queryKey: ['challenges'] });
        qc.invalidateQueries({ queryKey: ['notifications'] });
        qc.invalidateQueries({ queryKey: ['user'] });
      };
      socket.on(eventName, handler);
      return { eventName, handler };
    });

    return () => {
      handlers.forEach(({ eventName, handler }) => socket.off(eventName, handler));
    };
  }, [socket, qc]);
}
