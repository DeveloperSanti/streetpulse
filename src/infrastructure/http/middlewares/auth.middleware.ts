import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../../lib/jwt';
import { AppError, ErrorCodes } from '../../../shared/errors';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token no proporcionado', 401, ErrorCodes.UNAUTHORIZED);
  }

  const token = authHeader.substring(7);
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    throw new AppError('Token inválido o expirado', 401, ErrorCodes.UNAUTHORIZED);
  }

  req.user = {
    id: decoded.userId,
    email: decoded.email,
    username: '',
    rango: 'D',
    role: 'piloto',
  };

  next();
}
