import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { ToastContext } from './toastContext';

const TYPE_STYLES = {
  success: 'bg-emerald-800 text-white',
  error:   'bg-red-800 text-white',
  warning: 'bg-amber-700 text-white',
  default: 'bg-ink-900 text-white',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'default', duration = 3000) => {
    const id = uuid();
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            role="status"
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg pointer-events-auto text-sm font-medium ${TYPE_STYLES[t.type] ?? TYPE_STYLES.default}`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="shrink-0 text-white/60 hover:text-white transition-colors text-base leading-none"
            >
              \u00d7
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
