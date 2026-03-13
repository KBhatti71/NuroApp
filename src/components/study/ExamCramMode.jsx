export default function ExamCramMode({ cards }) {
  const cramCards = [...cards].filter(c => c.quizLikelihood >= 75).sort((a, b) => b.quizLikelihood - a.quizLikelihood);

  if (cramCards.length === 0) {
    return (
      <div className="text-center py-10 text-ink-400">
        <div className="text-3xl mb-2 opacity-40">\u2605</div>
        <p className="text-sm">No high-likelihood cards available. Lower the filter or add more quiz materials.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-ink-900">
          Exam Cram - {cramCards.length} Must-Know Cards
        </h2>
        <span className="text-xs text-ink-500 bg-surface-100 px-2.5 py-1 rounded-full">
          Quiz likelihood \u2265 75%
        </span>
      </div>

      {cramCards.map(card => (
        <div key={card.id} className="bg-ink-900 rounded-2xl p-5 border border-ink-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-ink-400">{card.unit}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{card.topic}</h3>
            </div>
            <span className="text-xs font-bold text-success-400 bg-success-400/10 px-2.5 py-1 rounded-full border border-success-400/20">
              \u2605 {card.quizLikelihood}%
            </span>
          </div>

          {card.studyModeVariants?.examCram?.oneLineSummary && (
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg px-4 py-3 mb-3">
              <p className="text-sm text-primary-300 font-semibold leading-relaxed">
                {card.studyModeVariants.examCram.oneLineSummary}
              </p>
            </div>
          )}

          {card.studyModeVariants?.examCram?.mustKnow && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {card.studyModeVariants.examCram.mustKnow.map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                  <span className="text-xs text-ink-300 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-ink-700">
            <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider">Likely Question:</span>
            <p className="text-xs text-primary-200 mt-1 leading-relaxed">{card.likelyExamQuestion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
