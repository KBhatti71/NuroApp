/**
 * lectureAnalyzer — School Mode AI service.
 *
 * Analyses a lecture/study-group/office-hours transcript and extracts:
 *  - Logical sections with key points
 *  - Key concepts with importance scores
 *  - Cross-references between concepts
 *  - Auto-generated flashcards
 *  - Practice questions
 *  - Follow-up research questions
 *  - Confusion moments (needs clarification)
 *  - Study suggestions
 *  - Important moments with 0-100 scores
 *
 * After the primary analysis a second enrichment call adds background
 * context and authoritative source suggestions for the top concepts.
 *
 * Falls back to text-based heuristic analysis when AI is disabled.
 */

import { isAIEnabled, generateJSON, enrichConcepts } from './claudeClient';
import { buildLectureSystemPrompt, buildLectureUserPrompt } from './prompts';
import { SCHOOL_KEYWORDS, getImportanceTier } from '../../constants/modes';
import { lectureAnalysisSchema } from '../../lib/ai/validation';

// ─── Mock fallback ────────────────────────────────────────────────────────────

function buildMockAnalysis(rawText, title) {
  const lines = rawText.split('\n').filter(l => l.trim().length > 20);

  // Score lines with simple keyword heuristics
  const importantMoments = lines
    .map(line => {
      let score = 0;
      const lower = line.toLowerCase();
      SCHOOL_KEYWORDS.forEach(kw => { if (lower.includes(kw)) score += 15; });
      if (line === line.toUpperCase() && line.length > 10) score += 20; // ALL CAPS
      if ((line.match(/!/g) || []).length >= 2) score += 10;
      return { text: line.slice(0, 120), score: Math.min(score, 100) };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(m => ({ ...m, tier: getImportanceTier(m.score).label.toLowerCase(), reason: 'keyword' }));

  return {
    summary: `Analysis of "${title || 'lecture'}". ${lines.length} content lines processed. Enable real AI (VITE_USE_REAL_AI=true) for full intelligence extraction.`,
    sections: [],
    keyTakeaways: importantMoments.slice(0, 3).map(m => m.text),
    concepts: importantMoments.slice(0, 5).map((m, i) => ({
      name: `Concept ${i + 1}`,
      explanation: m.text,
      importance: m.score,
      importanceReason: 'keyword match',
    })),
    crossReferences: [],
    importantMoments,
    flashcards: importantMoments.slice(0, 4).map((m, i) => ({
      front: `What is key point ${i + 1} from this lecture?`,
      back: m.text,
      importance: m.score,
    })),
    questions: importantMoments.slice(0, 3).map((m, _i) => ({
      text: `Explain the significance of: "${m.text.slice(0, 60)}..."`,
      answer: 'Review the lecture notes for a complete answer.',
      importance: m.score,
    })),
    followUpQuestions: [],
    confusionMoments: [],
    studySuggestions: [
      'Review the high-importance segments flagged above.',
      'Generate flashcards from the identified key concepts.',
      'Enable real AI mode for richer flashcards and practice questions.',
    ],
    enrichment: [],
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * @param {string} rawText    - Pasted transcript or notes
 * @param {string} title      - Session title (displayed in prompts)
 * @param {string} sessionType - SESSION_TYPE constant
 * @returns {Promise<object>} Structured lecture analysis
 */
export async function analyzeLecture(rawText, title, sessionType = 'lecture') {
  if (!rawText?.trim()) {
    return buildMockAnalysis('', title);
  }

  if (isAIEnabled()) {
    try {
      const system = buildLectureSystemPrompt(sessionType);
      const user   = buildLectureUserPrompt(rawText, title);
      // Increased to 8192 — the enriched schema (sections, crossReferences,
      // followUpQuestions) requires more tokens than the base schema.
      const analysis = await generateJSON(system, user, 8192, lectureAnalysisSchema);

      // Second pass: enrich top concepts with background context + sources.
      // Runs in parallel-ish — we don't block the primary analysis result.
      const topConceptNames = (analysis.concepts ?? [])
        .slice(0, 5)
        .map(c => c.name)
        .filter(Boolean);
      analysis.enrichment = await enrichConcepts(topConceptNames);

      return analysis;
    } catch (err) {
      console.warn('[lectureAnalyzer] LLM failed, using heuristic fallback:', err.message);
    }
  }

  return buildMockAnalysis(rawText, title);
}
