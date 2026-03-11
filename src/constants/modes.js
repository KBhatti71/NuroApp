/**
 * modes.js — Canonical constants for the Emotional Intelligence Layer.
 *
 * APP_MODE:          The top-level context the user is operating in.
 * SESSION_TYPE:      What kind of session is being captured.
 * IMPORTANCE:        Score buckets with display metadata.
 * IMPORTANCE_WEIGHTS: How each signal contributes to the 0-100 score.
 */

export const APP_MODE = {
  NEURO: 'neuro',   // Original study-card mode
  SCHOOL: 'school', // Lecture / study-group intelligence
  WORK: 'work',     // Meeting / stakeholder intelligence
};

export const SESSION_TYPE = {
  // School sessions
  LECTURE:      'lecture',
  STUDY_GROUP:  'study_group',
  OFFICE_HOURS: 'office_hours',

  // Work sessions
  MEETING:      'meeting',
  ONE_ON_ONE:   'one_on_one',
  PRESENTATION: 'presentation',
  STANDUP:      'standup',
};

export const SESSION_TYPE_META = {
  [SESSION_TYPE.LECTURE]:      { label: 'Lecture',       icon: '📚', mode: APP_MODE.SCHOOL },
  [SESSION_TYPE.STUDY_GROUP]:  { label: 'Study Group',   icon: '👥', mode: APP_MODE.SCHOOL },
  [SESSION_TYPE.OFFICE_HOURS]: { label: 'Office Hours',  icon: '🗓️', mode: APP_MODE.SCHOOL },
  [SESSION_TYPE.MEETING]:      { label: 'Meeting',       icon: '💼', mode: APP_MODE.WORK },
  [SESSION_TYPE.ONE_ON_ONE]:   { label: '1:1',           icon: '🤝', mode: APP_MODE.WORK },
  [SESSION_TYPE.PRESENTATION]: { label: 'Presentation',  icon: '📊', mode: APP_MODE.WORK },
  [SESSION_TYPE.STANDUP]:      { label: 'Standup',       icon: '⚡', mode: APP_MODE.WORK },
};

/** Importance buckets — maps a 0-100 score to display metadata. */
export const IMPORTANCE = {
  CRITICAL: { min: 75, label: 'Critical',  stars: 3, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200'    },
  HIGH:     { min: 50, label: 'High',      stars: 2, color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
  MEDIUM:   { min: 25, label: 'Medium',    stars: 1, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
  LOW:      { min: 0,  label: 'Low',       stars: 0, color: 'text-ink-400',    bg: 'bg-surface-50',border: 'border-surface-200'},
};

export function getImportanceTier(score) {
  if (score >= IMPORTANCE.CRITICAL.min) return IMPORTANCE.CRITICAL;
  if (score >= IMPORTANCE.HIGH.min)     return IMPORTANCE.HIGH;
  if (score >= IMPORTANCE.MEDIUM.min)   return IMPORTANCE.MEDIUM;
  return IMPORTANCE.LOW;
}

/**
 * Text-analysis weights for importance scoring.
 * These mirror the architecture spec's weighting model,
 * implemented via LLM analysis instead of prosody hardware.
 */
export const IMPORTANCE_WEIGHTS = {
  KEYWORD_MATCH:     20,
  VOCAL_EMPHASIS:    30,  // proxy: capitalisation, exclamation, repetition
  REPETITION:        20,
  CONTEXT_SIGNAL:    15,
  MANUAL_HIGHLIGHT:  15,
};

export const SCHOOL_KEYWORDS = [
  'important', 'exam', 'test', 'quiz', 'midterm', 'final',
  'remember', 'key concept', 'critical', 'this will be',
  'make sure', 'do not forget', 'highlight', 'write this down',
  'definitely', 'always', 'never', 'fundamental',
];

export const WORK_KEYWORDS = [
  'deadline', 'action item', 'decision', 'blocker', 'urgent',
  'critical', 'must', 'need to', 'by end of', 'committed',
  'agreed', 'follow up', 'risk', 'escalate', 'ship', 'launch',
];
