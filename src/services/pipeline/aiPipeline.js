import { ACTIONS } from '../../context/actions';
import { buildCourseMap } from './courseAnalyzer';
import { analyzeProfessorStyle } from './professorAnalyzer';
import { analyzeQuizzes } from './quizAnalyzer';
import { detectHighYieldConcepts } from './signalDetector';
import { generateCards } from './cardGenerator';
import { analyzeContentStats, generateContentInsights } from '../../lib/ai/contentAnalysis';

const STEP_DELAY = 900;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function step(dispatch, status, progress, logLine, ms = STEP_DELAY) {
  dispatch({
    type: ACTIONS.PIPELINE_STEP,
    payload: { status, progress, logLine },
  });
  await delay(ms);
}

export async function runPipeline(sources, dispatch) {
  try {
    dispatch({ type: ACTIONS.PIPELINE_START });
    await delay(300);

    // Analyze content and show insights
    const contentStats = analyzeContentStats(sources);
    const insights = generateContentInsights(contentStats);

    // Dispatch content insights
    dispatch({
      type: ACTIONS.SET_CONTENT_INSIGHTS,
      payload: { stats: contentStats, insights }
    });

    await step(dispatch, 'parsing', 10, '⬡ Parsing and normalizing uploaded content...', 700);

    await step(dispatch, 'analyzing_course', 25, '◎ Building course map from syllabus...', 900);
    const courseMap = buildCourseMap(sources);
    dispatch({ type: ACTIONS.SET_COURSE_MAP, payload: courseMap });

    await step(dispatch, 'analyzing_professor', 42, '◈ Inferring professor teaching style from transcripts...', 1000);
    const professorStyle = analyzeProfessorStyle(sources);

    // Show chunking info if content is long
    const totalContentLength = sources.reduce((sum, s) => sum + (s.content?.length || 0), 0);
    let chunkingMessage = '';
    if (totalContentLength > 200000) {
      chunkingMessage = ` (ultra-hierarchical analysis: ${(totalContentLength / 1000).toFixed(0)}K chars)`;
    } else if (totalContentLength > 100000) {
      chunkingMessage = ` (advanced chunking: ${(totalContentLength / 1000).toFixed(0)}K chars)`;
    } else if (totalContentLength > 15000) {
      chunkingMessage = ` (chunking ${Math.ceil(totalContentLength / 8000)} sections)`;
    }

    await step(dispatch, 'analyzing_quizzes', 58, `▣ Detecting quiz patterns and question formats${chunkingMessage}...`, 900);
    const quizPattern = analyzeQuizzes(sources);

    dispatch({
      type: ACTIONS.SET_ANALYSIS,
      payload: { professorStyle, quizPattern, highYieldConcepts: [] },
    });

    await step(dispatch, 'detecting_signals', 72, '↑ Identifying high-yield concepts via cross-source weighting...', 1000);
    const concepts = detectHighYieldConcepts(sources, courseMap, professorStyle, quizPattern);

    dispatch({
      type: ACTIONS.SET_ANALYSIS,
      payload: { professorStyle, quizPattern, highYieldConcepts: concepts },
    });

    await step(dispatch, 'generating_cards', 88, '★ Generating professor-aligned 3×5 study cards...', 1200);
    const cards = await generateCards(concepts, sources, professorStyle, quizPattern);

    dispatch({ type: ACTIONS.SET_CARDS, payload: cards });

    await step(dispatch, 'complete', 100, `✓ Complete — ${cards.length} cards generated from ${sources.length} source${sources.length !== 1 ? 's' : ''}`, 400);

    dispatch({ type: ACTIONS.PIPELINE_COMPLETE });

    return { success: true, cards, courseMap, professorStyle, quizPattern, concepts };

  } catch (err) {
    console.error('Pipeline error:', err);
    dispatch({ type: ACTIONS.PIPELINE_ERROR, payload: err.message || 'Analysis failed' });
    return { success: false, error: err.message };
  }
}
