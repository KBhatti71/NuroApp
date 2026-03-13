import { useAppContext } from '../../hooks/useAppContext';
import { ACTIONS } from '../../context/actions';

function LikelihoodBar({ score }) {
  let color = '#f87171';
  if (score >= 85) color = '#34d399';
  else if (score >= 70) color = '#fbbf24';
  else if (score >= 55) color = '#f59e0b';

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-200 rounded-b-xl overflow-hidden">
      <div
        className="h-full rounded-b-xl transition-all"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}

const UNIT_COLORS = {
  unit_01: '#6366f1',
  unit_02: '#0ea5e9',
  unit_03: '#10b981',
  unit_04: '#f59e0b',
  unit_05: '#8b5cf6',
};

export default function StudyCard({ card, onClick, compact = false }) {
  const { dispatch } = useAppContext();

  const handlePin = (e) => {
    e.stopPropagation();
    dispatch({ type: ACTIONS.TOGGLE_PIN, payload: card.id });
  };

  const unitColor = UNIT_COLORS[card.unitId] || '#14b8a6';

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      role="article"
      tabIndex={0}
      aria-label={`Study card: ${card.topic}`}
      className="relative bg-surface-0 rounded-xl border border-surface-200 shadow-card hover:shadow-card-hover transition-all cursor-pointer group overflow-hidden pb-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      {/* Top accent bar with unit color */}
      <div className="h-1 rounded-t-xl" style={{ backgroundColor: unitColor }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: unitColor + '18', color: unitColor }}
              >
                {card.unit?.split(':')[0] || 'Unit'}
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                aria-label={`Quiz likelihood: ${card.quizLikelihood}%`}
                style={{
                  backgroundColor: card.quizLikelihood >= 85 ? '#dcfce7' : card.quizLikelihood >= 70 ? '#fef3c7' : '#fee2e2',
                  color: card.quizLikelihood >= 85 ? '#15803d' : card.quizLikelihood >= 70 ? '#92400e' : '#dc2626',
                }}
              >
                <span aria-hidden="true">★</span> {card.quizLikelihood}%
              </span>
            </div>
            <h3 className="text-sm font-bold text-ink-900 leading-tight">{card.topic}</h3>
          </div>
          <button
            onClick={handlePin}
            aria-label={card.pinned ? 'Unpin card' : 'Pin card'}
            aria-pressed={card.pinned}
            className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all text-sm ${
              card.pinned
                ? 'text-warn-400 bg-warn-50'
                : 'text-ink-300 opacity-0 group-hover:opacity-100 hover:text-warn-400 hover:bg-warn-50'
            }`}
          >
            <span aria-hidden="true">★</span>
          </button>
        </div>

        {/* Core idea */}
        <p className="text-xs text-ink-600 leading-relaxed mb-3 line-clamp-2">
          {card.coreIdea}
        </p>

        {/* Key terms preview */}
        {!compact && card.keyTerms?.length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-1.5">Key Terms</div>
            <div className="flex flex-wrap gap-1">
              {card.keyTerms.slice(0, 3).map((kt) => (
                <span
                  key={kt.term}
                  className="px-2 py-0.5 bg-surface-100 text-ink-600 rounded text-xs font-medium"
                  title={kt.definition}
                >
                  {kt.term}
                </span>
              ))}
              {card.keyTerms.length > 3 && (
                <span className="px-2 py-0.5 text-ink-400 text-xs">+{card.keyTerms.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Clinical tie-in snippet */}
        {!compact && card.clinicalTieIn && (
          <div className="mb-3 p-2 bg-violet-50 rounded-lg border border-violet-100">
            <div className="text-xs font-medium text-violet-600 uppercase tracking-wider mb-0.5">Clinical</div>
            <p className="text-xs text-violet-800 leading-relaxed line-clamp-2">{card.clinicalTieIn}</p>
          </div>
        )}

        {/* Footer: tags */}
        {card.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {card.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-surface-100 text-ink-500 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <LikelihoodBar score={card.quizLikelihood} />
    </div>
  );
}
