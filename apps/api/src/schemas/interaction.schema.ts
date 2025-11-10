import { z } from 'zod';

export const createInteractionSchema = z.object({
  productId: z.string().length(24),
  type: z.enum(['view', 'like', 'purchase'])
});
