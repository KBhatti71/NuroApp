import { useStudyMode } from '../../hooks/useStudyMode';
import { useAppContext } from '../../hooks/useAppContext';

export default function CardFilters() {
  const { filters, setFilter, resetFilters, allCards } = useStudyMode();
  const { state } = useAppContext();
  const { courseMap } = state;

  const units = courseMap?.units || [];
  const hasActiveFilters = filters.unitId || filters.pinnedOnly || filters.searchQuery ||
    filters.minQuizLikelihood > 0 || filters.tags?.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-surface-0 border border-surface-200 rounded-xl">
      {/* Search */}
      <div className="flex-1 min-w-40">
        <input
          type="text"
          placeholder="Search topics, terms..."
          value={filters.searchQuery}
          onChange={(e) => setFilter({ searchQuery: e.target.value })}
          className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface-0"
        />
      </div>

      {/* Unit filter */}
      {units.length > 0 && (
        <select
          value={filters.unitId || ''}
          onChange={(e) => setFilter({ unitId: e.target.value || null })}
          className="px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Units</option>
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.title.split(':')[0]}</option>
          ))}
        </select>
      )}

      {/* Quiz likelihood slider */}
      <div className="flex items-center gap-2 min-w-36">
        <span className="text-xs text-ink-500 shrink-0">Min ★</span>
        <input
          type="range"
          min={0}
          max={90}
          step={5}
          value={filters.minQuizLikelihood}
          onChange={(e) => setFilter({ minQuizLikelihood: Number(e.target.value) })}
          className="w-24 accent-primary-500"
        />
        <span className="text-xs font-medium text-ink-700 w-8 shrink-0">
          {filters.minQuizLikelihood > 0 ? `${filters.minQuizLikelihood}%` : 'Any'}
        </span>
      </div>

      {/* Pinned toggle */}
      <button
        onClick={() => setFilter({ pinnedOnly: !filters.pinnedOnly })}
        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          filters.pinnedOnly
            ? 'bg-warn-100 text-yellow-700 border border-warn-100'
            : 'bg-surface-50 text-ink-600 border border-surface-200 hover:bg-surface-100'
        }`}
      >
        ★ Pinned only
      </button>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="px-3 py-2 text-xs text-ink-500 hover:text-ink-900 transition-colors underline underline-offset-2"
        >
          Reset filters
        </button>
      )}

      {/* Count */}
      <div className="text-xs text-ink-400 ml-auto shrink-0">
        {allCards.length} card{allCards.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
