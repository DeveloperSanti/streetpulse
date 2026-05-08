import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../shared/config';

export function signAccessToken(userId: string, email: string): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any, algorithm: 'HS256' };
  return jwt.sign({ userId, email }, env.JWT_SECRET, options);
}

export function signRefreshToken(userId: string): string {
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any, algorithm: 'HS256' };
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] }) as { userId: string };
  } catch {
    return null;
  }
}
