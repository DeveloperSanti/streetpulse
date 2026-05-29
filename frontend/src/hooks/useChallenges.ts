import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { challengesApi } from '@/api/challenges.api';
import type {
  RegisterResultInput,
  SendChallengeInput,
} from '@/shared/schemas';

export function useChallenges() {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: () => challengesApi.list({ limit: 50 }),
  });
}

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ['challenges'] });
  qc.invalidateQueries({ queryKey: ['user'] });
}

export function useSendChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SendChallengeInput) => challengesApi.send(input),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useAcceptChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengesApi.accept(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useRejectChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengesApi.reject(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useCancelChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengesApi.cancel(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useStartChallenge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengesApi.start(id),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useRegisterResult(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterResultInput) =>
      challengesApi.registerResult(id, input),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useConfirmResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => challengesApi.confirmResult(id),
    onSuccess: () => invalidateAll(qc),
  });
}
