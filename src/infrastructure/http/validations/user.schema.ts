import { z } from 'zod';

export const updateProfileSchema = z.object({
  username: z.string().min(3).optional(),
  foto_perfil: z.string().url().optional(),
  zona_localidad: z.string().optional(),
  zona_ciudad: z.string().optional(),
  zona_estado: z.string().optional(),
  zona_pais: z.string().optional(),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(8),
});
