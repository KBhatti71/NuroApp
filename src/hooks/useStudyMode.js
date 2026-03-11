import { useMemo } from 'react';
import { useAppContext } from './useAppContext';
import { ACTIONS } from '../context/actions';

export function useStudyMode() {
  const { state, dispatch } = useAppContext();
  const { cards, studyMode, filters } = state;

  const filteredCards = useMemo(() => {
    // Strip any null/undefined entries that can arise from stale persisted state
    let result = cards.filter(c => c != null);

    // Apply global filters
    if (filters.unitId) {
      result = result.filter(c => c.unitId === filters.unitId);
    }
    if (filters.pinnedOnly) {
      result = result.filter(c => c.pinned);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(c =>
        c.topic.toLowerCase().includes(q) ||
        c.coreIdea.toLowerCase().includes(q) ||
        c.keyTerms.some(kt => kt.term.toLowerCase().includes(q)) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(c =>
        filters.tags.every(t => c.tags.includes(t))
      );
    }
    if (filters.minQuizLikelihood > 0) {
      result = result.filter(c => c.quizLikelihood >= filters.minQuizLikelihood);
    }

    // Apply mode-specific transformations
    switch (studyMode) {
      case 'exam_cram':
        result = result
          .filter(c => c.quizLikelihood >= 75)
          .sort((a, b) => b.quizLikelihood - a.quizLikelihood);
        break;
      case 'clinical_focus':
        result = result
          .filter(c => c.clinicalTieIn && c.clinicalTieIn.length > 50)
          .sort((a, b) => b.quizLikelihood - a.quizLikelihood);
        break;
      case 'syllabus_aligned':
        result = result.sort((a, b) => (a.unitId ?? '').localeCompare(b.unitId ?? ''));
        break;
      case 'flashcard':
      case 'quiz_predictor':
      case 'professor_wording':
      case 'conceptual':
      default:
        result = result.sort((a, b) => b.quizLikelihood - a.quizLikelihood);
        break;
    }

    return result;
  }, [cards, studyMode, filters]);

  const setMode = (mode) => {
    dispatch({ type: ACTIONS.SET_STUDY_MODE, payload: mode });
  };

  const setFilter = (updates) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: updates });
  };

  const resetFilters = () => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
  };

  return { filteredCards, studyMode, setMode, setFilter, resetFilters, allCards: cards.filter(c => c != null) };
}
