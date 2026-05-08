import { Request, Response } from 'express';
import * as UserService from '../../../domain/user.service';
import { updateProfileSchema, deleteAccountSchema } from '../validations/user.schema';
import { ApiResponse } from '../../../shared/response';

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const result = await UserService.getMe(req.user!.id);
  res.status(200).json(ApiResponse.success(result));
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const data = updateProfileSchema.parse(req.body);
  const result = await UserService.updateProfile(req.user!.id, data);
  res.status(200).json(ApiResponse.success(result, 'Perfil actualizado exitosamente'));
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  const data = deleteAccountSchema.parse(req.body);
  await UserService.deleteAccount(req.user!.id, data.password);
  res.status(200).json(ApiResponse.success(null, 'Cuenta eliminada exitosamente'));
};

export const listAvailablePilots = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const rango = (req.query.rango as string) || undefined;
  const ciudad = (req.query.ciudad as string) || undefined;
  const result = await UserService.listAvailablePilots(page, limit, rango, ciudad);
  res.status(200).json(ApiResponse.success(result));
};

export const getPublicProfile = async (req: Request, res: Response): Promise<void> => {
  const result = await UserService.getPublicProfile(req.params.id);
  res.status(200).json(ApiResponse.success(result));
};

export const getUserChallenges = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await UserService.getUserChallenges(req.params.id, page, limit);
  res.status(200).json(ApiResponse.success(result));
};
