import { useState } from 'react';
import StudyCard from './StudyCard';
import CardDetailModal from './CardDetailModal';

export default function CardGrid({ cards }) {
  const [selectedCard, setSelectedCard] = useState(null);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4 opacity-30">\u25a6</div>
        <h3 className="text-base font-semibold text-ink-700 mb-1">No cards match your filters</h3>
        <p className="text-sm text-ink-400">Try adjusting the filters above</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Study cards">
        {cards.filter(Boolean).map(card => (
          <div key={card.id} role="listitem">
            <StudyCard
              card={card}
              onClick={() => setSelectedCard(card)}
            />
          </div>
        ))}
      </div>

      <CardDetailModal
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </>
  );
}
