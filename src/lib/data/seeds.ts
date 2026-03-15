import { LearningSpace, Material, StudyCard } from '@/lib/types/domain';
import { mockDb } from '@/lib/db/mockDatabase';

/**
 * Demo data seeder for development and testing
 * Populates the mock database with realistic sample data
 */

export const demoLearningSpaces: LearningSpace[] = [
  {
    id: 'demo-neuroscience',
    title: 'NEUR 301: Systems Neuroscience',
    description: 'Comprehensive study of neural systems and brain function',
    type: 'course',
    instructorTrainerOrgName: 'Dr. Sarah Chen',
    subjectDomain: 'Neuroscience',
    termOrDateRange: 'Spring 2026',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
    materialIds: ['demo-syllabus', 'demo-lecture-1', 'demo-textbook-ch1'],
    userId: 'demo-user'
  },
  {
    id: 'demo-nursing',
    title: 'NURS 401: Advanced Clinical Practice',
    description: 'Advanced nursing concepts and clinical decision making',
    type: 'course',
    instructorTrainerOrgName: 'Prof. Michael Rodriguez',
    subjectDomain: 'Nursing',
    termOrDateRange: 'Fall 2026',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
    materialIds: ['demo-nursing-syllabus', 'demo-clinical-guide'],
    userId: 'demo-user'
  }
];

export const demoMaterials: Material[] = [
  {
    id: 'demo-syllabus',
    learningSpaceId: 'demo-neuroscience',
    title: 'Course Syllabus - NEUR 301',
    sourceType: 'syllabus',
    uploadedAt: '2026-01-10T10:00:00Z',
    parsingStatus: 'ready',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'demo-lecture-1',
    learningSpaceId: 'demo-neuroscience',
    title: 'Lecture 1: Neural Signaling',
    sourceType: 'lecture_note',
    uploadedAt: '2026-01-12T14:30:00Z',
    parsingStatus: 'ready',
    createdAt: '2026-01-12T14:30:00Z',
    updatedAt: '2026-01-12T14:30:00Z'
  }
];

export const demoStudyCards: StudyCard[] = [
  {
    id: 'demo-card-1',
    learningSpaceId: 'demo-neuroscience',
    conceptId: 'demo-concept-ap',
    topic: 'Neural Signaling',
    coreIdea: 'The threshold potential for action potential initiation is typically between -55 mV and -50 mV',
    keyTerms: ['threshold potential', 'action potential', 'voltage-gated channels'],
    processMechanismFramework: 'Depolarization beyond threshold triggers sodium channel opening',
    applicationScenario: 'Understanding why neurons fire at specific membrane potentials',
    commonMistake: 'Confusing resting potential with threshold potential',
    instructorTrainerEmphasis: 'Critical for understanding neural excitability',
    memoryHook: 'Think of threshold as the "point of no return" for neural firing',
    likelyQuestion: 'What membrane potential triggers an action potential?',
    confidence: 0.9,
    priority: 0.8,
    evidenceSummary: 'Lecture notes and textbook emphasize this as a key concept',
    evidence: [{
      materialId: 'demo-lecture-1',
      materialTitle: 'Lecture 1: Neural Signaling',
      excerpt: 'The threshold potential for action potential initiation is typically between -55 mV and -50 mV...',
      weight: 0.9,
      sourceType: 'lecture_note'
    }],
    visualEvidence: []
  }
];

/**
 * Seed the mock database with demo data
 */
export async function seedDemoData(): Promise<void> {
  // Clear existing data
  mockDb.clear();

  // Seed learning spaces
  for (const space of demoLearningSpaces) {
    await mockDb.create('learningSpaces', space);
  }

  // Seed materials
  for (const material of demoMaterials) {
    await mockDb.create('materials', material);
  }

  // Seed study cards
  for (const card of demoStudyCards) {
    await mockDb.create('studyCards', card);
  }

  console.log('Demo data seeded successfully');
}

/**
 * Clear all demo data
 */
export function clearDemoData(): void {
  mockDb.clear();
  console.log('Demo data cleared');
}