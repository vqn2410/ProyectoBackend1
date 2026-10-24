import { z } from 'zod';

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un ObjectId válido');

export const createMessageSchema = z.object({
  user: z.string().trim().min(1, 'user es obligatorio'),
  message: z.string().trim().min(1, 'message es obligatorio')
});

export const messageIdParamSchema = z.object({
  mid: objectId
});
