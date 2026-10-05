import { z } from 'zod';
import { UserRole } from '../types/enums';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long');

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(120),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  phone: z.string().min(10).max(15).optional(),
  education: z.string().max(120).optional(),
  college: z.string().max(120).optional(),
  graduationYear: z.coerce.number().int().min(1990).max(2040).optional(),
  role: z.enum([UserRole.STUDENT, UserRole.MENTOR]).default(UserRole.STUDENT),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
