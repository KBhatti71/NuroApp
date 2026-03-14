/**
 * cardGenerator — converts high-yield concepts into study cards.
 *
 * Strategy (in priority order):
 *  1. If VITE_USE_REAL_AI=true and a valid API key exists → call Claude.
 *  2. If any concept matches the mock-card lookup → use the mock card so
 *     demos work offline without an API key.
 *  3. Fallback: return the full mock-card set so the UI always has data.
 *
 * This keeps the demo experience intact while making real AI a single
 * env-var flip away.
 */

import { v4 as uuid } from 'uuid';
import { MOCK_CARDS } from '../../data/mockCards';
import { isAIEnabled, generateJSON } from '../ai/claudeClient';
import { buildCardSystemPrompt, buildCardUserPrompt } from '../ai/prompts';
import { cardOutputSchema } from '../../lib/ai/validation';

// ─── Mock-mode lookup ─────────────────────────────────────────────────────────

const CONCEPT_TO_CARD = {
  'action potential ionic basis':                   'card_001',
  'synaptic transmission & snare':                  'card_002',
  'synaptic vesicle cycle & snare':                 'card_002',
  'glutamate & gaba balance':                       'card_003',
  'glutamate & gaba: excitation/inhibition balance': 'card_003',
  'acetylcholine & nmj':                            'card_004',
  'dopamine pathways':                              'card_005',
  'somatosensory pathways':                         'card_006',
  'motor cortex & corticospinal tract':             'card_007',
  'ltp & neuroplasticity':                          'card_008',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Pull up to `maxChars` of text from sources that reference this concept.
 * Used to give Claude real context instead of relying on its training data alone.
 */
function extractRelevantExcerpts(concept, sources, maxChars = 2000) {
  const excerpts = [];
  let total = 0;

  for (const src of sources) {
    if (!src.content) continue;
    const lower = src.content.toLowerCase();
    const name  = concept.name.toLowerCase();

    // Find a window around the first mention
    const idx = lower.indexOf(name.split(' ')[0]);
    if (idx === -1) continue;

    const start   = Math.max(0, idx - 100);
    const snippet = src.content.slice(start, start + 400).trim();
    excerpts.push(snippet);
    total += snippet.length;
    if (total >= maxChars) break;
  }

  return excerpts;
}

/**
 * Normalise a raw LLM card object to match the StudyCard interface
 * used throughout the app. Fills in any missing fields with safe defaults.
 */
function normaliseCard(raw, concept) {
  return {
    id:                 uuid(),
    unitId:             concept.unitId ?? null,
    topic:              raw.topic              ?? concept.name,
    coreIdea:           raw.coreIdea           ?? '',
    keyTerms:           Array.isArray(raw.keyTerms) ? raw.keyTerms : [],
    mechanism:          raw.mechanism          ?? '',
    clinicalTieIn:      raw.clinicalTieIn      ?? '',
    professorEmphasis:  raw.professorEmphasis  ?? '',
    memoryHook:         raw.memoryHook         ?? '',
    likelyExamQuestion: raw.likelyExamQuestion ?? '',
    likelyExamAnswer:   raw.likelyExamAnswer   ?? '',
    quizLikelihood:     Math.max(
      Number(raw.quizLikelihood) || 0,
      concept.quizLikelihood ?? 0,
    ),
    pinned:          false,
    tags:            [],
    sourceReferences: concept.sourceIds ?? [],
    createdAt:        new Date().toISOString(),
    studyModeVariants: {
      professorWording: raw.coreIdea ?? '',
      examCram:         raw.likelyExamQuestion ?? '',
    },
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateCards(concepts, sources, professorStyle, quizPattern) {
  // ── Path 1: Real AI ──────────────────────────────────────────────────────
  if (isAIEnabled()) {
    const systemPrompt = buildCardSystemPrompt(professorStyle, quizPattern);
    const cards        = [];

    for (const concept of concepts) {
      try {
        const excerpts   = extractRelevantExcerpts(concept, sources);
        const userPrompt = buildCardUserPrompt(concept, excerpts);
        const raw        = await generateJSON(systemPrompt, userPrompt, undefined, cardOutputSchema);
        cards.push(normaliseCard(raw, concept));
      } catch (err) {
        // Don't abort the whole pipeline if one card fails — log and continue.
        console.warn(`[cardGenerator] LLM failed for "${concept.name}":`, err.message);
      }
    }

    if (cards.length > 0) {
      return cards.sort((a, b) => b.quizLikelihood - a.quizLikelihood);
    }

    // If every call failed, fall through to mock mode so the UI isn't empty.
    console.warn('[cardGenerator] All LLM calls failed — falling back to mock cards.');
  }

  // ── Path 2: Mock lookup ──────────────────────────────────────────────────
  const cards = [];

  for (const concept of concepts) {
    const key    = concept.name.toLowerCase();
    const cardId = CONCEPT_TO_CARD[key];
    const mock   = MOCK_CARDS.find(c => c.id === cardId);

    if (mock) {
      cards.push({
        ...mock,
        quizLikelihood:   Math.max(mock.quizLikelihood, concept.quizLikelihood),
        sourceReferences: concept.sourceIds,
      });
    }
  }

  if (cards.length > 0) {
    return cards.sort((a, b) => b.quizLikelihood - a.quizLikelihood);
  }

  // ── Path 3: Full mock fallback ───────────────────────────────────────────
  return MOCK_CARDS;
}
