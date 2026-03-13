export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50';

  const variants = {
    primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-card disabled:opacity-50',
    secondary: 'bg-surface-0/80 text-ink-700 border border-surface-200 hover:bg-surface-100 disabled:opacity-50',
    ghost: 'text-ink-700 hover:bg-surface-100/80 disabled:opacity-40',
    danger: 'bg-danger-400 text-white hover:bg-danger-500 disabled:opacity-50',
    outline: 'border border-primary-600 text-primary-700 hover:bg-primary-50 disabled:opacity-50',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
