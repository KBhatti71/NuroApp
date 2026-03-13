import { useAppContext, useNav } from '../hooks/useAppContext';
import { VIEWS } from '../constants/views';
import PipelineProgress from '../components/analysis/PipelineProgress';
import ProfessorStylePanel from '../components/analysis/ProfessorStylePanel';
import QuizPatternPanel from '../components/analysis/QuizPatternPanel';
import ConceptHeatmap from '../components/analysis/ConceptHeatmap';
import Button from '../components/ui/Button';

export default function AnalysisView() {
  const { state } = useAppContext();
  const navigate = useNav();
  const { pipeline, analysis } = state;

  const isRunning = pipeline.status === 'running';
  const isIdle = pipeline.status === 'idle';
  const hasAnalysis = analysis.professorStyle || analysis.quizPattern || analysis.highYieldConcepts?.length > 0;

  if (isRunning || (!hasAnalysis && !isIdle)) {
    return (
      <div className="py-10">
        <PipelineProgress pipeline={pipeline} />
      </div>
    );
  }

  if (!hasAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4 opacity-40">\u25ce</div>
        <h2 className="text-lg font-semibold text-ink-900 mb-2">No Analysis Yet</h2>
        <p className="text-ink-500 text-sm mb-6 max-w-sm">
          Import materials and run the analysis pipeline to see professor style detection and concept scoring.
        </p>
        <Button onClick={() => navigate(VIEWS.IMPORT)}>Import Materials \u2192</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {pipeline.log?.length > 0 && (
        <div className="surface-card p-4 space-y-1 bg-ink-900/90 text-ink-300">
          {pipeline.log.map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-primary-200 text-xs font-mono">\u2192</span>
              <span className="text-xs font-mono">{line}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ProfessorStylePanel style={analysis.professorStyle} />
        <QuizPatternPanel pattern={analysis.quizPattern} />
        <ConceptHeatmap concepts={analysis.highYieldConcepts} />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => navigate(VIEWS.CARD_GENERATION)} size="lg">
          View Generated Cards \u2192
        </Button>
      </div>
    </div>
  );
}
