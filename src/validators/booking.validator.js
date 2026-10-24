import { z } from 'zod';

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un ObjectId válido');

export const bookingIdParamSchema = z.object({
  bid: objectId
});

export const createBookingSchema = z.object({
  clientName: z.string().trim().min(1, 'clientName es obligatorio'),
  clientEmail: z.string().email('clientEmail debe ser un email válido'),
  date: z.string().trim().min(1, 'date es obligatoria'),
  time: z.string().trim().min(1, 'time es obligatoria'),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional()
});

export const updateBookingSchema = createBookingSchema.partial();

export const serviceInBookingParamsSchema = z.object({
  bid: objectId,
  sid: objectId
});

export const addServiceToBookingParamsSchema = serviceInBookingParamsSchema;

export const updateServiceInBookingSchema = z.object({
  quantity: z
    .number({ required_error: 'quantity es obligatorio' })
    .int('quantity debe ser un número entero')
    .positive('quantity debe ser un número positivo')
});
