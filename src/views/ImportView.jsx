import { useAppContext } from '../hooks/useAppContext';
import { ACTIONS } from '../context/actions';
import { usePipeline } from '../hooks/usePipeline';
import { parseFileContent, parseTextContent } from '../services/pipeline/contentParser';
import DropZone from '../components/import/DropZone';
import UrlImportForm from '../components/import/UrlImportForm';
import SourceList from '../components/import/SourceList';
import Button from '../components/ui/Button';

const TABS = ['Upload Files', 'Paste Text'];

export default function ImportView() {
  const { state, dispatch } = useAppContext();
  const { sources } = state;
  const { run, isRunning } = usePipeline();

  const handleFiles = async (files) => {
    for (const file of files) {
      const parsed = await parseFileContent(file);
      dispatch({ type: ACTIONS.ADD_SOURCE, payload: parsed });
    }
  };

  const handlePastedText = ({ name, text, type }) => {
    const source = parseTextContent(name, text, type);
    dispatch({ type: ACTIONS.ADD_SOURCE, payload: source });
  };

  const canAnalyze = sources.length > 0 && !isRunning;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Guidance banner */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-primary-500 text-lg shrink-0 mt-0.5">◎</span>
        <div>
          <p className="text-sm font-medium text-primary-800">Start with your syllabus for best results</p>
          <p className="text-sm text-primary-600 mt-0.5">
            Upload the syllabus first so the AI can build a course map. Then add transcripts, quizzes, slides,
            and notes. Quizzes and transcripts carry the most weight in card generation.
          </p>
        </div>
      </div>

      {/* Weight legend */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-3">Source Signal Weights</h3>
        <div className="flex flex-wrap gap-2">
          {[
            ['quiz', '#6366f1', 'Quiz (100%)'],
            ['syllabus', '#8b5cf6', 'Syllabus (90%)'],
            ['transcript', '#0ea5e9', 'Transcript (85%)'],
            ['slides', '#10b981', 'Slides (75%)'],
            ['study_guide', '#14b8a6', 'Study Guide (75%)'],
            ['notes', '#f59e0b', 'Notes (50%)'],
            ['textbook', '#6b7280', 'Textbook (35%)'],
            ['web', '#9ca3af', 'Web (20%)'],
          ].map(([, color, label]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: color + '18', color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Upload tabs */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden">
        <div className="border-b border-surface-200 px-6 pt-5 pb-0">
          <h2 className="text-base font-semibold text-ink-900 mb-4">Add Course Materials</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Drop zone */}
          <div>
            <h3 className="text-sm font-medium text-ink-700 mb-2">Upload Files</h3>
            <DropZone onFiles={handleFiles} />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-ink-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          {/* Paste text */}
          <div>
            <h3 className="text-sm font-medium text-ink-700 mb-2">Paste Content</h3>
            <UrlImportForm onAdd={handlePastedText} />
          </div>
        </div>
      </div>

      {/* Source list */}
      <SourceList />

      {/* Analyze CTA */}
      {sources.length > 0 && (
        <div className="sticky bottom-6">
          <div className="bg-surface-0 border border-surface-200 rounded-xl p-4 flex items-center justify-between shadow-card-hover">
            <div>
              <p className="text-sm font-semibold text-ink-900">
                {sources.length} source{sources.length !== 1 ? 's' : ''} ready
              </p>
              <p className="text-xs text-ink-500 mt-0.5">
                Analysis will detect professor patterns and generate study cards
              </p>
            </div>
            <Button
              onClick={run}
              disabled={!canAnalyze}
              size="lg"
            >
              {isRunning ? 'Analyzing...' : 'Analyze Materials →'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
