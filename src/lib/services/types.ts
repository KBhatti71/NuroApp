import { LearningSpace, Material, MaterialChunk, Concept, TeachingPattern, StudyCard, PracticeQuiz, QuizQuestion, EvidenceReference, StudyMode } from '../types/domain';

// Service input/output types
export interface CreateLearningSpaceData {
  title: string;
  type: LearningSpace['type'];
  instructorTrainerOrgName?: string;
  subjectDomain?: string;
  termOrDateRange?: string;
  description?: string;
}

export interface MaterialMetadata {
  sourceType: Material['sourceType'];
  title?: string;
}

export interface AnalysisResult {
  learningSpaceId: string;
  concepts: Concept[];
  teachingPatterns: TeachingPattern[];
  assessmentPatterns: any[]; // TODO: define properly
  emphasisSignals: any[]; // TODO: define properly
  timestamp: string;
}

export interface CardGenerationOptions {
  mode: StudyMode;
  topicFilter?: string[];
  count?: number;
  minConfidence?: number;
}

// Mock service implementations will be added here
// TODO: Implement mock services for:
// - Material parsing and OCR
// - Image classification
// - Analysis services
// - Card generation
// - Quiz generation
// - Weak area tracking