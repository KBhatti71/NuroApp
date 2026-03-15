import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ACTIONS } from '../context/actions';
import { VIEWS } from '../constants/views';

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

// Map views to routes
const VIEW_TO_ROUTE = {
  [VIEWS.LANDING]: '/',
  [VIEWS.COURSE_SETUP]: '/course-setup',
  [VIEWS.DASHBOARD]: '/dashboard',
  [VIEWS.IMPORT]: '/import',
  [VIEWS.ANALYSIS]: '/analysis',
  [VIEWS.CARD_GENERATION]: '/card-generation',
  [VIEWS.STUDY_MODES]: '/study-modes',
  [VIEWS.EXPORT]: '/export',
  [VIEWS.SCHOOL_MODE]: '/school-mode',
  [VIEWS.WORK_MODE]: '/work-mode',
};

/**
 * useNav — stable navigation callback.
 * Uses React Router for navigation while keeping context in sync.
 */
export function useNav() {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  return useCallback(
    (view) => {
      const route = VIEW_TO_ROUTE[view];
      if (route) {
        navigate(route);
        dispatch({ type: ACTIONS.SET_VIEW, payload: view });
      }
    },
    [dispatch, navigate],
  );
}
