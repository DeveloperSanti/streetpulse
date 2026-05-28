import { http } from './http';
import type { ApiSuccess, User, Rango, Challenge } from '@/shared/types';

export type ListPilotsParams = {
  page?: number;
  limit?: number;
  rango?: Rango;
  ciudad?: string;
};

export type UpdateProfileInput = {
  username?: string;
  foto_perfil?: string;
  zona_localidad?: string;
  zona_ciudad?: string;
  zona_estado?: string;
  zona_pais?: string;
};

export const usersApi = {
  listAvailablePilots: (params: ListPilotsParams = {}) =>
    http
      .get<ApiSuccess<User[]>>('/users', { params })
      .then((r) => r.data.data ?? []),
  getMe: () =>
    http.get<ApiSuccess<User>>('/users/me').then((r) => r.data.data as User),
  updateProfile: (data: UpdateProfileInput) =>
    http
      .put<ApiSuccess<User>>('/users/me', data)
      .then((r) => r.data.data as User),
  getPublicProfile: (id: string) =>
    http
      .get<ApiSuccess<User>>(`/users/${id}`)
      .then((r) => r.data.data as User),
  getUserChallenges: (
    id: string,
    params: { page?: number; limit?: number } = {}
  ) =>
    http
      .get<ApiSuccess<Challenge[]>>(`/users/${id}/challenges`, { params })
      .then((r) => r.data.data ?? []),
};
