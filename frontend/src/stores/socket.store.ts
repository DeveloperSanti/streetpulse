import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/api/http';

const SOCKET_URL = API_BASE_URL.replace(/\/v1\/?$/, '');

type SocketState = {
  socket: Socket | null;
  connect: (token: string) => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connect: (token) => {
    const existing = get().socket;
    if (existing?.connected) return;
    if (existing) existing.disconnect();

    const socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });
    set({ socket });
  },
  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
}));
