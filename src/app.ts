import express from 'express';
import cors from 'cors';
import { env } from './shared/config';
import { globalLimiter } from './infrastructure/http/middlewares/rate-limit.middleware';
import { errorMiddleware } from './infrastructure/http/middlewares/error.middleware';
import routes from './infrastructure/http/routes';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

app.get('/health', (_, res) => res.json({ status: 'ok', version: 'v1' }));

app.use('/v1', routes);

app.use(errorMiddleware);

export default app;
