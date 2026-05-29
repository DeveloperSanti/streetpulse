import { http } from './http';
import type { ApiSuccess, Challenge, Paginated } from '@/shared/types';
import type { SendChallengeInput, RegisterResultInput } from '@/shared/schemas';

export const challengesApi = {
  list: (params: { page?: number; limit?: number } = {}) =>
    http
      .get<ApiSuccess<Paginated<Challenge>>>('/challenges', { params })
      .then((r) => r.data.data?.data ?? []),
  send: (input: SendChallengeInput) =>
    http
      .post<ApiSuccess<Challenge>>('/challenges', input)
      .then((r) => r.data.data as Challenge),
  accept: (id: string) =>
    http
      .patch<ApiSuccess<Challenge>>(`/challenges/${id}/accept`)
      .then((r) => r.data.data as Challenge),
  reject: (id: string) =>
    http
      .patch<ApiSuccess<Challenge>>(`/challenges/${id}/reject`)
      .then((r) => r.data.data as Challenge),
  cancel: (id: string) => http.patch(`/challenges/${id}/cancel`),
  start: (id: string) =>
    http
      .patch<ApiSuccess<Challenge>>(`/challenges/${id}/start`)
      .then((r) => r.data.data as Challenge),
  registerResult: (id: string, input: RegisterResultInput) =>
    http
      .post<ApiSuccess<Challenge>>(`/challenges/${id}/result`, input)
      .then((r) => r.data.data as Challenge),
  confirmResult: (id: string) =>
    http
      .post<ApiSuccess<Challenge>>(`/challenges/${id}/confirm`)
      .then((r) => r.data.data as Challenge),
};
