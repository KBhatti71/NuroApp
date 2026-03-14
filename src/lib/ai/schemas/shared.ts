import { z } from "zod";

export const learningSpaceTypeSchema = z.enum([
  "course",
  "certification",
  "onboarding",
  "workforce_training",
  "compliance",
  "sales_enablement",
  "custom",
]);

export const materialSourceTypeSchema = z.enum([
  "syllabus",
  "transcript",
  "lecture_note",
  "slide_deck",
  "quiz",
  "exam",
  "answer_key",
  "study_guide",
  "textbook",
  "reading",
  "certification_blueprint",
  "sop",
  "policy",
  "onboarding",
  "training_manual",
  "playbook",
  "meeting_transcript",
  "web_reference",
  "pasted_text",
  "image",
  "screenshot",
  "scanned_page",
  "handwritten_note",
  "whiteboard",
  "diagram",
  "chart",
  "graph",
  "process_map",
  "flowchart",
  "anatomy_image",
  "clinical_visual",
  "equipment_ui",
]);

export const parsingStatusSchema = z.enum([
  "pending",
  "processing",
  "ready",
  "failed",
]);

export const studyModeSchema = z.enum([
  "exam_cram",
  "conceptual_understanding",
  "application_focus",
  "clinical_focus",
  "instructor_wording",
  "quiz_predictor",
  "certification_prep",
  "onboarding_mode",
  "sop_mastery",
  "compliance_risk_review",
  "workforce_quick_recall",
  "interview_prep",
  "troubleshooting_mode",
  "visual_recall_mode",
]);

export { z };
