function highlightSignatureTerms(text, terms = []) {
  if (!terms.length || !text) return text;
  let highlighted = text;
  terms.forEach(term => {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    highlighted = highlighted.replace(regex, '**$1**');
  });
  return highlighted;
}

function ProfText({ text, terms: _terms }) {
  const parts = text?.split(/\*\*([^*]+)\*\*/g) || [text || ''];
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-primary-100 text-primary-800 rounded px-0.5 font-semibold not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function ProfessorWordingMode({ cards, professorStyle }) {
  const signatureTerms = professorStyle?.signatureTerms || [];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl mb-2">
        <p className="text-sm text-teal-800">
          <strong>Professor Wording</strong> — Cards reframed in Dr. Chen's detected language and emphasis patterns.
          <span className="bg-primary-100 text-primary-800 rounded px-0.5 font-semibold text-xs ml-2">highlighted terms</span>
          {' '}are her signature phrases.
        </p>
      </div>

      {cards.map(card => {
        const pv = card.studyModeVariants?.professorWording;
        if (!pv) return null;

        const processedCoreIdea = highlightSignatureTerms(pv.coreIdea, signatureTerms);
        const processedMechanism = highlightSignatureTerms(pv.mechanism, signatureTerms);

        return (
          <div key={card.id} className="bg-surface-0 border border-surface-200 rounded-xl overflow-hidden shadow-card">
            <div className="h-1 bg-primary-500" />
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-ink-400 mb-1">{card.unit}</div>
                  <h3 className="text-base font-bold text-ink-900">{pv.topic}</h3>
                </div>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">
                  Prof. Style
                </span>
              </div>

              <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">
                  Core Idea — How She'd Explain It
                </div>
                <p className="text-sm text-teal-900 leading-relaxed italic">
                  <ProfText text={processedCoreIdea} terms={signatureTerms} />
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">
                  Mechanism — Her Focus
                </div>
                <p className="text-sm text-ink-700 leading-relaxed">
                  <ProfText text={processedMechanism} terms={signatureTerms} />
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Memory Hook</div>
                <p className="text-xs text-amber-800 font-medium">{card.memoryHook}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
