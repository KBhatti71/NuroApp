import { useState, useEffect } from 'react';
import StudyCardFlip from '../cards/StudyCardFlip';
import ProgressBar from '../ui/ProgressBar';

export default function FlashcardMode({ cards }) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [seen, setSeen] = useState(new Set());

  const current = cards[index];

  const next = () => {
    setSeen(s => new Set([...s, index]));
    setIsFlipped(false);
    setTimeout(() => setIndex(i => Math.min(i + 1, cards.length - 1)), 100);
  };

  const prev = () => {
    setIsFlipped(false);
    setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 100);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsFlipped(f => !f);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index, cards.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = () => {
    setIndex(0);
    setIsFlipped(false);
    setSeen(new Set());
  };

  if (!current) return null;

  const isLast = index === cards.length - 1;
  const isDone = isLast && seen.has(index);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink-700">{index + 1} / {cards.length}</span>
        <div className="flex-1">
          <ProgressBar value={index + 1} max={cards.length} />
        </div>
        <span className="text-xs text-ink-500">{seen.size} seen</span>
      </div>

      {/* Card */}
      <StudyCardFlip
        isFlipped={isFlipped}
        onFlip={setIsFlipped}
        front={
          <div className="space-y-3">
            <div
              className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1"
              style={{ backgroundColor: '#14b8a620', color: '#14b8a6' }}
            >
              {current.unit?.split(':')[0]}
            </div>
            <h2 className="text-2xl font-bold text-ink-900">{current.topic}</h2>
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">Likely Exam Question</div>
              <p className="text-sm text-indigo-800 font-medium leading-relaxed">{current.likelyExamQuestion}</p>
            </div>
          </div>
        }
        back={
          <div className="space-y-4 overflow-auto">
            <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Core Idea</div>
            <p className="text-sm text-white leading-relaxed">{current.coreIdea}</p>

            <div className="border-t border-ink-700 pt-3">
              <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Key Terms</div>
              {current.keyTerms?.slice(0, 3).map(kt => (
                <div key={kt.term} className="text-xs text-ink-300 mb-1">
                  <span className="font-semibold text-white">{kt.term}:</span> {kt.definition}
                </div>
              ))}
            </div>

            <div className="border-t border-ink-700 pt-3">
              <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1">Memory Hook</div>
              <p className="text-xs text-primary-300 font-medium leading-relaxed">{current.memoryHook}</p>
            </div>

            <div className="border-t border-ink-700 pt-3">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Answer</div>
              <p className="text-xs text-ink-200 leading-relaxed">{current.likelyExamAnswer}</p>
            </div>
          </div>
        }
      />

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-5 py-2.5 bg-surface-100 text-ink-700 rounded-xl text-sm font-medium hover:bg-surface-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>

        <div className="text-xs text-ink-400 text-center">
          Space to flip · → next · ← back
        </div>

        {isDone ? (
          <button
            onClick={restart}
            className="px-5 py-2.5 bg-success-400 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            ↺ Restart
          </button>
        ) : (
          <button
            onClick={next}
            disabled={isLast}
            className="px-5 py-2.5 bg-ink-900 text-white rounded-xl text-sm font-medium hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
