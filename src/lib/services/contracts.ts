// Service contracts for the CortexLearn AI architecture
// These define the interfaces that services must implement

import { LearningSpace, Material, MaterialChunk, Concept, TeachingPattern, EvidenceReference, StudyCard, PracticeQuiz, QuizQuestion } from '../types/domain';

// Input types for creating entities
export interface CreateLearningSpaceData {
  title: string;
  type: LearningSpace['type'];
  instructorTrainerOrgName?: string;
  subjectDomain?: string;
  termOrDateRange?: string;
  description?: string;
}

export interface MaterialMetadata {
  title: string;
  sourceType: Material['sourceType'];
  mimeType?: string;
}

export interface CardGenerationOptions {
  count?: number;
  mode?: string;
  focus?: string;
}

export interface AnalysisResult {
  concepts: Concept[];
  teachingPatterns: TeachingPattern[];
  evidenceReferences: EvidenceReference[];
}

export interface LearningSpaceService {
  createLearningSpace(data: CreateLearningSpaceData): Promise<LearningSpace>;
  getLearningSpace(id: string): Promise<LearningSpace | null>;
  listLearningSpaces(): Promise<LearningSpace[]>;
  updateLearningSpace(id: string, data: Partial<LearningSpace>): Promise<LearningSpace | null>;
}

export interface MaterialService {
  uploadMaterial(learningSpaceId: string, file: File, metadata: MaterialMetadata): Promise<Material>;
  getMaterial(id: string): Promise<Material | null>;
  listMaterials(learningSpaceId: string): Promise<Material[]>;
  parseMaterial(id: string): Promise<MaterialChunk[]>;
}

export interface AnalysisService {
  analyzeLearningSpace(learningSpaceId: string): Promise<AnalysisResult>;
  detectConcepts(materialId: string): Promise<Concept[]>;
  generateTeachingPatterns(learningSpaceId: string): Promise<TeachingPattern[]>;
}

export interface CardGenerationService {
  generateStudyCards(learningSpaceId: string, options: CardGenerationOptions): Promise<StudyCard[]>;
  updateCard(id: string, updates: Partial<StudyCard>): Promise<StudyCard | null>;
}

export interface QuizService {
  generateQuiz(learningSpaceId: string, mode: string, count?: number): Promise<PracticeQuiz>;
  getQuizQuestions(quizId: string): Promise<QuizQuestion[]>;
  submitAnswer(attemptId: string, questionId: string, answer: string): Promise<boolean>;
}

export interface EvidenceService {
  extractEvidence(materialId: string, conceptId: string): Promise<EvidenceReference[]>;
  validateEvidence(evidence: EvidenceReference): Promise<boolean>;
}

// Re-export domain types for convenience
export * from '../types/domain';