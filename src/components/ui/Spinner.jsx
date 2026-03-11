export default function Spinner({ size = 'md', color = 'primary' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-3' };
  const colors = { primary: 'border-primary-500', white: 'border-white', ink: 'border-ink-500' };

  return (
    <div
      className={`rounded-full border-t-transparent animate-spin ${sizes[size]} ${colors[color]}`}
      style={{ borderTopColor: 'transparent' }}
    />
  );
}
