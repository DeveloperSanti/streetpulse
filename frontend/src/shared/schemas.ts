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

export const addVehicleSchema = z.object({
  tipo_vehiculo: z.enum(['auto', 'moto', 'monopatin_electrico']),
  marca: z.string().min(1, 'Requerido'),
  modelo: z.string().min(1, 'Requerido'),
  anio: z
    .number({ message: 'Año inválido' })
    .int('Debe ser entero')
    .min(1900, 'Mínimo 1900')
    .max(2100, 'Máximo 2100'),
  placa: z.string().min(1, 'Requerido').max(10, 'Máximo 10 caracteres'),
  color: z.string().optional().or(z.literal('')),
  foto: z.string().url('URL inválida').optional().or(z.literal('')),
  modificaciones: z.string().optional().or(z.literal('')),
});

export const updateVehicleSchema = addVehicleSchema;

export const sendChallengeSchema = z.object({
  retado_id: z.string().uuid(),
  vehiculo_retador_id: z.string().uuid({ message: 'Seleccioná un vehículo' }),
  tipo_carrera: z.enum(['cuarto_milla', 'vueltas', 'derrape']),
  ubicacion_acordada: z.string().optional().or(z.literal('')),
  notas: z.string().optional().or(z.literal('')),
});

export const registerResultSchema = z.object({
  ganador_id: z.string().uuid({ message: 'Seleccioná un ganador' }),
  notas_resultado: z.string().optional().or(z.literal('')),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddVehicleInput = z.infer<typeof addVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type SendChallengeInput = z.infer<typeof sendChallengeSchema>;
export type RegisterResultInput = z.infer<typeof registerResultSchema>;
