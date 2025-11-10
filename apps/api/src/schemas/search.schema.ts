import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().default(''),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.string().optional()
});
