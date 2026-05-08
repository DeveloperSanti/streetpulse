import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../lib/bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { AppError, ErrorCodes } from '../shared/errors';

const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

export async function register(username: string, email: string, password: string) {
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) throw new AppError('Email ya está registrado', 409, ErrorCodes.EMAIL_TAKEN);

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) throw new AppError('Username ya está registrado', 409, ErrorCodes.USERNAME_TAKEN);

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  const accessToken = signAccessToken(user.id, user.email);
  const refreshToken = signRefreshToken(user.id);
  await prisma.refreshToken.create({
    data: { user_id: user.id, token: refreshToken, expires_at: new Date(Date.now() + REFRESH_EXPIRES_MS) },
  });

  const { password: _, ...userWithoutPass } = user;
  return { user: userWithoutPass, accessToken, refreshToken };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Credenciales inválidas', 401, ErrorCodes.INVALID_CREDENTIALS);

  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) throw new AppError('Credenciales inválidas', 401, ErrorCodes.INVALID_CREDENTIALS);

  if (user.estado !== 'activo') throw new AppError('Usuario no está activo', 401, ErrorCodes.UNAUTHORIZED);

  const accessToken = signAccessToken(user.id, user.email);
  const refreshToken = signRefreshToken(user.id);
  await prisma.refreshToken.create({
    data: { user_id: user.id, token: refreshToken, expires_at: new Date(Date.now() + REFRESH_EXPIRES_MS) },
  });

  const { password: _, ...userWithoutPass } = user;
  return { user: userWithoutPass, accessToken, refreshToken };
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
}

export async function refreshTokens(refreshToken: string) {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) throw new AppError('Token inválido', 401, ErrorCodes.UNAUTHORIZED);

  const tokenRecord = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!tokenRecord) throw new AppError('Token no encontrado', 401, ErrorCodes.UNAUTHORIZED);
  if (tokenRecord.expires_at < new Date()) throw new AppError('Token expirado', 401, ErrorCodes.UNAUTHORIZED);

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) throw new AppError('Usuario no encontrado', 404, ErrorCodes.NOT_FOUND);

  await prisma.refreshToken.delete({ where: { token: refreshToken } });

  const newAccessToken = signAccessToken(user.id, user.email);
  const newRefreshToken = signRefreshToken(user.id);
  await prisma.refreshToken.create({
    data: { user_id: user.id, token: newRefreshToken, expires_at: new Date(Date.now() + REFRESH_EXPIRES_MS) },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
