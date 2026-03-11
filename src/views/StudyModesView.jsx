import { useStudyMode } from '../hooks/useStudyMode';
import { useAppContext, useNav } from '../hooks/useAppContext';
import FlashcardMode from '../components/study/FlashcardMode';
import ExamCramMode from '../components/study/ExamCramMode';
import QuizPredictorMode from '../components/study/QuizPredictorMode';
import ProfessorWordingMode from '../components/study/ProfessorWordingMode';
import CardGrid from '../components/cards/CardGrid';
import Button from '../components/ui/Button';

const MODES = [
  { id: 'flashcard', label: 'Flashcard', icon: '◈', desc: 'Flip cards one at a time' },
  { id: 'exam_cram', label: 'Exam Cram', icon: '★', desc: 'Top 25% — must-know only' },
  { id: 'quiz_predictor', label: 'Quiz Predictor', icon: '▣', desc: 'Predicted questions + answers' },
  { id: 'professor_wording', label: 'Prof. Wording', icon: '◎', desc: "Mirror professor's phrasing" },
  { id: 'clinical_focus', label: 'Clinical Focus', icon: '⬡', desc: 'Disorders, symptoms, lesions' },
  { id: 'conceptual', label: 'Conceptual', icon: '↑', desc: 'Full mechanism explanations' },
  { id: 'syllabus_aligned', label: 'Syllabus Order', icon: '→', desc: 'Ordered by unit & week' },
];

export default function StudyModesView() {
  const { filteredCards, studyMode, setMode } = useStudyMode();
  const { state } = useAppContext();
  const navigate = useNav();
  const { analysis } = state;

  if (filteredCards.length === 0 && state.cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4 opacity-30">◈</div>
        <h2 className="text-lg font-semibold text-ink-900 mb-2">No Cards to Study</h2>
        <p className="text-sm text-ink-500 mb-5">Generate cards first from your course materials.</p>
        <Button onClick={() => navigate('import')}>Import Materials →</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Mode selector */}
      <div className="bg-surface-0 border border-surface-200 rounded-xl p-3">
        <div className="flex flex-wrap gap-2">
          {MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              title={mode.desc}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                studyMode === mode.id
                  ? 'bg-ink-900 text-white shadow-sm'
                  : 'text-ink-600 hover:bg-surface-100'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
        {studyMode && (
          <p className="text-xs text-ink-400 mt-2 px-1">
            {MODES.find(m => m.id === studyMode)?.desc || ''} · {filteredCards.length} cards
          </p>
        )}
      </div>

      {/* Mode content */}
      {studyMode === 'flashcard' && <FlashcardMode cards={filteredCards} />}
      {studyMode === 'exam_cram' && <ExamCramMode cards={filteredCards} />}
      {studyMode === 'quiz_predictor' && <QuizPredictorMode cards={filteredCards} />}
      {studyMode === 'professor_wording' && (
        <ProfessorWordingMode cards={filteredCards} professorStyle={analysis.professorStyle} />
      )}
      {(studyMode === 'clinical_focus' || studyMode === 'conceptual' || studyMode === 'syllabus_aligned') && (
        <div className="space-y-3">
          <div className="p-4 bg-surface-0 border border-surface-200 rounded-xl">
            <h3 className="text-sm font-semibold text-ink-900 mb-1">
              {studyMode === 'clinical_focus' && 'Clinical Focus — Disorders, Deficits, and Symptoms'}
              {studyMode === 'conceptual' && 'Conceptual Understanding — Full Mechanisms and Pathways'}
              {studyMode === 'syllabus_aligned' && 'Syllabus-Aligned — Ordered by Unit and Week'}
            </h3>
            <p className="text-xs text-ink-500">
              {studyMode === 'clinical_focus' && 'Cards filtered to emphasize clinical tie-ins, lesion patterns, and symptom presentations.'}
              {studyMode === 'conceptual' && 'All cards displayed with full mechanism detail. Click any card to see complete content.'}
              {studyMode === 'syllabus_aligned' && 'Cards ordered by their unit and week as mapped from your syllabus.'}
            </p>
          </div>
          <CardGrid cards={filteredCards} />
        </div>
      )}
    </div>
  );
}
