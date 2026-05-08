import { Request, Response } from 'express';
import * as VehicleService from '../../../domain/vehicle.service';
import { addVehicleSchema, updateVehicleSchema } from '../validations/vehicle.schema';
import { ApiResponse } from '../../../shared/response';

export const listVehicles = async (req: Request, res: Response): Promise<void> => {
  const result = await VehicleService.listVehicles(req.user!.id);
  res.status(200).json(ApiResponse.success(result));
};

export const addVehicle = async (req: Request, res: Response): Promise<void> => {
  const data = addVehicleSchema.parse(req.body);
  const result = await VehicleService.addVehicle(req.user!.id, data);
  res.status(201).json(ApiResponse.success(result, 'Vehículo agregado exitosamente'));
};

export const getVehicle = async (req: Request, res: Response): Promise<void> => {
  const result = await VehicleService.getVehicle(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(result));
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  const data = updateVehicleSchema.parse(req.body);
  const result = await VehicleService.updateVehicle(req.params.id, req.user!.id, data);
  res.status(200).json(ApiResponse.success(result, 'Vehículo actualizado exitosamente'));
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  await VehicleService.deleteVehicle(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(null, 'Vehículo eliminado exitosamente'));
};

export const activateVehicle = async (req: Request, res: Response): Promise<void> => {
  const result = await VehicleService.activateVehicle(req.params.id, req.user!.id);
  res.status(200).json(ApiResponse.success(result, 'Vehículo activado exitosamente'));
};
