import { z } from 'zod';

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un ObjectId válido');

export const createBookingSchema = z.object({
  clientName: z.string().trim().min(1, 'clientName es obligatorio'),
  clientEmail: z.string().email('clientEmail debe ser un email válido'),
  date: z.string().trim().min(1, 'date es obligatoria'),
  time: z.string().trim().min(1, 'time es obligatoria'),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional()
});

export const addServiceToBookingParamsSchema = z.object({
  bid: objectId,
  sid: objectId
});
