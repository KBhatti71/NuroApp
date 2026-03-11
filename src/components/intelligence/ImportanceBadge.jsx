import { getImportanceTier } from '../../constants/modes';

/**
 * ImportanceBadge — displays ⭐/⭐⭐/⭐⭐⭐ importance indicator.
 *
 * @param {number}  score   - 0-100 importance score
 * @param {boolean} compact - if true, shows only stars (no label)
 */
export default function ImportanceBadge({ score = 0, compact = false }) {
  const tier = getImportanceTier(score);
  const stars = '★'.repeat(tier.stars) + '☆'.repeat(3 - tier.stars);

  if (compact) {
    return (
      <span className={`text-sm font-bold ${tier.color}`} title={`${tier.label} importance (${score})`}>
        {stars}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border
        ${tier.bg} ${tier.color} ${tier.border}`}
      title={`Importance score: ${score}/100`}
    >
      <span className="tracking-tight">{stars}</span>
      <span>{tier.label}</span>
      <span className="opacity-60">({score})</span>
    </span>
  );
}
