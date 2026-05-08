import { Socket } from 'socket.io';
import { verifyAccessToken } from '../../lib/jwt';

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void): void {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: no token provided'));
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return next(new Error('Authentication error: invalid token'));
  }

  socket.data.userId = decoded.userId;
  socket.join(`user:${decoded.userId}`);

  next();
}
