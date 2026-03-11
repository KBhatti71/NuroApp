import { useState } from 'react';
import { useExport } from '../hooks/useExport';
import { useStudyMode } from '../hooks/useStudyMode';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

function ExportOption({ icon, title, desc, action, color }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await action();
    setLoading(false);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-left w-full p-5 bg-surface-0 border border-surface-200 rounded-xl hover:border-primary-300 hover:shadow-card-hover transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${color}`}>
          {loading ? <Spinner size="sm" /> : done ? '✓' : icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink-900 group-hover:text-primary-600 transition-colors">
            {done ? 'Done!' : title}
          </div>
          <div className="text-xs text-ink-500 mt-0.5">{desc}</div>
        </div>
        <span className="text-ink-300 group-hover:text-primary-400 transition-colors text-sm">→</span>
      </div>
    </button>
  );
}

export default function ExportView() {
  const { exportPDF, copyMarkdown, downloadJSON, print } = useExport();
  const { filteredCards, allCards } = useStudyMode();
  const [useFiltered, setUseFiltered] = useState(false);

  const targetCards = useFiltered ? filteredCards : allCards;

  const exportOptions = [
    {
      icon: '⎙',
      title: 'Export as PDF',
      desc: `${targetCards.length} cards · 5×3 inch landscape, one card per page — ready to print`,
      action: () => exportPDF(targetCards),
      color: 'bg-red-50 text-red-500',
    },
    {
      icon: '⎗',
      title: 'Print Cards',
      desc: `${targetCards.length} cards · Opens print dialog with formatted card layout`,
      action: () => print(targetCards),
      color: 'bg-blue-50 text-blue-500',
    },
    {
      icon: '⎘',
      title: 'Copy as Markdown',
      desc: `${targetCards.length} cards · Copy all card content as structured Markdown to clipboard`,
      action: () => copyMarkdown(targetCards),
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: '⎙',
      title: 'Download JSON',
      desc: `${targetCards.length} cards · Full card data for import into Anki or other tools`,
      action: () => downloadJSON(targetCards),
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Card selection */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-3">Which cards to export?</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setUseFiltered(false)}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${
              !useFiltered
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-surface-0 text-ink-600 border-surface-200 hover:border-ink-300'
            }`}
          >
            All Cards ({allCards.length})
          </button>
          <button
            onClick={() => setUseFiltered(true)}
            disabled={filteredCards.length === allCards.length}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              useFiltered
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-surface-0 text-ink-600 border-surface-200 hover:border-ink-300'
            }`}
          >
            Filtered Only ({filteredCards.length})
          </button>
        </div>
        {useFiltered && filteredCards.length < allCards.length && (
          <p className="text-xs text-ink-500 mt-2">
            Using current filter selection from the Study Cards view.
          </p>
        )}
      </Card>

      {/* Export options */}
      <div>
        <h3 className="text-sm font-semibold text-ink-700 mb-3 uppercase tracking-wider">Export Formats</h3>
        <div className="space-y-3">
          {exportOptions.map((opt) => (
            <ExportOption key={opt.title} {...opt} />
          ))}
        </div>
      </div>

      {/* Preview */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-ink-900 mb-4">Card Preview (first {Math.min(3, targetCards.length)})</h3>
        <div className="space-y-4">
          {targetCards.slice(0, 3).map(card => (
            <div key={card.id} className="border border-surface-200 rounded-xl p-4 font-mono text-xs space-y-1">
              <div className="text-ink-400">[{card.unit}] · ★ {card.quizLikelihood}%</div>
              <div className="text-ink-900 font-bold text-sm font-sans">{card.topic}</div>
              <div className="text-ink-600 font-sans leading-relaxed">
                {card.coreIdea.slice(0, 120)}...
              </div>
              <div className="flex gap-2 pt-1">
                {card.keyTerms?.slice(0, 3).map(kt => (
                  <span key={kt.term} className="px-2 py-0.5 bg-surface-100 rounded text-ink-500">{kt.term}</span>
                ))}
              </div>
            </div>
          ))}
          {targetCards.length > 3 && (
            <p className="text-xs text-ink-400 text-center">+ {targetCards.length - 3} more cards</p>
          )}
        </div>
      </Card>
    </div>
  );
}
