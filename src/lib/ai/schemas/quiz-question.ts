import { z, studyModeSchema } from "./shared";

export const quizQuestionSchema = z.object({
  id: z.string(),
  practiceQuizId: z.string(),
  questionType: z.string(),
  prompt: z.string(),
  choices: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  evidenceSummary: z.string().optional(),
  difficulty: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const generatePracticeQuizInputSchema = z.object({
  learningSpaceId: z.string(),
  mode: studyModeSchema,
  questionCount: z.number().min(1).max(50).default(10),
});
