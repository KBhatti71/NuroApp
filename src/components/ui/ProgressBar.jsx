export default function ProgressBar({ value = 0, max = 100, color = 'primary', className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-success-400',
    warn: 'bg-warn-400',
    danger: 'bg-danger-400',
  };

  return (
    <div className={`w-full bg-surface-200 rounded-full overflow-hidden ${className}`} style={{ height: 6 }}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colors[color] || colors.primary}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
