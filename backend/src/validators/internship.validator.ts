import { z } from 'zod';
import { InternshipLevel, InternshipMode, InternshipStatus } from '../types/enums';

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const weekSchema = z.object({
  week: z.number().int().min(1),
  title: z.string().min(1),
  topics: z.array(z.string()).default([]),
});

export const createInternshipSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  category: z.string().min(1).max(100),
  technologies: z.array(z.string()).default([]),
  durationWeeks: z.number().int().min(1).max(52),
  mode: z.nativeEnum(InternshipMode),
  level: z.nativeEnum(InternshipLevel),
  isPaid: z.boolean().default(false),
  price: z.number().min(0).default(0),
  applicationDeadline: z.coerce.date(),
  whatYouLearn: z.array(z.string()).default([]),
  skillsRequired: z.array(z.string()).default([]),
  eligibility: z.string().default(''),
  weeklyCurriculum: z.array(weekSchema).default([]),
  projectInfo: z.string().optional(),
  assessmentInfo: z.string().optional(),
  mentorshipInfo: z.string().optional(),
  faqs: z.array(faqSchema).default([]),
  featured: z.boolean().default(false),
});

export const updateInternshipSchema = createInternshipSchema.partial();

export const publishSchema = z.object({
  status: z.nativeEnum(InternshipStatus),
});

export const internshipQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  tech: z.string().optional(),
  mode: z.nativeEnum(InternshipMode).optional(),
  level: z.nativeEnum(InternshipLevel).optional(),
  paid: z.enum(['true', 'false']).optional(),
  duration: z.coerce.number().int().min(1).optional(),
  sort: z.enum(['newest', 'oldest', 'deadline']).default('newest'),
  featured: z.enum(['true', 'false']).optional(),
});

export type CreateInternshipInput = z.infer<typeof createInternshipSchema>;
export type UpdateInternshipInput = z.infer<typeof updateInternshipSchema>;
export type InternshipQuery = z.infer<typeof internshipQuerySchema>;
