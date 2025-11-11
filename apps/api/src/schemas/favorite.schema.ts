import { z } from 'zod';

export const favoriteProductSchema = z.object({
  productId: z.string().length(24)
});
