import { z, materialSourceTypeSchema } from "./shared";

export const evidenceReferenceSchema = z.object({
  materialId: z.string(),
  materialTitle: z.string(),
  chunkId: z.string().optional(),
  excerpt: z.string(),
  weight: z.number(),
  sourceType: materialSourceTypeSchema,
});

export const visualEvidenceReferenceSchema = z.object({
  materialId: z.string(),
  materialTitle: z.string(),
  thumbnailPath: z.string().optional(),
  ocrSnippet: z.string().optional(),
  summary: z.string().optional(),
  weight: z.number(),
  sourceType: materialSourceTypeSchema,
});
