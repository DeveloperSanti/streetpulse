import { prisma } from '../lib/prisma';
import { AppError, ErrorCodes } from '../shared/errors';

export async function listVehicles(userId: string) {
  return prisma.vehicle.findMany({ where: { user_id: userId } });
}

export async function addVehicle(userId: string, data: Record<string, unknown>) {
  const userVehicles = await prisma.vehicle.findMany({ where: { user_id: userId } });
  if (userVehicles.length >= 5) throw new AppError('Máximo 5 vehículos por usuario', 422, ErrorCodes.MAX_VEHICLES_REACHED);

  const existingPlaca = await prisma.vehicle.findUnique({ where: { placa: data.placa as string } });
  if (existingPlaca) throw new AppError('Placa ya está registrada', 400, ErrorCodes.VALIDATION_ERROR);

  return prisma.vehicle.create({
    data: { user_id: userId, ...(data as any), activo: false },
  });
}

export async function getVehicle(vehicleId: string, userId: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError('Vehículo no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (vehicle.user_id !== userId) throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  return vehicle;
}

export async function updateVehicle(vehicleId: string, userId: string, data: Record<string, unknown>) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError('Vehículo no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (vehicle.user_id !== userId) throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  return prisma.vehicle.update({ where: { id: vehicleId }, data: data as any });
}

export async function deleteVehicle(vehicleId: string, userId: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError('Vehículo no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (vehicle.user_id !== userId) throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  await prisma.vehicle.delete({ where: { id: vehicleId } });
}

export async function activateVehicle(vehicleId: string, userId: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError('Vehículo no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (vehicle.user_id !== userId) throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);

  await prisma.vehicle.updateMany({ where: { user_id: userId }, data: { activo: false } });
  return prisma.vehicle.update({ where: { id: vehicleId }, data: { activo: true } });
}
