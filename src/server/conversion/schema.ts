import { z } from 'zod';

const requiredText = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''));

export const conversionSubmissionSchema = z.object({
  type: z.enum(['demo', 'pilot', 'contact']),
  language: z.enum(['ku', 'ar', 'en']).default('ku'),
  fullName: requiredText(2, 120),
  email: z.string().trim().email().max(254),
  phone: requiredText(6, 32),
  organization: optionalText(160),
  role: optionalText(120),
  country: optionalText(80),
  city: optionalText(80),
  service: optionalText(120),
  message: requiredText(10, 4000),
  consent: z.literal(true),
  sourceUrl: z.string().trim().url().max(2048).optional().or(z.literal('')),
  website: z.string().max(0).optional(),
}).strict();

export type ConversionSubmissionInput = z.infer<typeof conversionSubmissionSchema>;

export type ConversionSubmissionResponse = {
  id: string;
  status: 'received';
  receivedAt: string;
};
