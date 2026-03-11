import { MOCK_CARDS } from '../../data/mockCards';

// Maps concept names to mock card IDs for demo mode
const CONCEPT_TO_CARD = {
  'action potential ionic basis': 'card_001',
  'synaptic transmission & snare': 'card_002',
  'synaptic vesicle cycle & snare': 'card_002',
  'glutamate & gaba balance': 'card_003',
  'glutamate & gaba: excitation/inhibition balance': 'card_003',
  'acetylcholine & nmj': 'card_004',
  'dopamine pathways': 'card_005',
  'somatosensory pathways': 'card_006',
  'motor cortex & corticospinal tract': 'card_007',
  'ltp & neuroplasticity': 'card_008',
};

export async function generateCards(concepts, _sources, _professorStyle, _quizPattern) {
  // MVP: map concepts to mock cards
  // Production: replace this with LLM API calls
  // The prompt structure is documented below for future integration

  /* === LLM INTEGRATION HOOKPOINT ===
   * For each concept, call:
   * const card = await callLLM({
   *   system: buildSystemPrompt(professorStyle, quizPattern),
   *   user: buildCardPrompt(concept, relevantExcerpts),
   * });
   *
   * buildSystemPrompt should include:
   *   - Professor's detected style and signature terms
   *   - Quiz pattern (format, depth, clinical bias)
   *   - Output format: 8-field JSON matching StudyCard interface
   *   - Instructions to preserve neuroscience accuracy
   *   - Instructions to weight toward testable content
   * ===================================
   */

  const cards = [];

  for (const concept of concepts) {
    const conceptKey = concept.name.toLowerCase();
    const cardId = CONCEPT_TO_CARD[conceptKey];
    const mockCard = MOCK_CARDS.find(c => c.id === cardId);

    if (mockCard) {
      // Use mock card but update metadata from concept analysis
      cards.push({
        ...mockCard,
        quizLikelihood: Math.max(mockCard.quizLikelihood, concept.quizLikelihood),
        sourceReferences: concept.sourceIds,
      });
    }
  }

  // If no concepts matched (e.g. user uploaded content), return all mock cards
  if (cards.length === 0) {
    return MOCK_CARDS;
  }

  // Sort by quiz likelihood descending
  return cards.sort((a, b) => b.quizLikelihood - a.quizLikelihood);
}
