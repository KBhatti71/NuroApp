export default function QuizPatternPanel({ pattern }) {
  if (!pattern) return null;

  const formatLabels = {
    case_vignette: 'Clinical Vignette',
    mcq: 'Multiple Choice',
    short_answer: 'Short Answer',
    matching: 'Matching',
    mixed: 'Mixed Formats',
  };

  const depthLabels = {
    recall: 'Recall',
    application: 'Application',
    analysis: 'Analysis',
  };

  const depthColors = {
    recall: 'bg-success-50 text-emerald-700',
    application: 'bg-warn-50 text-amber-700',
    analysis: 'bg-danger-50 text-danger-400',
  };

  return (
    <div className="surface-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-sm">\u25a6</div>
        <h3 className="text-sm font-semibold text-ink-900">Quiz Patterns</h3>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
          {formatLabels[pattern.dominantFormat] || pattern.dominantFormat}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${depthColors[pattern.conceptDepth] || 'bg-surface-100 text-ink-700'}`}>
          {depthLabels[pattern.conceptDepth] || pattern.conceptDepth} Depth
        </span>
        {pattern.clinicalBias && (
          <span className="px-2.5 py-1 bg-warn-50 text-amber-700 rounded-full text-xs font-semibold">
            Clinical Bias
          </span>
        )}
      </div>

      {pattern.repeatedlyTestedTopics?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">Repeatedly Tested Topics</p>
          <div className="space-y-1.5">
            {pattern.repeatedlyTestedTopics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span
                  className="text-xs font-bold text-primary-500 w-4 shrink-0"
                  style={{ opacity: 1 - i * 0.1 }}
                >
                  #{i + 1}
                </span>
                <span className="text-xs text-ink-700">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pattern.questionVerbPatterns?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">Question Patterns</p>
          <div className="space-y-1.5">
            {pattern.questionVerbPatterns.slice(0, 4).map((q, i) => (
              <div key={i} className="p-2 bg-surface-50 rounded-lg border border-surface-200/70">
                <span className="text-xs text-ink-600 font-mono leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pattern.previousQuestions?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">Sample Past Questions</p>
          <div className="space-y-2">
            {pattern.previousQuestions.slice(0, 2).map((q, i) => (
              <div key={i} className="p-3 bg-primary-50/70 rounded-lg border border-primary-100">
                <p className="text-xs text-primary-900 leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
