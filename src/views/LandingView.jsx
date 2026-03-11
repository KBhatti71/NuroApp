import { useAppContext, useNav } from '../hooks/useAppContext';
import { ACTIONS } from '../context/actions';
import { APP_MODE } from '../constants/modes';
import { VIEWS } from '../constants/views';
import { MOCK_CARDS } from '../data/mockCards';
import { mockCourse, mockCourseMap } from '../data/mockCourse';
import { mockProfessorStyle, mockQuizPattern, mockHighYieldConcepts } from '../data/mockAnalysis';

const FEATURES = [
  {
    icon: '↑',
    title: 'Ingest Everything',
    desc: 'Upload syllabi, transcripts, quizzes, slides, notes, textbooks, and web content. All formats welcome.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: '◎',
    title: 'Professor-Aware Analysis',
    desc: 'Detects your professor\'s teaching style, quiz patterns, and what they emphasize — lecture by lecture.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: '▣',
    title: 'High-Yield 3×5 Cards',
    desc: 'Generates concise, testable study cards with mechanisms, clinical tie-ins, and predicted exam questions.',
    color: 'bg-teal-50 text-teal-600',
  },
  {
    icon: '◈',
    title: '7 Study Modes',
    desc: 'Exam Cram, Flashcard, Quiz Predictor, Clinical Focus, Professor Wording, Conceptual, and Syllabus-Aligned.',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const STATS = [
  { value: '8', label: 'Source Formats' },
  { value: '7', label: 'Study Modes' },
  { value: '8', label: 'Card Fields' },
  { value: '100%', label: 'Neuro-Focused' },
];

export default function LandingView() {
  const { dispatch } = useAppContext();
  const navigate = useNav();

  const loadDemo = () => {
    dispatch({ type: ACTIONS.SET_COURSE, payload: mockCourse });
    dispatch({ type: ACTIONS.SET_COURSE_MAP, payload: mockCourseMap });
    dispatch({
      type: ACTIONS.SET_ANALYSIS,
      payload: {
        professorStyle: mockProfessorStyle,
        quizPattern: mockQuizPattern,
        highYieldConcepts: mockHighYieldConcepts,
      },
    });
    dispatch({ type: ACTIONS.SET_CARDS, payload: MOCK_CARDS });
    dispatch({ type: ACTIONS.SET_APP_MODE, payload: APP_MODE.NEURO });
    navigate(VIEWS.CARD_GENERATION);
  };

  const enterSchoolMode = () => {
    dispatch({ type: ACTIONS.SET_APP_MODE, payload: APP_MODE.SCHOOL });
    navigate(VIEWS.SCHOOL_MODE);
  };

  const enterWorkMode = () => {
    dispatch({ type: ACTIONS.SET_APP_MODE, payload: APP_MODE.WORK });
    navigate(VIEWS.WORK_MODE);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-primary-50 to-surface-100 flex flex-col">
      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-surface-200 bg-surface-0/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold text-base">N</span>
          </div>
          <div>
            <div className="text-base font-semibold text-ink-900">NeuroCard AI</div>
            <div className="text-xs text-ink-500">Neuroscience Study Intelligence</div>
          </div>
        </div>
        <button
          onClick={loadDemo}
          className="text-sm text-ink-500 hover:text-ink-900 transition-colors underline underline-offset-2"
        >
          Load Demo →
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold mb-6 border border-primary-200">
          ◎ Professor-Aware · Quiz-Aligned · Meeting Intelligence
        </div>

        <h1 className="text-5xl font-bold text-ink-900 tracking-tight max-w-3xl leading-tight mb-5">
          AI intelligence for{' '}
          <span className="text-primary-500">school and work</span>
        </h1>

        <p className="text-xl text-ink-500 max-w-2xl leading-relaxed mb-10">
          Generate high-yield study cards from your class materials, extract importance-scored insights
          from lecture transcripts, and turn meeting chaos into decisions and action items — all in one app.
        </p>

        {/* Three mode cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-8">
          {[
            {
              icon: '🧠',
              title: 'NeuroCards',
              desc: 'Professor-aware 3×5 study cards from your class materials',
              cta: 'Start Course →',
              onClick: () => navigate(VIEWS.COURSE_SETUP),
              demo: { label: 'Load Demo', onClick: loadDemo },
              accent: 'border-primary-300 bg-primary-50',
              ctaClass: 'bg-primary-500 hover:bg-primary-600 text-white',
            },
            {
              icon: '📚',
              title: 'School Mode',
              desc: 'Paste a lecture transcript — AI scores what matters and builds flashcards',
              cta: 'Open School Mode →',
              onClick: enterSchoolMode,
              accent: 'border-violet-300 bg-violet-50',
              ctaClass: 'bg-violet-600 hover:bg-violet-700 text-white',
            },
            {
              icon: '💼',
              title: 'Work Mode',
              desc: 'Extract decisions, action items, and stakeholder signals from meetings',
              cta: 'Open Work Mode →',
              onClick: enterWorkMode,
              accent: 'border-sky-300 bg-sky-50',
              ctaClass: 'bg-sky-600 hover:bg-sky-700 text-white',
            },
          ].map(({ icon, title, desc, cta, onClick, demo, accent, ctaClass }) => (
            <div key={title} className={`border-2 rounded-2xl p-5 flex flex-col gap-3 ${accent}`}>
              <div className="text-3xl">{icon}</div>
              <div>
                <h3 className="text-sm font-bold text-ink-900 mb-1">{title}</h3>
                <p className="text-xs text-ink-600 leading-relaxed">{desc}</p>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={onClick}
                  className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${ctaClass}`}
                >
                  {cta}
                </button>
                {demo && (
                  <button
                    onClick={demo.onClick}
                    className="w-full py-1.5 rounded-lg text-xs text-ink-500 hover:bg-surface-200 transition-colors"
                  >
                    {demo.label}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-400">No sign-up required · All data stored locally · Free</p>

        {/* Stats bar */}
        <div className="flex gap-8 mt-14 pt-8 border-t border-surface-200 flex-wrap justify-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-ink-900">{value}</div>
              <div className="text-xs text-ink-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Feature grid */}
      <section className="px-8 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon, title, desc, color }) => (
            <div key={title} className="bg-surface-0 rounded-xl p-5 border border-surface-200 shadow-card">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-3 ${color}`}>
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-ink-900 mb-1.5">{title}</h3>
              <p className="text-xs text-ink-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 pb-20 bg-surface-100 border-t border-surface-200">
        <div className="max-w-3xl mx-auto pt-14">
          <h2 className="text-2xl font-bold text-ink-900 text-center mb-10">How it works</h2>
          <div className="space-y-4">
            {[
              ['1', 'Create your course', 'Enter course name, professor, and semester — takes 30 seconds.'],
              ['2', 'Upload all materials', 'Drag in your syllabus, lecture transcripts, past quizzes, slides, and notes.'],
              ['3', 'Run the analysis', 'The AI pipeline parses content, detects professor patterns, and scores concepts by testability.'],
              ['4', 'Study your cards', 'Get 3×5 cards with mechanisms, clinical tie-ins, and predicted exam questions — organized by your professor\'s priorities.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="flex items-start gap-4 p-4 bg-surface-0 rounded-xl border border-surface-200">
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {num}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{title}</div>
                  <div className="text-sm text-ink-500 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
