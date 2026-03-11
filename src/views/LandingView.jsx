import { useAppContext, useNav } from '../hooks/useAppContext';
import { ACTIONS } from '../context/actions';
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
    navigate('card_generation');
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
          ◎ Professor-Aware · Quiz-Aligned · High-Yield
        </div>

        <h1 className="text-5xl font-bold text-ink-900 tracking-tight max-w-3xl leading-tight mb-5">
          Study smarter with cards built from{' '}
          <span className="text-primary-500">your professor's patterns</span>
        </h1>

        <p className="text-xl text-ink-500 max-w-2xl leading-relaxed mb-10">
          Upload your neuroscience class materials — syllabus, transcripts, quizzes, slides, notes.
          NeuroCard AI analyzes how your professor teaches and tests, then generates targeted 3×5 study cards
          and predicted exam questions.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-4">
          <button
            onClick={() => navigate('course_setup')}
            className="px-8 py-3.5 bg-primary-500 text-white rounded-xl font-semibold text-base hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
          >
            Start New Course →
          </button>
          <button
            onClick={loadDemo}
            className="px-8 py-3.5 bg-surface-0 text-ink-700 rounded-xl font-semibold text-base hover:bg-surface-100 transition-colors border border-surface-200"
          >
            Load Demo Course
          </button>
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
