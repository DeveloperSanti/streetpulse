import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCodes } from '../../../shared/errors';

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'administrador') {
    throw new AppError('Acceso denegado: se requiere rol administrador', 403, ErrorCodes.FORBIDDEN);
  }
  next();
}
