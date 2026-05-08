import { Request, Response } from 'express';
import * as AuthService from '../../../domain/auth.service';
import { registerSchema, loginSchema, refreshSchema } from '../validations/auth.schema';
import { ApiResponse } from '../../../shared/response';

export const register = async (req: Request, res: Response): Promise<void> => {
  const data = registerSchema.parse(req.body);
  const result = await AuthService.register(data.username, data.email, data.password);
  res.status(201).json(ApiResponse.success(result, 'Usuario registrado exitosamente'));
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const data = loginSchema.parse(req.body);
  const result = await AuthService.login(data.email, data.password);
  res.status(200).json(ApiResponse.success(result, 'Sesión iniciada exitosamente'));
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  await AuthService.logout(req.body.refreshToken ?? '');
  res.status(200).json(ApiResponse.success(null, 'Sesión cerrada exitosamente'));
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const data = refreshSchema.parse(req.body);
  const result = await AuthService.refreshTokens(data.refreshToken);
  res.status(200).json(ApiResponse.success(result, 'Token renovado exitosamente'));
};
