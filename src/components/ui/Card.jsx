export default function Card({ children, className = '', onClick, hoverable = false }) {
  return (
    <div
      onClick={onClick}
      className={`surface-card ${
        hoverable ? 'hover:shadow-card-hover cursor-pointer transition-shadow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
