import { useState } from 'react';

export default function StudyCardFlip({ front, back, onFlip, isFlipped: controlledFlipped }) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isControlled = controlledFlipped !== undefined;
  const flipped = isControlled ? controlledFlipped : internalFlipped;

  const handleFlip = () => {
    if (!isControlled) setInternalFlipped(f => !f);
    onFlip?.(!flipped);
  };

  return (
    <div
      className="perspective-1000 w-full cursor-pointer"
      style={{ height: 320 }}
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-surface-0 border border-surface-200 rounded-2xl shadow-card-hover p-8 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-3">Topic</div>
          {front}
          <div className="mt-auto pt-4 text-xs text-ink-300">Click to flip</div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-ink-900 border border-ink-700 rounded-2xl shadow-card-hover p-8 flex flex-col overflow-auto">
          {back}
        </div>
      </div>
    </div>
  );
}
