export default function Tag({ label, onRemove, color = '#1e9d91' }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: color + '18', color }}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity leading-none ml-0.5"
        >
          \u00d7
        </button>
      )}
    </span>
  );
}
