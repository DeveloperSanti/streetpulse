import { prisma } from '../lib/prisma';
import { comparePassword } from '../lib/bcrypt';
import { AppError, ErrorCodes } from '../shared/errors';

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('Usuario no encontrado', 404, ErrorCodes.NOT_FOUND);
  const { password: _, ...userWithoutPass } = user;
  return userWithoutPass;
}

export async function updateProfile(userId: string, data: Record<string, unknown>) {
  const user = await prisma.user.update({ where: { id: userId }, data });
  const { password: _, ...userWithoutPass } = user;
  return userWithoutPass;
}

export async function deleteAccount(userId: string, password: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('Usuario no encontrado', 404, ErrorCodes.NOT_FOUND);

  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) throw new AppError('Contraseña incorrecta', 401, ErrorCodes.INVALID_CREDENTIALS);

  await prisma.user.delete({ where: { id: userId } });
}

export async function listAvailablePilots(page: number, limit: number, rango?: string, ciudad?: string) {
  const skip = (page - 1) * limit;
  const where: Record<string, unknown> = { estado: 'activo' };
  if (rango) where.rango = rango;
  if (ciudad) where.zona_ciudad = { contains: ciudad, mode: 'insensitive' };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      where: where as any,
      select: {
        id: true, username: true, rango: true,
        victorias: true, derrotas: true,
        zona_ciudad: true, foto_perfil: true,
      },
      orderBy: { victorias: 'desc' },
    }),
    prisma.user.count({ where: where as any }),
  ]);

  return { data, total, page, limit };
}

export async function getPublicProfile(targetUserId: string) {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true, username: true, rango: true,
      victorias: true, derrotas: true,
      zona_ciudad: true, foto_perfil: true, created_at: true,
    },
  });
  if (!user) throw new AppError('Usuario no encontrado', 404, ErrorCodes.NOT_FOUND);
  return user;
}

export async function getUserChallenges(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const where = { OR: [{ retador_id: userId }, { retado_id: userId }] };

  const [data, total] = await Promise.all([
    prisma.challenge.findMany({ skip, take: limit, where, orderBy: { created_at: 'desc' } }),
    prisma.challenge.count({ where }),
  ]);

  return { data, total, page, limit };
}
