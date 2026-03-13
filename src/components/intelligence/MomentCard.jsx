import ImportanceBadge from './ImportanceBadge';

const REASON_LABELS = {
  keyword:      'Keyword',
  repetition:   'Repeated',
  emphasis:     'Emphasis',
  confusion:    'Confusion moment',
  disagreement: 'Disagreement',
  commitment:   'Commitment',
  blocker:      'Blocker',
  urgency:      'Urgent',
};

/**
 * MomentCard - renders a single important moment from a session analysis.
 *
 * Used in both School Mode (lecture moments) and Work Mode (meeting moments).
 *
 * @param {object} moment  - { text, score, tier, reason }
 * @param {boolean} school - true for school-flavoured styling
 */
export default function MomentCard({ moment, school = false }) {
  const { text, score = 0, reason } = moment;
  const reasonLabel = REASON_LABELS[reason] ?? reason ?? '';

  return (
    <div className="flex gap-3 p-3 rounded-xl border bg-surface-0/85 hover:shadow-card transition-shadow">
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
        <ImportanceBadge score={score} compact />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink-800 leading-snug">{text}</p>
        {reasonLabel && (
          <span className={`mt-1 inline-block text-xs px-1.5 py-0.5 rounded font-medium
            ${school
              ? 'bg-primary-50 text-primary-700'
              : 'bg-warn-50 text-amber-700'
            }`}>
            {reasonLabel}
          </span>
        )}
      </div>
    </div>
  );
}
