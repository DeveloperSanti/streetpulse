import { io } from '../infrastructure/websockets/socket.server';

export function emitToUser(userId: string, event: string, data: unknown): void {
  io.to(`user:${userId}`).emit(event, data);
}
