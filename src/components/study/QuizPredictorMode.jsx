import { useState } from 'react';

function QuizCard({ card }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden shadow-card">
      {/* Likelihood bar */}
      <div
        className="h-1"
        style={{
          backgroundColor: card.quizLikelihood >= 85 ? '#34d399' : card.quizLikelihood >= 70 ? '#fbbf24' : '#f87171',
          width: `${card.quizLikelihood}%`,
        }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-xs text-ink-400 mb-1">{card.unit}</div>
            <div className="text-sm font-semibold text-ink-900">{card.topic}</div>
          </div>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{
              backgroundColor: card.quizLikelihood >= 85 ? '#dcfce7' : '#fef3c7',
              color: card.quizLikelihood >= 85 ? '#15803d' : '#92400e',
            }}
          >
            ★ {card.quizLikelihood}%
          </span>
        </div>

        {/* Question */}
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-3">
          <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">Predicted Question</div>
          <p className="text-sm text-indigo-900 font-medium leading-relaxed">{card.likelyExamQuestion}</p>
        </div>

        {/* Reveal answer */}
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm font-medium text-ink-600 hover:bg-surface-100 transition-colors"
          >
            Reveal Answer ↓
          </button>
        ) : (
          <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
            <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Model Answer</div>
            <p className="text-sm text-ink-700 leading-relaxed">{card.likelyExamAnswer}</p>

            <div className="mt-3 pt-3 border-t border-surface-200">
              <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1">Memory Hook</div>
              <p className="text-xs text-primary-600 font-medium">{card.memoryHook}</p>
            </div>

            <button
              onClick={() => setRevealed(false)}
              className="mt-2 text-xs text-ink-400 hover:text-ink-700 transition-colors"
            >
              Hide answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPredictorMode({ cards }) {
  const sorted = [...cards].sort((a, b) => b.quizLikelihood - a.quizLikelihood);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
        <p className="text-sm text-indigo-800">
          <strong>Quiz Predictor</strong> — Based on Dr. Chen's detected quiz patterns (case-vignette format,
          clinical bias, application depth). Questions are predicted from cross-source analysis and past quiz style.
        </p>
      </div>

      <div className="space-y-4">
        {sorted.map(card => (
          <QuizCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
