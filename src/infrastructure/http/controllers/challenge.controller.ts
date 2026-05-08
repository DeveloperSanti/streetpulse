import { Request, Response } from 'express';
import * as ChallengeService from '../../../domain/challenge.service';
import { sendChallengeSchema, registerResultSchema } from '../validations/challenge.schema';
import { ApiResponse } from '../../../shared/response';

export const listChallenges = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await ChallengeService.listChallenges(req.user!.id, page, limit);
  res.status(200).json(ApiResponse.success(result));
};

export const getChallenge = async (req: Request, res: Response): Promise<void> => {
  const result = await ChallengeService.getChallenge(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(result));
};

export const sendChallenge = async (req: Request, res: Response): Promise<void> => {
  const data = sendChallengeSchema.parse(req.body);
  const result = await ChallengeService.sendChallenge(req.user!.id, data);
  res.status(201).json(ApiResponse.success(result, 'Reto enviado exitosamente'));
};

export const acceptChallenge = async (req: Request, res: Response): Promise<void> => {
  const result = await ChallengeService.acceptChallenge(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(result, 'Reto aceptado'));
};

export const rejectChallenge = async (req: Request, res: Response): Promise<void> => {
  const result = await ChallengeService.rejectChallenge(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(result, 'Reto rechazado'));
};

export const cancelChallenge = async (req: Request, res: Response): Promise<void> => {
  await ChallengeService.cancelChallenge(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(null, 'Reto cancelado'));
};

export const startChallenge = async (req: Request, res: Response): Promise<void> => {
  const result = await ChallengeService.startChallenge(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(result, 'Reto iniciado'));
};

export const registerResult = async (req: Request, res: Response): Promise<void> => {
  const data = registerResultSchema.parse(req.body);
  const result = await ChallengeService.registerResult(req.params.id, req.user!.id, data.ganador_id, data.notas_resultado);
  res.status(200).json(ApiResponse.success(result, 'Resultado registrado'));
};

export const confirmResult = async (req: Request, res: Response): Promise<void> => {
  const result = await ChallengeService.confirmResult(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(result, 'Resultado confirmado'));
};
