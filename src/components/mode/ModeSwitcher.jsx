import { useCallback } from 'react';
import { useAppContext, useNav } from '../../hooks/useAppContext';
import { ACTIONS } from '../../context/actions';
import { APP_MODE } from '../../constants/modes';
import { VIEWS } from '../../constants/views';

const MODES = [
  { id: APP_MODE.NEURO,  icon: '\u{1f9e0}', label: 'NeuroCards', view: VIEWS.DASHBOARD },
  { id: APP_MODE.SCHOOL, icon: '\u{1f4da}', label: 'School',     view: VIEWS.SCHOOL_MODE },
  { id: APP_MODE.WORK,   icon: '\u{1f4bc}', label: 'Work',       view: VIEWS.WORK_MODE },
];

export default function ModeSwitcher({ collapsed = false }) {
  const { state, dispatch } = useAppContext();
  const navigate = useNav();
  const { appMode } = state;

  const switchMode = useCallback((mode, view) => {
    dispatch({ type: ACTIONS.SET_APP_MODE, payload: mode });
    navigate(view);
  }, [dispatch, navigate]);

  if (collapsed) {
    return (
      <div className="px-2 py-2 border-b border-surface-200/70">
        <div className="flex flex-col gap-1">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id, m.view)}
              title={m.label}
              className={`w-full flex items-center justify-center py-1.5 rounded-xl text-base transition-colors
                ${m.id === appMode
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-ink-400 hover:bg-surface-100'
                }`}
            >
              {m.icon}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 border-b border-surface-200/70">
      <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2 px-1">Mode</div>
      <div className="flex flex-col gap-1">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id, m.view)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors
              ${m.id === appMode
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-ink-600 hover:bg-surface-100'
              }`}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
