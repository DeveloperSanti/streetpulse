import { Server } from 'socket.io';
import { createServer } from 'http';
import app from '../../app';
import { env } from '../../shared/config';
import { socketAuthMiddleware } from './socket.auth';

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: env.CORS_ORIGIN },
});

io.use(socketAuthMiddleware);

export function startSocketServer(): void {
  httpServer.listen(env.PORT, () => {
    console.log(`StreetPulse API · http://localhost:${env.PORT}`);
    console.log(`DB: PostgreSQL`);
    console.log(`Socket.io listo`);
  });
}

export { httpServer };
