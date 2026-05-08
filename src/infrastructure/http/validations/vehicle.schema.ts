import { z } from 'zod';

export const addVehicleSchema = z.object({
  tipo_vehiculo: z.enum(['auto', 'moto', 'monopatin_electrico']),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  anio: z.number().int().min(1900).max(2100),
  placa: z.string().min(1).max(10),
  color: z.string().optional(),
  foto: z.string().url().optional(),
  modificaciones: z.string().optional(),
});

export const updateVehicleSchema = z.object({
  tipo_vehiculo: z.enum(['auto', 'moto', 'monopatin_electrico']).optional(),
  marca: z.string().min(1).optional(),
  modelo: z.string().min(1).optional(),
  anio: z.number().int().min(1900).max(2100).optional(),
  placa: z.string().min(1).max(10).optional(),
  color: z.string().optional(),
  foto: z.string().url().optional(),
  modificaciones: z.string().optional(),
});
