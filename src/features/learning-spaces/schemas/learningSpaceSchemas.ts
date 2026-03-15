import { z } from 'zod';

export const learningSpaceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  type: z.enum([
    "course",
    "certification",
    "onboarding",
    "workforce_training",
    "compliance",
    "sales_enablement",
    "custom"
  ]),
  instructorTrainerOrgName: z.string().optional(),
  subjectDomain: z.string().optional(),
  termOrDateRange: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const createLearningSpaceSchema = learningSpaceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type LearningSpaceInput = z.infer<typeof createLearningSpaceSchema>;
export type LearningSpaceOutput = z.infer<typeof learningSpaceSchema>;