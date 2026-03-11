import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ACTIONS } from '../context/actions';

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function useNav() {
  const { dispatch } = useAppContext();
  return (view) => dispatch({ type: ACTIONS.SET_VIEW, payload: view });
}
