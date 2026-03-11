import { useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { ACTIONS } from '../context/actions';

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

/**
 * useNav — stable navigation callback.
 * Memoised with useCallback so components that receive this as a prop
 * don't re-render unnecessarily when the parent re-renders.
 */
export function useNav() {
  const { dispatch } = useAppContext();
  return useCallback(
    (view) => dispatch({ type: ACTIONS.SET_VIEW, payload: view }),
    [dispatch],
  );
}
