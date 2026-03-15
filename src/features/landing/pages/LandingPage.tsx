import { useNavigate } from 'react-router-dom';
// @ts-ignore - Gradual migration to TypeScript
import Button from '@/components/ui/Button';
// @ts-ignore - Gradual migration to TypeScript
import { MOCK_CARDS } from '@/data/mockCards';
// @ts-ignore - Gradual migration to TypeScript
import { demoCourse, demoCourseMap, workCourse, workCourseMap } from '@/data/courses';
// @ts-ignore - Gradual migration to TypeScript
import { mockProfessorStyle, mockQuizPattern, mockHighYieldConcepts } from '@/data/mockAnalysis';

const FEATURES = [
  {
    icon: '\u2191',
    title: 'Ingest Everything',
    desc: 'Upload syllabi, transcripts, quizzes, slides, notes, textbooks, and web content. All formats welcome.',
  },
  {
    icon: '\u25ce',
    title: 'Professor-Aware Analysis',
    desc: "Detects your professor's teaching style, quiz patterns, and what they emphasize lecture by lecture.",
  },
  {
    icon: '\u25a6',
    title: 'High-Yield 3x5 Cards',
    desc: 'Generates concise, testable study cards with mechanisms, clinical tie-ins, and predicted exam questions.',
  },
  {
    icon: '\u25c7',
    title: '7 Study Modes',
    desc: 'Exam Cram, Flashcard, Quiz Predictor, Clinical Focus, Professor Wording, Conceptual, and Syllabus-Aligned.',
  },
];

const STATS = [
  { value: '8', label: 'Source Formats' },
  { value: '7', label: 'Study Modes' },
  { value: '8', label: 'Card Fields' },
  { value: '100%', label: 'Neuro-Focused' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const loadDemo = () => {
    // For now, just navigate to course setup - we'll handle demo loading later
    navigate('/course-setup');
  };

  const loadWork = () => {
    // For now, just navigate to course setup - we'll handle demo loading later
    navigate('/course-setup');
  };

  const enterSchoolMode = () => {
    navigate('/school-mode');
  };

  const enterWorkMode = () => {
    navigate('/work-mode');
  };

  return (
    <div className="min-h-screen">
      <header className="px-8 py-6 flex items-center justify-between border-b border-surface-200/70 bg-surface-0/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-base">N</span>
          </div>
          <div>
            <div className="text-base font-semibold text-ink-900">NeuroCard AI</div>
            <div className="text-xs text-ink-500">Neuroscience Study Intelligence</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={loadDemo}
            className="text-sm text-ink-500 hover:text-ink-900 transition-colors underline underline-offset-4"
          >
            Load Neuroscience Demo →
          </button>
          <button
            onClick={loadWork}
            className="text-sm text-ink-500 hover:text-ink-900 transition-colors underline underline-offset-4"
          >
            Load Work Demo →
          </button>
        </div>
      </header>

      <main className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100/80 text-primary-700 rounded-full text-xs font-semibold mb-6 border border-primary-200/70">
              ◎ Professor-Aware · Quiz-Aligned · Meeting Intelligence
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-ink-900 tracking-tight leading-tight mb-5">
              AI intelligence for school and work
            </h1>

            <p className="text-lg text-ink-500 max-w-2xl leading-relaxed mb-8">
              Generate high-yield study cards from your class materials, extract importance-scored insights
              from lecture transcripts, and turn meeting chaos into decisions and action items all in one app.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/course-setup')} size="lg">
                Start Course →
              </Button>
              <Button variant="secondary" onClick={enterSchoolMode} size="lg">
                Open School Mode
              </Button>
              <Button variant="outline" onClick={enterWorkMode} size="lg">
                Open Work Mode
              </Button>
            </div>

            <div className="flex gap-6 mt-10 flex-wrap">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-left">
                  <div className="text-2xl font-bold text-ink-900">{value}</div>
                  <div className="text-xs text-ink-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="surface-card p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-ink-400">NeuroCards Mode</div>
              <div className="text-xl font-semibold text-ink-900 mt-2">Professor-aware 3x5 study cards</div>
              <p className="text-sm text-ink-500 mt-2">
                Align to quiz patterns and lecture emphasis with auto-tagging, pinning, and predicted exam prompts.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
                <span className="px-2 py-1 bg-surface-100 rounded-full">Syllabus</span>
                <span className="px-2 py-1 bg-surface-100 rounded-full">Transcripts</span>
                <span className="px-2 py-1 bg-surface-100 rounded-full">Slides</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'School Mode', desc: 'Lecture intelligence in minutes', icon: '📚' },
                { title: 'Work Mode', desc: 'Meeting summaries + action items', icon: '💼' },
              ].map(item => (
                <div key={item.title} className="surface-panel p-4">
                  <div className="text-lg">{item.icon}</div>
                  <div className="text-sm font-semibold text-ink-900 mt-2">{item.title}</div>
                  <div className="text-xs text-ink-500 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <section className="px-8 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="surface-card p-5">
              <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-base mb-3 text-ink-700">
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-ink-900 mb-1.5">{title}</h3>
              <p className="text-xs text-ink-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 pb-20">
        <div className="max-w-4xl mx-auto pt-10">
          <h2 className="text-2xl font-bold text-ink-900 text-center mb-10">How it works</h2>
          <div className="space-y-4">
            {[
              ['1', 'Create your course', 'Enter course name, professor, and semester in under a minute.'],
              ['2', 'Upload all materials', 'Drag in your syllabus, lecture transcripts, past quizzes, slides, and notes.'],
              ['3', 'Run the analysis', 'The AI pipeline parses content, detects professor patterns, and scores concepts by testability.'],
              ['4', 'Study your cards', 'Get 3x5 cards with mechanisms, clinical tie-ins, and predicted exam questions organized by your professor\'s priorities.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="surface-card p-5 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {num}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{title}</div>
                  <div className="text-sm text-ink-500 mt-1">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}