import { ACTIONS } from './actions';
import { APP_MODE } from '../constants/modes';

// Deep-merge loaded state with initialState so new fields are always present
function migrateState(loaded) {
  return {
    ...initialState,
    ...loaded,
    analysis: { ...initialState.analysis, ...(loaded.analysis || {}) },
    filters: { ...initialState.filters, ...(loaded.filters || {}) },
    pipeline: initialState.pipeline,
    // Intelligence layer — safe defaults for new keys
    appMode:             loaded.appMode             ?? initialState.appMode,
    sessions:            loaded.sessions            ?? initialState.sessions,
    activeSessionId:     loaded.activeSessionId     ?? initialState.activeSessionId,
    sessionAnalysisStatus: initialState.sessionAnalysisStatus,
  };
}

export const initialState = {
  // ── Existing fields ──────────────────────────────────────────────────────
  currentView: 'landing',
  course: null,
  courseMap: null,
  sources: [],
  analysis: {
    professorStyle: null,
    quizPattern: null,
    highYieldConcepts: [],
    analysisTimestamp: null,
  },
  cards: [],
  studyMode: 'all',
  pipeline: {
    status: 'idle',
    progress: 0,
    currentStep: '',
    error: null,
    log: [],
  },
  filters: {
    unitId: null,
    tags: [],
    minQuizLikelihood: 0,
    searchQuery: '',
    pinnedOnly: false,
  },
  sidebarCollapsed: false,

  // ── Intelligence Layer ───────────────────────────────────────────────────
  /** 'neuro' | 'school' | 'work' — which product experience is active */
  appMode: APP_MODE.NEURO,

  /**
   * sessions[] — persisted list of captured lectures / meetings.
   * Each session shape:
   * {
   *   id: uuid,
   *   mode: 'school' | 'work',
   *   type: SESSION_TYPE.*,
   *   title: string,
   *   rawText: string,        // paste-in transcript / notes
   *   analysis: object|null,  // result from lectureAnalyzer / meetingAnalyzer
   *   analysisError: string|null,
   *   createdAt: ISO string,
   * }
   */
  sessions: [],
  activeSessionId: null,

  /** 'idle' | 'running' | 'complete' | 'error' — for the session-level AI call */
  sessionAnalysisStatus: 'idle',
};

export function appReducer(state, action) {
  switch (action.type) {

    case ACTIONS.SET_VIEW:
      return { ...state, currentView: action.payload };

    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case ACTIONS.SET_APP_MODE:
      return { ...state, appMode: action.payload };

    case ACTIONS.SET_COURSE:
      return { ...state, course: action.payload };

    case ACTIONS.SET_COURSE_MAP:
      return { ...state, courseMap: action.payload };

    case ACTIONS.ADD_SOURCE:
      return { ...state, sources: [...state.sources, action.payload] };

    case ACTIONS.REMOVE_SOURCE:
      return { ...state, sources: state.sources.filter(s => s.id !== action.payload) };

    case ACTIONS.UPDATE_SOURCE:
      return {
        ...state,
        sources: state.sources.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        ),
      };

    case ACTIONS.PIPELINE_START:
      return {
        ...state,
        pipeline: { status: 'running', progress: 0, currentStep: 'Starting...', error: null, log: [] },
      };

    case ACTIONS.PIPELINE_STEP:
      return {
        ...state,
        pipeline: {
          ...state.pipeline,
          status: action.payload.status || 'running',
          progress: action.payload.progress,
          currentStep: action.payload.logLine,
          log: [...state.pipeline.log, action.payload.logLine],
        },
      };

    case ACTIONS.PIPELINE_COMPLETE:
      return {
        ...state,
        pipeline: { ...state.pipeline, status: 'complete', progress: 100, currentStep: 'Complete!' },
      };

    case ACTIONS.PIPELINE_ERROR:
      return {
        ...state,
        pipeline: { ...state.pipeline, status: 'error', error: action.payload },
      };

    case ACTIONS.PIPELINE_RESET:
      return { ...state, pipeline: initialState.pipeline };

    case ACTIONS.SET_ANALYSIS:
      return {
        ...state,
        analysis: {
          ...state.analysis,
          ...action.payload,
          analysisTimestamp: new Date().toISOString(),
        },
      };

    case ACTIONS.SET_CARDS:
      return { ...state, cards: action.payload };

    case ACTIONS.TOGGLE_PIN:
      return {
        ...state,
        cards: state.cards.map(c =>
          c.id === action.payload ? { ...c, pinned: !c.pinned } : c
        ),
      };

    case ACTIONS.ADD_CARD_TAG:
      return {
        ...state,
        cards: state.cards.map(c =>
          c.id === action.payload.id
            ? { ...c, tags: [...new Set([...c.tags, action.payload.tag])] }
            : c
        ),
      };

    case ACTIONS.REMOVE_CARD_TAG:
      return {
        ...state,
        cards: state.cards.map(c =>
          c.id === action.payload.id
            ? { ...c, tags: c.tags.filter(t => t !== action.payload.tag) }
            : c
        ),
      };

    case ACTIONS.DELETE_CARD:
      return { ...state, cards: state.cards.filter(c => c.id !== action.payload) };

    case ACTIONS.UPDATE_CARD:
      return {
        ...state,
        cards: state.cards.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };

    case ACTIONS.SET_STUDY_MODE:
      return { ...state, studyMode: action.payload };

    case ACTIONS.SET_FILTER:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case ACTIONS.RESET_FILTERS:
      return { ...state, filters: initialState.filters };

    // ── Intelligence Layer ─────────────────────────────────────────────────

    case ACTIONS.ADD_SESSION:
      return { ...state, sessions: [action.payload, ...state.sessions] };

    case ACTIONS.UPDATE_SESSION:
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
        ),
      };

    case ACTIONS.DELETE_SESSION:
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
        activeSessionId:
          state.activeSessionId === action.payload ? null : state.activeSessionId,
      };

    case ACTIONS.SET_ACTIVE_SESSION:
      return { ...state, activeSessionId: action.payload };

    case ACTIONS.SESSION_ANALYSIS_START:
      return { ...state, sessionAnalysisStatus: 'running' };

    case ACTIONS.SET_SESSION_ANALYSIS:
      return {
        ...state,
        sessionAnalysisStatus: 'idle',
        sessions: state.sessions.map(s =>
          s.id === action.payload.id
            ? { ...s, analysis: action.payload.analysis, analysisError: null }
            : s
        ),
      };

    case ACTIONS.SESSION_ANALYSIS_COMPLETE:
      return { ...state, sessionAnalysisStatus: 'complete' };

    case ACTIONS.SESSION_ANALYSIS_ERROR:
      return {
        ...state,
        sessionAnalysisStatus: 'error',
        sessions: state.sessions.map(s =>
          s.id === action.payload.id
            ? { ...s, analysisError: action.payload.error }
            : s
        ),
      };

    // ── Persistence ────────────────────────────────────────────────────────

    case ACTIONS.HYDRATE: {
      if (!action.payload) return state;
      return migrateState(action.payload);
    }

    case ACTIONS.RESET_ALL:
      return { ...initialState };

    default:
      return state;
  }
}
