function getLikelihoodColor(score) {
  if (score >= 85) return { bar: '#3cbf8f', bg: 'bg-success-50', text: 'text-emerald-700', label: 'Very High' };
  if (score >= 70) return { bar: '#f2b84b', bg: 'bg-warn-50', text: 'text-amber-700', label: 'High' };
  if (score >= 55) return { bar: '#b6782e', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Medium' };
  return { bar: '#e76666', bg: 'bg-danger-50', text: 'text-danger-400', label: 'Lower' };
}

export default function ConceptHeatmap({ concepts }) {
  if (!concepts || concepts.length === 0) return null;

  return (
    <div className="surface-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-sm">\u25ce</div>
        <h3 className="text-sm font-semibold text-ink-900">High-Yield Concepts</h3>
      </div>

      <p className="text-xs text-ink-500">Ranked by cross-source frequency \u00d7 source weighting \u00d7 quiz signal.</p>

      <div className="space-y-2.5">
        {concepts.map((concept, i) => {
          const colorSet = getLikelihoodColor(concept.quizLikelihood);
          return (
            <div key={concept.id || i} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-ink-400 w-5 shrink-0">#{i + 1}</span>
                  <span className="text-xs font-medium text-ink-800 truncate">{concept.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-xs text-ink-400">
                    {concept.crossSourceFrequency} source{concept.crossSourceFrequency !== 1 ? 's' : ''}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${colorSet.bg} ${colorSet.text}`}>
                    {concept.quizLikelihood}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex-1 bg-surface-200 rounded-full overflow-hidden" style={{ height: 4 }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${concept.weightedScore || concept.quizLikelihood}%`, backgroundColor: colorSet.bar }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 pt-1 flex-wrap">
        {[
          { label: 'Very High', color: '#3cbf8f' },
          { label: 'High', color: '#f2b84b' },
          { label: 'Medium', color: '#b6782e' },
          { label: 'Lower', color: '#e76666' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-ink-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
