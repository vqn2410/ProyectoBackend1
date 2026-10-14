import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().trim().min(1, 'name es obligatorio'),
  description: z.string().trim().min(1, 'description es obligatorio'),
  duration: z.number().positive('duration debe ser un número positivo'),
  price: z.number().positive('price debe ser un número positivo'),
  category: z.string().trim().min(1, 'category es obligatorio'),
  available: z.boolean()
});

export const updateServiceSchema = createServiceSchema.partial();
