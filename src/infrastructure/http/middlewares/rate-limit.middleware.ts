import rateLimit from 'express-rate-limit';
import { env } from '../../../shared/config';

export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  message: 'Demasiadas peticiones, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.RATE_LIMIT_AUTH_MAX,
  message: 'Demasiados intentos de autenticación, intenta de nuevo más tarde.',
  skipSuccessfulRequests: true,
});
