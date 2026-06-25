import { z } from "zod";
import { EstadoMembresia } from "@prisma/client";

export const createSocioSchema = z.object({
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  fechaNacimiento: z.string().datetime(),
  numeroSocio: z.string().min(1),
  categoriaSocioId: z.string().uuid(),
  usuarioId: z.string().uuid().optional(),
  tutorId: z.string().uuid().optional(),
  fotoUrl: z.string().url().optional(),
});

export const updateSocioSchema = createSocioSchema.partial();

export const listSociosQuerySchema = z.object({
  nombre: z.string().optional(),
  estado: z.nativeEnum(EstadoMembresia).optional(),
});

export type CreateSocioInput = z.infer<typeof createSocioSchema>;
export type UpdateSocioInput = z.infer<typeof updateSocioSchema>;
export type ListSociosQuery = z.infer<typeof listSociosQuerySchema>;
