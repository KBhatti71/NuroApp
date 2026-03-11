import { useCallback } from 'react';
import { useAppContext, useNav } from './useAppContext';
import { ACTIONS } from '../context/actions';
import { runPipeline } from '../services/pipeline/aiPipeline';

export function usePipeline() {
  const { state, dispatch } = useAppContext();
  const navigate = useNav();

  const run = useCallback(async () => {
    if (state.pipeline.status === 'running') return;

    navigate('analysis');

    const result = await runPipeline(state.sources, dispatch);

    if (result.success) {
      // Small delay so user can see completion, then navigate to cards
      setTimeout(() => {
        navigate('card_generation');
      }, 1500);
    }
  }, [state.sources, state.pipeline.status, dispatch, navigate]);

  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.PIPELINE_RESET });
  }, [dispatch]);

  return {
    run,
    reset,
    pipeline: state.pipeline,
    isRunning: state.pipeline.status === 'running',
    isComplete: state.pipeline.status === 'complete',
    isError: state.pipeline.status === 'error',
  };
}
