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
    <div className="flex flex-wrap items-center gap-3 p-4 surface-card">
      <div className="flex-1 min-w-40">
        <label htmlFor="card-search" className="sr-only">Search cards by topic or term</label>
        <input
          id="card-search"
          type="text"
          placeholder="Search topics, terms..."
          value={filters.searchQuery}
          onChange={(e) => setFilter({ searchQuery: e.target.value })}
          className="w-full px-3 py-2 bg-surface-50 border border-surface-200/70 rounded-lg text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface-0"
        />
      </div>

      {units.length > 0 && (
        <select
          aria-label="Filter by unit"
          value={filters.unitId || ''}
          onChange={(e) => setFilter({ unitId: e.target.value || null })}
          className="px-3 py-2 bg-surface-50 border border-surface-200/70 rounded-lg text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Units</option>
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.title.split(':')[0]}</option>
          ))}
        </select>
      )}

      <div className="flex items-center gap-2 min-w-36">
        <label htmlFor="likelihood-slider" className="text-xs text-ink-500 shrink-0">
          <span aria-hidden="true">Min \u2605</span>
          <span className="sr-only">Minimum quiz likelihood</span>
        </label>
        <input
          id="likelihood-slider"
          type="range"
          min={0}
          max={90}
          step={5}
          value={filters.minQuizLikelihood}
          onChange={(e) => setFilter({ minQuizLikelihood: Number(e.target.value) })}
          aria-valuetext={filters.minQuizLikelihood > 0 ? `${filters.minQuizLikelihood}%` : 'Any'}
          className="w-24 accent-primary-500"
        />
        <span className="text-xs font-medium text-ink-700 w-8 shrink-0" aria-live="polite">
          {filters.minQuizLikelihood > 0 ? `${filters.minQuizLikelihood}%` : 'Any'}
        </span>
      </div>

      <button
        onClick={() => setFilter({ pinnedOnly: !filters.pinnedOnly })}
        aria-pressed={filters.pinnedOnly}
        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          filters.pinnedOnly
            ? 'bg-warn-50 text-amber-700 border border-warn-100'
            : 'bg-surface-50 text-ink-600 border border-surface-200/70 hover:bg-surface-100'
        }`}
      >
        <span aria-hidden="true">\u2605</span> Pinned only
      </button>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="px-3 py-2 text-xs text-ink-500 hover:text-ink-900 transition-colors underline underline-offset-2"
        >
          Reset filters
        </button>
      )}

      <div className="text-xs text-ink-400 ml-auto shrink-0">
        {allCards.length} card{allCards.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
