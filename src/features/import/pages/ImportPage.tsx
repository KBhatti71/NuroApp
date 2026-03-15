import { useNavigate } from 'react-router-dom';
// @ts-ignore - Gradual migration to TypeScript
import Button from '@/components/ui/Button';
// @ts-ignore - Gradual migration to TypeScript
import DropZone from '@/components/import/DropZone';
// @ts-ignore - Gradual migration to TypeScript
import UrlImportForm from '@/components/import/UrlImportForm';
// @ts-ignore - Gradual migration to TypeScript
import SourceList from '@/components/import/SourceList';

export default function ImportPage() {
  const navigate = useNavigate();

  // Mock data for now - we'll integrate with context later
  const sources = [];
  const isRunning = false;

  const handleFiles = async (files: File[]) => {
    // For now, just log - we'll implement file handling later
    console.log('Files to handle:', files);
  };

  const handlePastedText = ({ name, text, type }: { name: string; text: string; type: string }) => {
    // For now, just log - we'll implement text handling later
    console.log('Pasted text:', { name, text, type });
  };

  const runAnalysis = () => {
    // For now, navigate to analysis - we'll implement pipeline later
    navigate('/analysis');
  };

  const canAnalyze = sources.length > 0 && !isRunning;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-primary-50/80 border border-primary-200/70 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-primary-600 text-lg shrink-0 mt-0.5">◎</span>
        <div>
          <p className="text-sm font-medium text-primary-900">Start with your syllabus for best results</p>
          <p className="text-sm text-primary-700 mt-0.5">
            Upload the syllabus first so the AI can build a course map. Then add transcripts, quizzes, slides,
            and notes. Quizzes and transcripts carry the most weight in card generation.
          </p>
        </div>
      </div>

      <div className="surface-card p-4">
        <h3 className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-3">Source Signal Weights</h3>
        <div className="flex flex-wrap gap-2">
          {[
            ['quiz', '#1e9d91', 'Quiz (100%)'],
            ['syllabus', '#2f7f68', 'Syllabus (90%)'],
            ['transcript', '#2e6f9b', 'Transcript (85%)'],
            ['slides', '#3a8f7a', 'Slides (75%)'],
            ['study_guide', '#2c8e86', 'Study Guide (75%)'],
            ['notes', '#b6782e', 'Notes (50%)'],
            ['textbook', '#6c6258', 'Textbook (35%)'],
            ['web', '#9a8f84', 'Web (20%)'],
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

      <div className="surface-card overflow-hidden">
        <div className="border-b border-surface-200/70 px-6 pt-5 pb-0">
          <h2 className="text-base font-semibold text-ink-900 mb-4">Add Course Materials</h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-ink-700 mb-2">Upload Files</h3>
            <DropZone onFiles={handleFiles} />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-surface-200/70" />
            <span className="text-xs text-ink-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-surface-200/70" />
          </div>

          <div>
            <h3 className="text-sm font-medium text-ink-700 mb-2">Paste Content</h3>
            <UrlImportForm onAdd={handlePastedText} />
          </div>
        </div>
      </div>

      <SourceList />

      {sources.length > 0 && (
        <div className="sticky bottom-6">
          <div className="surface-card p-4 flex items-center justify-between shadow-card-hover">
            <div>
              <p className="text-sm font-semibold text-ink-900">
                {sources.length} source{sources.length !== 1 ? 's' : ''} ready
              </p>
              <p className="text-xs text-ink-500 mt-0.5">
                Analysis will detect professor patterns and generate study cards
              </p>
            </div>
            <Button
              onClick={runAnalysis}
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