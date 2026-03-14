import { z, studyModeSchema } from "./shared";
import { evidenceReferenceSchema, visualEvidenceReferenceSchema } from "./evidence-reference";

export const studyCardSchema = z.object({
  id: z.string(),
  learningSpaceId: z.string(),
  conceptId: z.string().optional(),
  topic: z.string(),
  coreIdea: z.string(),
  keyTerms: z.array(z.string()),
  processMechanismFramework: z.string().optional(),
  applicationScenario: z.string().optional(),
  commonMistake: z.string().optional(),
  instructorTrainerEmphasis: z.string().optional(),
  memoryHook: z.string().optional(),
  likelyQuestion: z.string().optional(),
  confidence: z.number(),
  priority: z.number(),
  evidenceSummary: z.string(),
  evidence: z.array(evidenceReferenceSchema),
  visualEvidence: z.array(visualEvidenceReferenceSchema).optional(),
});

export const generateStudyCardsInputSchema = z.object({
  learningSpaceId: z.string(),
  mode: studyModeSchema,
  topicFilter: z.array(z.string()).optional(),
  count: z.number().min(1).max(100).default(15),
});
