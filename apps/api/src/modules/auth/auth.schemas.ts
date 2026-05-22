import { z } from 'zod';
import { WEAK_PASSWORDS } from './auth.constants';

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters.')
  .max(128, 'Password must be at most 128 characters.')
  .refine((password) => /[A-Z]/.test(password), 'Password must include an uppercase letter.')
  .refine((password) => /[a-z]/.test(password), 'Password must include a lowercase letter.')
  .refine((password) => /[0-9]/.test(password), 'Password must include a number.')
  .refine((password) => /[^A-Za-z0-9]/.test(password), 'Password must include a special character.')
  .refine((password) => !WEAK_PASSWORDS.has(password.toLowerCase()), 'Password is too weak.');

export const registerSchema = z.object({
  email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
  password: passwordSchema,
  name: z.string().trim().min(2).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(128),
});

export const refreshSchema = z.object({
  refreshToken: z.string().trim().min(20),
});
