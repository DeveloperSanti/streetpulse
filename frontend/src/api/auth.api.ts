import { http } from './http';
import type { ApiSuccess, AuthTokens, User } from '@/shared/types';
import type { LoginInput, RegisterInput } from '@/shared/schemas';

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

const unwrap = (tokens: AuthTokens | undefined): AuthSession => ({
  accessToken: tokens?.accessToken ?? '',
  refreshToken: tokens?.refreshToken ?? '',
  user: tokens?.user as User,
});

export const authApi = {
  register: (input: RegisterInput): Promise<AuthSession> =>
    http
      .post<ApiSuccess<AuthTokens>>('/auth/register', input)
      .then((r) => unwrap(r.data.data)),
  login: (input: LoginInput): Promise<AuthSession> =>
    http
      .post<ApiSuccess<AuthTokens>>('/auth/login', input)
      .then((r) => unwrap(r.data.data)),
  logout: (refreshToken: string | null) =>
    http.post('/auth/logout', { refreshToken }),
};
