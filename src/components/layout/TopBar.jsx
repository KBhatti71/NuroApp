import { useAppContext, useNav } from '../../hooks/useAppContext';

const VIEW_TITLES = {
  landing: 'Welcome',
  course_setup: 'Create New Course',
  dashboard: 'Course Dashboard',
  import: 'Import Materials',
  analysis: 'Intelligence Analysis',
  card_generation: 'Study Cards',
  study_modes: 'Study Modes',
  export: 'Export & Tools',
};

const VIEW_SUBTITLES = {
  dashboard: 'Your course intelligence overview',
  import: 'Upload and organize your class materials',
  analysis: 'Professor style, quiz patterns, and high-yield signals',
  card_generation: 'Professor-aligned 3×5 study cards',
  study_modes: 'Choose how you want to study',
  export: 'Export cards, quizzes, and review sheets',
};

export default function TopBar() {
  const { state } = useAppContext();
  const navigate = useNav();
  const { currentView, course, cards } = state;

  const title = VIEW_TITLES[currentView] || '';
  const subtitle = VIEW_SUBTITLES[currentView] || '';

  const pinnedCount = cards.filter(c => c.pinned).length;

  return (
    <header className="bg-surface-0 border-b border-surface-200 px-6 py-4 flex items-center justify-between no-print shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">{title}</h1>
        {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {currentView === 'card_generation' && cards.length > 0 && (
          <>
            {pinnedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-warn-50 text-warn-400 rounded-full text-xs font-semibold border border-warn-100">
                ★ {pinnedCount} pinned
              </span>
            )}
            <button
              onClick={() => navigate('study_modes')}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Study Now →
            </button>
          </>
        )}
        {currentView === 'dashboard' && course && (
          <button
            onClick={() => navigate('import')}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            + Add Materials
          </button>
        )}
        {currentView === 'analysis' && (
          <button
            onClick={() => navigate('card_generation')}
            className="px-4 py-2 bg-surface-100 text-ink-700 rounded-lg text-sm font-medium hover:bg-surface-200 transition-colors border border-surface-200"
          >
            View Cards →
          </button>
        )}
      </div>
    </header>
  );
}
