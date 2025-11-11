import { z } from 'zod';

export const upsertCartItemSchema = z.object({
  productId: z.string().length(24),
  quantity: z.number().int().min(1).max(99).optional()
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99)
});
