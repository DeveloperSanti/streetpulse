import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors';
import { ApiResponse } from '../../../shared/response';

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(ApiResponse.error(err.code, err.message, err.details));
    return;
  }

  console.error('Error inesperado:', err);
  res.status(500).json(ApiResponse.error('INTERNAL_SERVER_ERROR', 'Ocurrió un error inesperado'));
}
