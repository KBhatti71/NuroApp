import { z } from 'zod';

const keyTermSchema = z.object({
  term: z.string(),
  definition: z.string(),
});

export const cardOutputSchema = z.object({
  topic: z.string(),
  coreIdea: z.string(),
  keyTerms: z.array(keyTermSchema),
  mechanism: z.string(),
  clinicalTieIn: z.string(),
  professorEmphasis: z.string(),
  memoryHook: z.string(),
  likelyExamQuestion: z.string(),
  likelyExamAnswer: z.string(),
  quizLikelihood: z.number().min(0).max(1),
});

const enrichmentSourceSchema = z.object({
  title: z.string(),
  type: z.string(),
  url: z.string().nullable(),
  relevance: z.string(),
});

export const enrichmentItemSchema = z.object({
  concept: z.string(),
  background: z.string(),
  keyFacts: z.array(z.string()),
  suggestedSources: z.array(enrichmentSourceSchema),
  searchTerms: z.array(z.string()),
});

const lectureSectionSchema = z.object({
  title: z.string(),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  relatedConcepts: z.array(z.string()),
});

const lectureConceptSchema = z.object({
  name: z.string(),
  explanation: z.string(),
  importance: z.number(),
  importanceReason: z.string(),
});

const crossReferenceSchema = z.object({
  from: z.string(),
  to: z.string(),
  relationship: z.string(),
});

const importantMomentSchema = z.object({
  text: z.string(),
  score: z.number(),
  tier: z.string(),
  reason: z.string(),
});

const flashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
  importance: z.number(),
});

const practiceQuestionSchema = z.object({
  text: z.string(),
  answer: z.string(),
  importance: z.number(),
});

const followUpQuestionSchema = z.object({
  question: z.string(),
  why: z.string(),
  searchTerms: z.array(z.string()),
});

const confusionMomentSchema = z.object({
  text: z.string(),
  context: z.string(),
});

export const lectureAnalysisSchema = z.object({
  summary: z.string(),
  sections: z.array(lectureSectionSchema),
  keyTakeaways: z.array(z.string()),
  concepts: z.array(lectureConceptSchema),
  crossReferences: z.array(crossReferenceSchema),
  importantMoments: z.array(importantMomentSchema),
  flashcards: z.array(flashcardSchema),
  questions: z.array(practiceQuestionSchema),
  followUpQuestions: z.array(followUpQuestionSchema),
  confusionMoments: z.array(confusionMomentSchema),
  studySuggestions: z.array(z.string()),
  enrichment: z.array(enrichmentItemSchema).optional(),
});

const decisionSchema = z.object({
  text: z.string(),
  support: z.array(z.string()),
  concerns: z.array(z.string()),
  status: z.string(),
  importance: z.number(),
});

const actionItemSchema = z.object({
  owner: z.string(),
  task: z.string(),
  deadline: z.string().nullable(),
  urgency: z.string(),
  committed: z.boolean(),
  importance: z.number(),
});

const stakeholderSchema = z.object({
  name: z.string(),
  sentiment: z.string(),
  keyQuote: z.string(),
  confidence: z.number(),
});

const followUpSchema = z.object({
  topic: z.string(),
  person: z.string().nullable(),
  priority: z.string(),
  context: z.string(),
});

export const meetingAnalysisSchema = z.object({
  summary: z.string(),
  sections: z.array(lectureSectionSchema),
  decisions: z.array(decisionSchema),
  actionItems: z.array(actionItemSchema),
  stakeholders: z.array(stakeholderSchema),
  criticalMoments: z.array(importantMomentSchema),
  followUps: z.array(followUpSchema),
  followUpQuestions: z.array(followUpQuestionSchema),
  crossReferences: z.array(crossReferenceSchema),
  importantMoments: z.array(importantMomentSchema),
  enrichment: z.array(enrichmentItemSchema).optional(),
});

