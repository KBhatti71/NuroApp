import { useAppContext } from '../../hooks/useAppContext';
import { ACTIONS } from '../../context/actions';

function LikelihoodBar({ score }) {
  let color = '#e76666';
  if (score >= 85) color = '#3cbf8f';
  else if (score >= 70) color = '#f2b84b';
  else if (score >= 55) color = '#b6782e';

  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-200 rounded-b-2xl overflow-hidden">
      <div
        className="h-full rounded-b-2xl transition-all"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}

const UNIT_COLORS = {
  unit_01: '#1e9d91',
  unit_02: '#2e6f9b',
  unit_03: '#3a8f7a',
  unit_04: '#b6782e',
  unit_05: '#2f7f68',
};

export default function StudyCard({ card, onClick, compact = false }) {
  const { dispatch } = useAppContext();

  const handlePin = (e) => {
    e.stopPropagation();
    dispatch({ type: ACTIONS.TOGGLE_PIN, payload: card.id });
  };

  const unitColor = UNIT_COLORS[card.unitId] || '#1e9d91';

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      role="article"
      tabIndex={0}
      aria-label={`Study card: ${card.topic}`}
      className="relative bg-surface-0/85 rounded-2xl border border-surface-200/70 shadow-card hover:shadow-card-hover transition-all cursor-pointer group overflow-hidden pb-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <div className="h-1 rounded-t-2xl" style={{ backgroundColor: unitColor }} />

      <div className="p-4">
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
                  backgroundColor: card.quizLikelihood >= 85 ? '#e9fbf4' : card.quizLikelihood >= 70 ? '#fff7e6' : '#fff1f1',
                  color: card.quizLikelihood >= 85 ? '#1f7a64' : card.quizLikelihood >= 70 ? '#9a5e14' : '#c84646',
                }}
              >
                <span aria-hidden="true">\u2605</span> {card.quizLikelihood}%
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
            <span aria-hidden="true">\u2605</span>
          </button>
        </div>

        <p className="text-xs text-ink-600 leading-relaxed mb-3 line-clamp-2">
          {card.coreIdea}
        </p>

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

        {!compact && card.clinicalTieIn && (
          <div className="mb-3 p-2 bg-warn-50 rounded-lg border border-warn-100">
            <div className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-0.5">Clinical</div>
            <p className="text-xs text-amber-900 leading-relaxed line-clamp-2">{card.clinicalTieIn}</p>
          </div>
        )}

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
