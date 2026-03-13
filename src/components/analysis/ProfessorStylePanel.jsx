export default function ProfessorStylePanel({ style }) {
  if (!style) return null;

  const styleLabels = {
    case_based: 'Case-Based',
    mechanism_first: 'Mechanism-First',
    mixed: 'Mixed',
    systems_overview: 'Systems Overview',
  };

  const emphasisLabels = {
    clinical: 'Clinical',
    molecular: 'Molecular',
    systems: 'Systems',
    balanced: 'Balanced',
  };

  const emphasisColors = {
    clinical: 'bg-warn-50 text-amber-700',
    molecular: 'bg-primary-50 text-primary-700',
    systems: 'bg-success-50 text-emerald-700',
    balanced: 'bg-surface-100 text-ink-700',
  };

  return (
    <div className="surface-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-sm">\u25c7</div>
        <h3 className="text-sm font-semibold text-ink-900">Professor Style</h3>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="px-2.5 py-1 bg-surface-100 text-ink-700 rounded-full text-xs font-semibold">
          {styleLabels[style.lectureStyle] || style.lectureStyle}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${emphasisColors[style.emphasisLevel] || 'bg-surface-100 text-ink-700'}`}>
          {emphasisLabels[style.emphasisLevel] || style.emphasisLevel} Focus
        </span>
      </div>

      {style.detectedStyle && (
        <p className="text-xs text-ink-600 leading-relaxed border-l-2 border-primary-200 pl-3">
          {style.detectedStyle}
        </p>
      )}

      {style.phrasePatterns?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">Emphasis Phrases Detected</p>
          <div className="space-y-1">
            {style.phrasePatterns.slice(0, 5).map((phrase, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-primary-400 text-xs shrink-0 mt-0.5">\u2192</span>
                <span className="text-xs text-ink-700 font-mono">{phrase}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {style.signatureTerms?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">Signature Terms</p>
          <div className="flex flex-wrap gap-1.5">
            {style.signatureTerms.map((term, i) => (
              <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-100">
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {style.favoriteTopics?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">High-Frequency Topics</p>
          <div className="space-y-1">
            {style.favoriteTopics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="h-1.5 rounded-full bg-primary-600"
                  style={{ width: `${Math.max(20, 100 - i * 15)}%` }}
                />
                <span className="text-xs text-ink-600 whitespace-nowrap">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
