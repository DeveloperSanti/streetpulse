import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .optional()
    .or(z.literal('')),
  foto_perfil: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .or(z.literal('')),
  zona_localidad: z.string().optional(),
  zona_ciudad: z.string().optional(),
  zona_estado: z.string().optional(),
  zona_pais: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
