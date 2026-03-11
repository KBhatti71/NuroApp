export default function Badge({ children, color = 'default', className = '' }) {
  const colors = {
    default: 'bg-surface-100 text-ink-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-green-700',
    warn: 'bg-warn-100 text-yellow-700',
    danger: 'bg-danger-100 text-red-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    violet: 'bg-violet-100 text-violet-700',
    sky: 'bg-sky-100 text-sky-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    gray: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.default} ${className}`}>
      {children}
    </span>
  );
}
