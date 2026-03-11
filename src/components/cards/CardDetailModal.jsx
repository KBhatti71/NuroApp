import { useState } from 'react';
import Modal from '../ui/Modal';
import { useAppContext } from '../../hooks/useAppContext';
import { ACTIONS } from '../../context/actions';

const SECTION_LABEL = ({ children }) => (
  <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">{children}</div>
);

const TABS = ['Full Card', 'Exam Cram', 'Professor Wording', 'Edit'];

const UNIT_COLORS = {
  unit_01: '#6366f1',
  unit_02: '#0ea5e9',
  unit_03: '#10b981',
  unit_04: '#f59e0b',
  unit_05: '#8b5cf6',
};

export default function CardDetailModal({ card, isOpen, onClose }) {
  const { dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('Full Card');
  const [editedCard, setEditedCard] = useState(null);

  if (!card) return null;

  const unitColor = UNIT_COLORS[card.unitId] || '#14b8a6';

  const handlePin = () => {
    dispatch({ type: ACTIONS.TOGGLE_PIN, payload: card.id });
  };

  const handleSaveEdit = () => {
    if (editedCard) {
      dispatch({ type: ACTIONS.UPDATE_CARD, payload: { id: card.id, updates: editedCard } });
    }
    setActiveTab('Full Card');
  };

  const handleDelete = () => {
    dispatch({ type: ACTIONS.DELETE_CARD, payload: card.id });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {/* Colored header bar */}
      <div className="h-1.5" style={{ backgroundColor: unitColor }} />

      <div className="px-6 py-5 border-b border-surface-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: unitColor + '18', color: unitColor }}
              >
                {card.unit}
              </span>
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                style={{
                  backgroundColor: card.quizLikelihood >= 85 ? '#dcfce7' : '#fef3c7',
                  color: card.quizLikelihood >= 85 ? '#15803d' : '#92400e',
                }}
              >
                ★ Quiz Likelihood: {card.quizLikelihood}%
              </span>
            </div>
            <h2 className="text-lg font-bold text-ink-900">{card.topic}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePin}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                card.pinned ? 'text-warn-400 bg-warn-50' : 'text-ink-400 hover:bg-surface-100'
              }`}
              title={card.pinned ? 'Unpin' : 'Pin'}
            >
              ★
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(`${card.topic}\n\n${card.coreIdea}`)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-surface-100 text-xs transition-colors"
              title="Copy card text"
            >
              ⎘
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:bg-surface-100 text-lg transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab === 'Edit') setEditedCard({ ...card }); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-600 hover:bg-surface-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {activeTab === 'Full Card' && (
          <>
            <div>
              <SECTION_LABEL>Core Idea</SECTION_LABEL>
              <p className="text-sm text-ink-700 leading-relaxed">{card.coreIdea}</p>
            </div>

            <div>
              <SECTION_LABEL>Key Terms</SECTION_LABEL>
              <div className="space-y-2">
                {card.keyTerms?.map((kt) => (
                  <div key={kt.term} className="flex gap-3 text-sm">
                    <span className="font-semibold text-ink-900 shrink-0 min-w-32">{kt.term}</span>
                    <span className="text-ink-600">{kt.definition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SECTION_LABEL>Mechanism / Pathway</SECTION_LABEL>
              <div className="text-sm text-ink-700 leading-relaxed whitespace-pre-line bg-surface-50 rounded-lg p-3 border border-surface-200 font-mono text-xs">
                {card.mechanism}
              </div>
            </div>

            <div className="p-3 bg-violet-50 rounded-lg border border-violet-100">
              <SECTION_LABEL>Clinical Tie-In</SECTION_LABEL>
              <p className="text-sm text-violet-800 leading-relaxed">{card.clinicalTieIn}</p>
            </div>

            <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
              <SECTION_LABEL>Professor Emphasis</SECTION_LABEL>
              <p className="text-sm text-teal-800 leading-relaxed">{card.professorEmphasis}</p>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <SECTION_LABEL>Memory Hook</SECTION_LABEL>
              <p className="text-sm text-amber-800 leading-relaxed font-medium">{card.memoryHook}</p>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <SECTION_LABEL>Likely Exam Question</SECTION_LABEL>
              <p className="text-sm text-indigo-800 font-medium mb-2">{card.likelyExamQuestion}</p>
              <div className="border-t border-indigo-200 pt-2 mt-2">
                <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">Model Answer</div>
                <p className="text-sm text-indigo-700 leading-relaxed">{card.likelyExamAnswer}</p>
              </div>
            </div>

            {card.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {card.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-surface-100 text-ink-500 rounded-full text-xs">#{tag}</span>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'Exam Cram' && card.studyModeVariants?.examCram && (
          <div className="space-y-4">
            <div className="p-4 bg-ink-900 rounded-xl">
              <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">One-Line Summary</div>
              <p className="text-base text-white font-semibold leading-relaxed">
                {card.studyModeVariants.examCram.oneLineSummary}
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Must Know</div>
              <div className="space-y-1.5">
                {card.studyModeVariants.examCram.mustKnow?.map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                    <span className="text-sm text-ink-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Professor Wording' && card.studyModeVariants?.professorWording && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">Topic (Professor Frame)</div>
              <h3 className="text-base font-bold text-ink-900">{card.studyModeVariants.professorWording.topic}</h3>
            </div>
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2">Core Idea — How She'd Say It</div>
              <p className="text-sm text-primary-900 leading-relaxed">{card.studyModeVariants.professorWording.coreIdea}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">Mechanism — Professor's Focus</div>
              <p className="text-sm text-ink-700 leading-relaxed">{card.studyModeVariants.professorWording.mechanism}</p>
            </div>
          </div>
        )}

        {activeTab === 'Edit' && editedCard && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1 uppercase tracking-wider">Topic</label>
              <input
                type="text"
                value={editedCard.topic}
                onChange={(e) => setEditedCard(c => ({ ...c, topic: e.target.value }))}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1 uppercase tracking-wider">Core Idea</label>
              <textarea
                value={editedCard.coreIdea}
                onChange={(e) => setEditedCard(c => ({ ...c, coreIdea: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1 uppercase tracking-wider">Memory Hook</label>
              <textarea
                value={editedCard.memoryHook}
                onChange={(e) => setEditedCard(c => ({ ...c, memoryHook: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1 uppercase tracking-wider">Likely Exam Question</label>
              <textarea
                value={editedCard.likelyExamQuestion}
                onChange={(e) => setEditedCard(c => ({ ...c, likelyExamQuestion: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => { setEditedCard(null); setActiveTab('Full Card'); }}
                className="px-4 py-2 bg-surface-100 text-ink-700 rounded-lg text-sm font-medium hover:bg-surface-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="ml-auto px-4 py-2 bg-danger-50 text-danger-400 rounded-lg text-sm font-medium hover:bg-danger-100 transition-colors"
              >
                Delete Card
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
