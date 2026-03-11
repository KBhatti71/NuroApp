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
    recall: 'bg-success-100 text-green-700',
    application: 'bg-warn-100 text-yellow-700',
    analysis: 'bg-danger-100 text-red-700',
  };

  return (
    <div className="bg-surface-0 border border-surface-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">▣</div>
        <h3 className="text-sm font-semibold text-ink-900">Quiz Patterns</h3>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
          {formatLabels[pattern.dominantFormat] || pattern.dominantFormat}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${depthColors[pattern.conceptDepth] || 'bg-surface-100 text-ink-700'}`}>
          {depthLabels[pattern.conceptDepth] || pattern.conceptDepth} Depth
        </span>
        {pattern.clinicalBias && (
          <span className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold">
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
                  className="text-xs font-bold text-indigo-500 w-4 shrink-0"
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
              <div key={i} className="p-2 bg-surface-50 rounded-lg border border-surface-200">
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
              <div key={i} className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-xs text-indigo-800 leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
