export default function Card({ children, className = '', onClick, hoverable = false }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-0 rounded-xl border border-surface-200 shadow-card ${
        hoverable ? 'hover:shadow-card-hover cursor-pointer transition-shadow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
