// Contratos de lo que viaja entre el celular y el servidor (validados con zod en el servidor:
// todo lo que llega del navegador es input NO confiable, 26 §b).

import { z } from 'zod';

const Fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const PiezaEntrante = z.object({
  dia: z.number().int().min(1).max(30),
  titulo: z.string().trim().min(1).max(120),
  contenido: z.string().trim().min(1).max(4000),
  resumen: z.string().trim().max(200).optional(),
  detalle: z
    .array(z.object({ rotulo: z.string().max(60), valor: z.string().max(600) }))
    .max(6)
    .optional(),
  fecha: Fecha,
  creadaEn: z.string().datetime({ offset: true }),
  base: z.boolean().optional(),
  conIA: z.boolean().optional(),
  editadaEn: z.string().datetime({ offset: true }).optional(),
  original: z.object({ contenido: z.string().max(4000), resumen: z.string().max(200).optional() }).optional(),
  tuVersion: z.string().max(4000).optional(),
});
export type PiezaEntrante = z.infer<typeof PiezaEntrante>;

const Texto = (max: number) => z.string().trim().max(max).optional();

/** Respuestas del recorrido de inicio (enums cerrados + textos cortos). */
export const RespuestasEntrantes = z
  .object({
    punto: Texto(40),
    freno: Texto(40),
    frenoOtro: Texto(160),
    area: Texto(40),
    areaOtra: Texto(160),
    areaFinal: z.enum(['servicios', 'cursos', 'productos']).optional(),
    idea: Texto(300),
    momento: z.enum(['manana', 'mediodia', 'noche']).optional(),
    cliente: Texto(160),
    resultado: Texto(160),
    dolor: Texto(160),
  })
  .strip();

export const PerfilEntrante = z.object({
  idea: Texto(300),
  area: z.enum(['servicios', 'cursos', 'productos']).optional(),
  momento: z.enum(['manana', 'mediodia', 'noche']).optional(),
  respuestas: RespuestasEntrantes.optional(),
});
