import ProgressBar from '../ui/ProgressBar';
import Spinner from '../ui/Spinner';

const STEPS = [
  { key: 'parsing', label: 'Parse content', icon: '↑' },
  { key: 'analyzing_course', label: 'Build course map', icon: '⬡' },
  { key: 'analyzing_professor', label: 'Analyze professor style', icon: '◈' },
  { key: 'analyzing_quizzes', label: 'Detect quiz patterns', icon: '▣' },
  { key: 'detecting_signals', label: 'Identify high-yield concepts', icon: '◎' },
  { key: 'generating_cards', label: 'Generate study cards', icon: '★' },
];

const STEP_PROGRESS = {
  parsing: 10,
  analyzing_course: 25,
  analyzing_professor: 42,
  analyzing_quizzes: 58,
  detecting_signals: 72,
  generating_cards: 88,
  complete: 100,
};

function getStepStatus(stepKey, currentStatus, progress) {
  const stepPct = STEP_PROGRESS[stepKey] || 0;
  if (currentStatus === 'complete' || progress >= stepPct + 15) return 'done';
  if (currentStatus === stepKey || (progress >= stepPct && progress < stepPct + 15)) return 'active';
  if (progress > stepPct) return 'done';
  return 'pending';
}

export default function PipelineProgress({ pipeline }) {
  const { status, progress, log } = pipeline;
  const isComplete = status === 'complete';
  const isError = status === 'error';

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        {isComplete ? (
          <>
            <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center text-2xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-xl font-bold text-ink-900">Analysis Complete</h2>
            <p className="text-ink-500 text-sm mt-1">Cards have been generated. Navigating to your study deck…</p>
          </>
        ) : isError ? (
          <>
            <div className="w-14 h-14 rounded-full bg-danger-100 flex items-center justify-center text-2xl mx-auto mb-4">
              ⚠
            </div>
            <h2 className="text-xl font-bold text-ink-900">Analysis Error</h2>
            <p className="text-ink-500 text-sm mt-1">{pipeline.error}</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <Spinner size="lg" />
            </div>
            <h2 className="text-xl font-bold text-ink-900">Analyzing Your Course Materials</h2>
            <p className="text-ink-500 text-sm mt-1">Detecting professor patterns and generating professor-aligned study cards…</p>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
          <span>{pipeline.currentStep || 'Starting...'}</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar
          value={progress}
          color={isComplete ? 'success' : isError ? 'danger' : 'primary'}
        />
      </div>

      {/* Step list */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        {STEPS.map((step, idx) => {
          const stepStatus = getStepStatus(step.key, status, progress);
          return (
            <div
              key={step.key}
              className={`flex items-center gap-4 px-5 py-3.5 ${
                idx < STEPS.length - 1 ? 'border-b border-surface-200' : ''
              } transition-colors ${stepStatus === 'active' ? 'bg-primary-50' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 transition-all ${
                  stepStatus === 'done'
                    ? 'bg-success-400 text-white'
                    : stepStatus === 'active'
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-200 text-ink-400'
                }`}
              >
                {stepStatus === 'done' ? '✓' : stepStatus === 'active' ? <Spinner size="sm" color="white" /> : step.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  stepStatus === 'done'
                    ? 'text-ink-700'
                    : stepStatus === 'active'
                    ? 'text-primary-700'
                    : 'text-ink-400'
                }`}
              >
                {step.label}
              </span>
              {stepStatus === 'done' && (
                <span className="ml-auto text-xs text-success-400 font-medium">✓</span>
              )}
              {stepStatus === 'active' && (
                <span className="ml-auto text-xs text-primary-500 font-medium animate-pulse-soft">Running…</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Live log */}
      {log.length > 0 && (
        <div className="bg-ink-900 rounded-xl p-4 space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
          {log.map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-primary-500 text-xs font-mono shrink-0 mt-0.5">→</span>
              <span className="text-xs text-ink-300 font-mono leading-relaxed">{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
