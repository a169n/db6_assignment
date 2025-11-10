import { z } from 'zod';

export const recommendationSchema = z.object({
  mode: z.enum(['user', 'item']).optional(),
  limit: z.coerce.number().min(1).max(50).default(20)
});
