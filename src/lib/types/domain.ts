export type LearningSpaceType =
  | "course"
  | "certification"
  | "onboarding"
  | "workforce_training"
  | "compliance"
  | "sales_enablement"
  | "custom";

export type MaterialSourceType =
  | "syllabus"
  | "transcript"
  | "lecture_note"
  | "slide_deck"
  | "quiz"
  | "exam"
  | "answer_key"
  | "study_guide"
  | "textbook"
  | "reading"
  | "certification_blueprint"
  | "sop"
  | "policy"
  | "onboarding"
  | "training_manual"
  | "playbook"
  | "meeting_transcript"
  | "web_reference"
  | "pasted_text"
  | "image"
  | "screenshot"
  | "scanned_page"
  | "handwritten_note"
  | "whiteboard"
  | "diagram"
  | "chart"
  | "graph"
  | "process_map"
  | "flowchart"
  | "anatomy_image"
  | "clinical_visual"
  | "equipment_ui";

export type ParsingStatus =
  | "pending"
  | "processing"
  | "ready"
  | "failed";

export type AssetType =
  | "study_cards"
  | "flashcards"
  | "rapid_review"
  | "practice_quiz"
  | "weak_area_review"
  | "concept_explanations"
  | "visual_review";

export type StudyMode =
  | "exam_cram"
  | "conceptual_understanding"
  | "application_focus"
  | "clinical_focus"
  | "instructor_wording"
  | "quiz_predictor"
  | "certification_prep"
  | "onboarding_mode"
  | "sop_mastery"
  | "compliance_risk_review"
  | "workforce_quick_recall"
  | "interview_prep"
  | "troubleshooting_mode"
  | "visual_recall_mode";

export type ConfidenceLabel =
  | "low"
  | "medium"
  | "high";

export type EmphasisLabel =
  | "high_emphasis"
  | "likely_quiz_signal"
  | "clarification_moment"
  | "warning_moment"
  | "strong_confidence_delivery"
  | "possible_practical_importance"
  | "possible_contrast_emphasis";

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningSpace {
  id: string;
  userId: string;
  title: string;
  type: LearningSpaceType;
  instructorTrainerOrgName?: string;
  subjectDomain?: string;
  termOrDateRange?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  learningSpaceId: string;
  title: string;
  sourceType: MaterialSourceType;
  mimeType?: string;
  storagePath?: string;
  rawText?: string;
  normalizedText?: string;
  parsingStatus: ParsingStatus;
  extractionConfidence?: number;
  contentHash?: string;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialChunk {
  id: string;
  materialId: string;
  chunkIndex: number;
  text: string;
  tokenCount?: number;
  topicTags: string[];
  moduleHint?: string;
  embeddingStatus: ParsingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialVisualElement {
  id: string;
  materialId: string;
  elementType: string;
  label?: string;
  bboxJson?: Record<string, number>;
  ocrText?: string;
  summary?: string;
  confidence?: number;
  linkedConceptId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageMetadata {
  imageWidth?: number;
  imageHeight?: number;
  fileFormat?: string;
  ocrText?: string;
  visualSummary?: string;
  detectedLabels?: string[];
  imageType?: string;
  instructionalValueScore?: number;
  analysisConfidence?: number;
  thumbnailPath?: string;
  originalAssetPath?: string;
}

export interface Module {
  id: string;
  learningSpaceId: string;
  title: string;
  sequence?: number;
  description?: string;
  objectives: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  learningSpaceId: string;
  moduleId?: string;
  name: string;
  description?: string;
  priorityScore: number;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Concept {
  id: string;
  learningSpaceId: string;
  topicId?: string;
  name: string;
  canonicalSummary?: string;
  importanceScore: number;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConceptRelationship {
  id: string;
  learningSpaceId: string;
  fromConceptId: string;
  toConceptId: string;
  relationshipType: string;
  strength: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeachingPattern {
  id: string;
  learningSpaceId: string;
  patternType: string;
  label: string;
  score: number;
  evidenceSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentPattern {
  id: string;
  learningSpaceId: string;
  patternType: string;
  label: string;
  score: number;
  evidenceSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmphasisSignal {
  id: string;
  learningSpaceId: string;
  materialId?: string;
  conceptId?: string;
  signalType: string;
  label: EmphasisLabel;
  score: number;
  confidence: number;
  evidenceExcerpt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceReference {
  materialId: string;
  materialTitle: string;
  chunkId?: string;
  excerpt: string;
  weight: number;
  sourceType: MaterialSourceType;
}

export interface VisualEvidenceReference {
  materialId: string;
  materialTitle: string;
  thumbnailPath?: string;
  ocrSnippet?: string;
  summary?: string;
  weight: number;
  sourceType: MaterialSourceType;
}

export interface StudyCard {
  id: string;
  learningSpaceId: string;
  conceptId?: string;
  topic: string;
  coreIdea: string;
  keyTerms: string[];
  processMechanismFramework?: string;
  applicationScenario?: string;
  commonMistake?: string;
  instructorTrainerEmphasis?: string;
  memoryHook?: string;
  likelyQuestion?: string;
  confidence: number;
  priority: number;
  evidenceSummary: string;
  evidence: EvidenceReference[];
  visualEvidence?: VisualEvidenceReference[];
}

export interface PracticeQuiz {
  id: string;
  learningSpaceId: string;
  title: string;
  mode: StudyMode;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  practiceQuizId: string;
  questionType: string;
  prompt: string;
  choices?: string[];
  correctAnswer: string;
  explanation?: string;
  evidenceSummary?: string;
  difficulty: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAttempt {
  id: string;
  userId: string;
  practiceQuizId: string;
  score?: number;
  startedAt: string;
  completedAt?: string;
}

export interface UserAnswer {
  id: string;
  userAttemptId: string;
  quizQuestionId: string;
  selectedAnswer?: string;
  isCorrect?: boolean;
  createdAt: string;
}

export interface WeakArea {
  id: string;
  userId: string;
  learningSpaceId: string;
  conceptId: string;
  weaknessScore: number;
  rationale?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportJob {
  id: string;
  learningSpaceId: string;
  exportType: string;
  status: "pending" | "processing" | "ready" | "failed";
  outputPath?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
