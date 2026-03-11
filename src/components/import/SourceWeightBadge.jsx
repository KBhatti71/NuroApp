import { SOURCE_WEIGHTS, SOURCE_TYPE_LABELS, SOURCE_TYPE_COLORS } from '../../services/pipeline/contentParser';

export default function SourceWeightBadge({ type }) {
  const weight = SOURCE_WEIGHTS[type] || 0.5;
  const pct = Math.round(weight * 100);
  const color = SOURCE_TYPE_COLORS[type] || '#64748b';
  const label = SOURCE_TYPE_LABELS[type] || type;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: color + '18', color }}
      title={`Signal weight: ${pct}%`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {label}
      <span className="opacity-70">({pct}%)</span>
    </span>
  );
}
