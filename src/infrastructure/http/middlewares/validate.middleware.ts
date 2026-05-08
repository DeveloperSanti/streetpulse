import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError, ErrorCodes } from '../../../shared/errors';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
        throw new AppError('Error de validación', 400, ErrorCodes.VALIDATION_ERROR, details);
      }
      next(err);
    }
  };
}
