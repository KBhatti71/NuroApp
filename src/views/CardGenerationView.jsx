import { useStudyMode } from '../hooks/useStudyMode';
import { useNav } from '../hooks/useAppContext';
import { usePipeline } from '../hooks/usePipeline';
import CardFilters from '../components/cards/CardFilters';
import CardGrid from '../components/cards/CardGrid';
import Button from '../components/ui/Button';

export default function CardGenerationView() {
  const { filteredCards, allCards } = useStudyMode();
  const navigate = useNav();
  const { run, isRunning } = usePipeline();

  if (allCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-2xl mb-5">▣</div>
        <h2 className="text-xl font-bold text-ink-900 mb-2">No Cards Generated Yet</h2>
        <p className="text-ink-500 text-sm mb-6 leading-relaxed">
          Import your course materials — syllabus, transcripts, quizzes, and slides — then run the analysis to generate
          professor-aligned 3×5 study cards.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button onClick={() => navigate('import')}>Import Materials</Button>
          <Button variant="secondary" onClick={run} disabled={isRunning}>
            {isRunning ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header stats */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-ink-900">{allCards.length}</div>
            <div className="text-xs text-ink-500">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-warn-400">
              {allCards.filter(c => c.pinned).length}
            </div>
            <div className="text-xs text-ink-500">Pinned</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-primary-500">
              {allCards.filter(c => c.quizLikelihood >= 85).length}
            </div>
            <div className="text-xs text-ink-500">Very High ★</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-ink-700">
              {Math.round(allCards.reduce((n, c) => n + c.quizLikelihood, 0) / allCards.length)}%
            </div>
            <div className="text-xs text-ink-500">Avg Likelihood</div>
          </div>
        </div>

        <div className="ml-auto flex gap-2">
          <Button variant="secondary" onClick={() => navigate('analysis')} size="sm">
            View Analysis
          </Button>
          <Button onClick={() => navigate('study_modes')} size="sm">
            Study Now →
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CardFilters />

      {/* Results count when filtered */}
      {filteredCards.length !== allCards.length && (
        <p className="text-sm text-ink-500">
          Showing {filteredCards.length} of {allCards.length} cards
        </p>
      )}

      {/* Card grid */}
      <CardGrid cards={filteredCards} />
    </div>
  );
}
