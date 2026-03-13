import { useAppContext, useNav } from '../../hooks/useAppContext';
import Button from '../ui/Button';

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
  card_generation: 'Professor-aligned 3x5 study cards',
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
    <header className="bg-surface-0/70 border-b border-surface-200/70 px-8 py-5 flex items-center justify-between no-print shrink-0 backdrop-blur-md">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">{title}</h1>
        {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
        {currentView === 'dashboard' && course?.name && (
          <div className="text-xs text-ink-400 mt-2">{course.name} \u00b7 {course.professor}</div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {currentView === 'card_generation' && cards.length > 0 && (
          <>
            {pinnedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-warn-50 text-warn-400 rounded-full text-xs font-semibold border border-warn-100">
                \u2605 {pinnedCount} pinned
              </span>
            )}
            <Button onClick={() => navigate('study_modes')} size="sm">
              Study Now \u2192
            </Button>
          </>
        )}
        {currentView === 'dashboard' && course && (
          <Button onClick={() => navigate('import')} size="sm">
            + Add Materials
          </Button>
        )}
        {currentView === 'analysis' && (
          <Button variant="secondary" onClick={() => navigate('card_generation')} size="sm">
            View Cards \u2192
          </Button>
        )}
      </div>
    </header>
  );
}
