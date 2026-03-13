import { useAppContext, useNav } from '../../hooks/useAppContext';
import { ACTIONS } from '../../context/actions';
import { APP_MODE } from '../../constants/modes';
import { VIEWS } from '../../constants/views';
import ModeSwitcher from '../mode/ModeSwitcher';

const NEURO_NAV = [
  { view: VIEWS.DASHBOARD,       icon: '\u25a3', label: 'Dashboard' },
  { view: VIEWS.IMPORT,          icon: '\u2191', label: 'Import Materials' },
  { view: VIEWS.ANALYSIS,        icon: '\u25ce', label: 'Analysis' },
  { view: VIEWS.CARD_GENERATION, icon: '\u25a6', label: 'Study Cards' },
  { view: VIEWS.STUDY_MODES,     icon: '\u25c7', label: 'Study Modes' },
  { view: VIEWS.EXPORT,          icon: '\u2197', label: 'Export' },
];

const SCHOOL_NAV = [
  { view: VIEWS.SCHOOL_MODE, icon: '\u{1f4da}', label: 'Lecture Intelligence' },
];

const WORK_NAV = [
  { view: VIEWS.WORK_MODE, icon: '\u{1f4bc}', label: 'Meeting Intelligence' },
];

const NAV_BY_MODE = {
  [APP_MODE.NEURO]:  NEURO_NAV,
  [APP_MODE.SCHOOL]: SCHOOL_NAV,
  [APP_MODE.WORK]:   WORK_NAV,
};

export default function Sidebar() {
  const { state, dispatch } = useAppContext();
  const navigate = useNav();
  const { currentView, course, sidebarCollapsed, sources, cards, appMode } = state;

  const hasCourse = !!course;
  const navItems  = NAV_BY_MODE[appMode] ?? NEURO_NAV;

  return (
    <aside
      className={`flex flex-col bg-surface-0/85 border-r border-surface-200/70 backdrop-blur-md transition-all duration-200 no-print ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } shrink-0`}
      style={{ minHeight: '100vh' }}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-200/70">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-900 truncate">NeuroApp</div>
            <div className="text-xs text-ink-500 truncate">Study Intelligence</div>
          </div>
        )}
      </div>

      <ModeSwitcher collapsed={sidebarCollapsed} />

      {appMode === APP_MODE.NEURO && hasCourse && !sidebarCollapsed && (
        <div className="px-4 py-3 border-b border-surface-200/70">
          <div className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-1">Current Course</div>
          <div className="text-sm font-semibold text-ink-900 truncate">{course.name}</div>
          <div className="text-xs text-ink-500 truncate">{course.professor}</div>
          <div className="text-xs text-ink-300 mt-0.5">{course.semester}</div>
        </div>
      )}

      <nav className="flex-1 px-2 py-3 space-y-1">
        {navItems.map(({ view, icon, label }) => {
          const disabled = appMode === APP_MODE.NEURO && !hasCourse && view !== VIEWS.DASHBOARD;
          const active   = currentView === view;
          return (
            <button
              key={view}
              onClick={() => !disabled && navigate(view)}
              disabled={disabled}
              title={sidebarCollapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-primary-600 text-white shadow-sm'
                  : disabled
                  ? 'text-ink-300 cursor-not-allowed'
                  : 'text-ink-700 hover:bg-surface-100'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <span className="text-base leading-none">{icon}</span>
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {appMode === APP_MODE.NEURO && hasCourse && !sidebarCollapsed && (
        <div className="px-4 py-3 border-t border-surface-200/70">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-0/80 rounded-xl p-2 text-center border border-surface-200/70">
              <div className="text-lg font-bold text-ink-900">{sources.length}</div>
              <div className="text-xs text-ink-500">Sources</div>
            </div>
            <div className="bg-surface-0/80 rounded-xl p-2 text-center border border-surface-200/70">
              <div className="text-lg font-bold text-primary-600">{cards.length}</div>
              <div className="text-xs text-ink-500">Cards</div>
            </div>
          </div>
        </div>
      )}

      <div className="p-2 border-t border-surface-200/70">
        <button
          onClick={() => dispatch({ type: ACTIONS.TOGGLE_SIDEBAR })}
          className="w-full flex items-center justify-center py-2 rounded-xl text-ink-500 hover:bg-surface-100 transition-colors text-sm"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? '\u2192' : '\u2190'}
        </button>
      </div>
    </aside>
  );
}
