/**
 * VIEWS - canonical route identifiers used by the custom view-router.
 *
 * Single source of truth: update here, and all navigation helpers +
 * App.jsx will automatically stay in sync.
 */
export const VIEWS = {
  // NeuroCards mode
  LANDING:         'landing',
  COURSE_SETUP:    'course_setup',
  DASHBOARD:       'dashboard',
  IMPORT:          'import',
  ANALYSIS:        'analysis',
  CARD_GENERATION: 'card_generation',
  STUDY_MODES:     'study_modes',
  EXPORT:          'export',

  // Intelligence Layer
  SCHOOL_MODE:     'school_mode',
  WORK_MODE:       'work_mode',
};
