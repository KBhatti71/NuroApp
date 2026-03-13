import { useEffect } from 'react';
import { useStudyMode } from '../hooks/useStudyMode';
import { useAppContext, useNav } from '../hooks/useAppContext';
import { VIEWS } from '../constants/views';
import FlashcardMode from '../components/study/FlashcardMode';
import ExamCramMode from '../components/study/ExamCramMode';
import QuizPredictorMode from '../components/study/QuizPredictorMode';
import ProfessorWordingMode from '../components/study/ProfessorWordingMode';
import CardGrid from '../components/cards/CardGrid';
import Button from '../components/ui/Button';

const MODES = [
  { id: 'flashcard', label: 'Flashcard', icon: '\u25c7', desc: 'Flip cards one at a time' },
  { id: 'exam_cram', label: 'Exam Cram', icon: '\u2605', desc: 'Top 25% - must-know only' },
  { id: 'quiz_predictor', label: 'Quiz Predictor', icon: '\u25a6', desc: 'Predicted questions + answers' },
  { id: 'professor_wording', label: 'Prof. Wording', icon: '\u25ce', desc: "Mirror professor's phrasing" },
  { id: 'clinical_focus', label: 'Clinical Focus', icon: '\u25a3', desc: 'Disorders, symptoms, lesions' },
  { id: 'conceptual', label: 'Conceptual', icon: '\u2191', desc: 'Full mechanism explanations' },
  { id: 'syllabus_aligned', label: 'Syllabus Order', icon: '\u2192', desc: 'Ordered by unit & week' },
];

const VALID_MODES = new Set(['flashcard', 'exam_cram', 'quiz_predictor', 'professor_wording', 'clinical_focus', 'conceptual', 'syllabus_aligned']);

export default function StudyModesView() {
  const { filteredCards, studyMode, setMode } = useStudyMode();
  const { state } = useAppContext();
  const navigate = useNav();
  const { analysis } = state;

  useEffect(() => {
    if (!VALID_MODES.has(studyMode)) {
      setMode('flashcard');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (filteredCards.length === 0 && state.cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4 opacity-30">\u25c7</div>
        <h2 className="text-lg font-semibold text-ink-900 mb-2">No Cards to Study</h2>
        <p className="text-sm text-ink-500 mb-5">Generate cards first from your course materials.</p>
        <Button onClick={() => navigate(VIEWS.IMPORT)}>Import Materials \u2192</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="surface-card p-3">
        <div className="flex flex-wrap gap-2">
          {MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              title={mode.desc}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
            {MODES.find(m => m.id === studyMode)?.desc || ''} \u00b7 {filteredCards.length} cards
          </p>
        )}
      </div>

      {studyMode === 'flashcard' && <FlashcardMode cards={filteredCards} />}
      {studyMode === 'exam_cram' && <ExamCramMode cards={filteredCards} />}
      {studyMode === 'quiz_predictor' && <QuizPredictorMode cards={filteredCards} professorStyle={analysis.professorStyle} />}
      {studyMode === 'professor_wording' && (
        <ProfessorWordingMode cards={filteredCards} professorStyle={analysis.professorStyle} />
      )}
      {(studyMode === 'clinical_focus' || studyMode === 'conceptual' || studyMode === 'syllabus_aligned') && (
        <div className="space-y-3">
          <div className="surface-card p-4">
            <h3 className="text-sm font-semibold text-ink-900 mb-1">
              {studyMode === 'clinical_focus' && 'Clinical Focus - Disorders, Deficits, and Symptoms'}
              {studyMode === 'conceptual' && 'Conceptual Understanding - Full Mechanisms and Pathways'}
              {studyMode === 'syllabus_aligned' && 'Syllabus-Aligned - Ordered by Unit and Week'}
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
