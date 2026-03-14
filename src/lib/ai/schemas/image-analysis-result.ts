import { z } from "zod";

export const imageMetadataSchema = z.object({
  imageWidth: z.number().optional(),
  imageHeight: z.number().optional(),
  fileFormat: z.string().optional(),
  ocrText: z.string().optional(),
  visualSummary: z.string().optional(),
  detectedLabels: z.array(z.string()).optional(),
  imageType: z.string().optional(),
  instructionalValueScore: z.number().optional(),
  analysisConfidence: z.number().optional(),
  thumbnailPath: z.string().optional(),
  originalAssetPath: z.string().optional(),
});

export const materialVisualElementSchema = z.object({
  id: z.string(),
  materialId: z.string(),
  elementType: z.string(),
  label: z.string().optional(),
  bboxJson: z.record(z.number()).optional(),
  ocrText: z.string().optional(),
  summary: z.string().optional(),
  confidence: z.number().optional(),
  linkedConceptId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const imageAnalysisResultSchema = z.object({
  materialId: z.string(),
  metadata: imageMetadataSchema,
  elements: z.array(materialVisualElementSchema).optional(),
  warnings: z.array(z.string()).optional(),
});
