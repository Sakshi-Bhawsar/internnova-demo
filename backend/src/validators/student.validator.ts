import { z } from 'zod';

export const updateStudentProfileSchema = z.object({
  degree: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  skills: z.array(z.string().max(60)).max(30).optional(),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  bio: z.string().max(2000).optional(),
  // User fields that can be updated alongside profile
  fullName: z.string().min(2).max(120).optional(),
  phone: z.string().min(10).max(15).optional().or(z.literal('')),
  college: z.string().max(120).optional(),
  education: z.string().max(120).optional(),
  graduationYear: z.coerce.number().int().min(1990).max(2040).optional(),
});

export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;
