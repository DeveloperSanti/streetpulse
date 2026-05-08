import { Request, Response } from 'express';
import * as RankService from '../../../domain/rank.service';
import { prisma } from '../../../lib/prisma';
import { ApiResponse } from '../../../shared/response';

export const listRanks = async (req: Request, res: Response): Promise<void> => {
  const result = RankService.listRanks();
  res.status(200).json(ApiResponse.success(result));
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await RankService.getRankLeaderboard(req.params.rango, page, limit);
  res.status(200).json(ApiResponse.success(result));
};

export const globalLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await RankService.getGlobalLeaderboard(page, limit);
  res.status(200).json(ApiResponse.success(result));
};

export const listCategories = async (req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany();
  res.status(200).json(ApiResponse.success(categories));
};
