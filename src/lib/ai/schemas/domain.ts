import { z, learningSpaceTypeSchema, materialSourceTypeSchema, parsingStatusSchema } from "./shared";

export const learningSpaceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1),
  type: learningSpaceTypeSchema,
  instructorTrainerOrgName: z.string().optional(),
  subjectDomain: z.string().optional(),
  termOrDateRange: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const materialSchema = z.object({
  id: z.string(),
  learningSpaceId: z.string(),
  title: z.string().min(1),
  sourceType: materialSourceTypeSchema,
  mimeType: z.string().optional(),
  storagePath: z.string().optional(),
  rawText: z.string().optional(),
  normalizedText: z.string().optional(),
  parsingStatus: parsingStatusSchema,
  extractionConfidence: z.number().optional(),
  contentHash: z.string().optional(),
  uploadedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const teachingPatternSchema = z.object({
  id: z.string(),
  learningSpaceId: z.string(),
  patternType: z.string(),
  label: z.string(),
  score: z.number(),
  evidenceSummary: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const assessmentPatternSchema = z.object({
  id: z.string(),
  learningSpaceId: z.string(),
  patternType: z.string(),
  label: z.string(),
  score: z.number(),
  evidenceSummary: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createLearningSpaceInputSchema = z.object({
  title: z.string().min(1),
  type: learningSpaceTypeSchema,
  instructorTrainerOrgName: z.string().optional(),
  subjectDomain: z.string().optional(),
  termOrDateRange: z.string().optional(),
  description: z.string().optional(),
});

export const uploadMaterialInputSchema = z.object({
  learningSpaceId: z.string(),
  title: z.string().min(1),
  sourceType: materialSourceTypeSchema,
  content: z.string().optional(),
  mimeType: z.string().optional(),
});
