import { createContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { appReducer, initialState } from './appReducer';
import { loadState, saveState } from '../services/storage';

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const saveTimer = useRef(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      dispatch({ type: 'HYDRATE', payload: saved });
    }
  }, []);

  // Debounced persistence — save 500ms after last state change
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveState(state);
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [state]);

  const dispatchAction = useCallback((type, payload) => {
    dispatch({ type, payload });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, dispatchAction }}>
      {children}
    </AppContext.Provider>
  );
}
