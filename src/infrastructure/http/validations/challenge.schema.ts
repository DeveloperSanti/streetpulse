import { z } from 'zod';

export const sendChallengeSchema = z.object({
  retado_id: z.string().uuid(),
  vehiculo_retador_id: z.string().uuid(),
  tipo_carrera: z.enum(['cuarto_milla', 'vueltas', 'derrape']),
  ubicacion_acordada: z.string().optional(),
  fecha_acordada: z.string().datetime().optional(),
  notas: z.string().optional(),
});

export const acceptChallengeSchema = z.object({
  challengeId: z.string().uuid(),
});

export const registerResultSchema = z.object({
  ganador_id: z.string().uuid(),
  notas_resultado: z.string().optional(),
});
