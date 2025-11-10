import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  prefs: z
    .object({
      categories: z.array(z.string()).default([]),
      priceRange: z
        .object({
          min: z.number().min(0).default(0),
          max: z.number().min(0).default(0)
        })
        .partial()
        .optional()
    })
    .partial()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});
