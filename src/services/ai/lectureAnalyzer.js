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
import { SCHOOL_KEYWORDS, getImportanceTier, DEFAULT_ANALYSIS_SETTINGS } from '../../constants/modes';
import { lectureAnalysisSchema } from '../../lib/ai/validation';
import { chunkContent, analyzeChunksHierarchically } from '../../lib/ai/contentChunking';

const EMPHASIS_PHRASES = [
  'this will be on the exam',
  'key point',
  'remember',
  'important',
  'critical',
  'write this down',
  'do not forget',
  'pay attention',
];

function scoreLineForEmphasis(line, settings) {
  const trimmed = line.trim();
  if (!trimmed) return 0;
  const lower = trimmed.toLowerCase();
  const emphasisWeight = settings.emphasisWeight ?? 1;
  let score = 0;

  const caps = trimmed.replace(/[^A-Z]/g, '').length;
  const letters = trimmed.replace(/[^A-Za-z]/g, '').length || 1;
  if (caps / letters > 0.6 && letters > 6) score += 3 * emphasisWeight;
  score += (trimmed.match(/!/g) || []).length * emphasisWeight;
  if (/(\.{3,}|\(pause\)|--|—)/.test(trimmed)) score += 1 * emphasisWeight;
  if (/\b(\w+)\b.*\b\1\b/i.test(trimmed)) score += 1 * emphasisWeight;
  EMPHASIS_PHRASES.forEach(phrase => {
    if (lower.includes(phrase)) score += 3 * emphasisWeight;
  });
  SCHOOL_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) score += 1 * emphasisWeight;
  });

  return score;
}

function extractEmphasisHighlights(rawText, settings, maxItems = 8) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 12);
  const scored = lines
    .map(line => ({ line, score: scoreLineForEmphasis(line, settings) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set();
  const highlights = [];
  for (const item of scored) {
    const compact = item.line.replace(/\s+/g, ' ').slice(0, 200);
    const key = compact.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    highlights.push(compact);
    if (highlights.length >= maxItems) break;
  }
  return highlights;
}

function quickScanChunk(text, settings) {
  const lower = text.toLowerCase();
  let importance = 0;
  let hasEmphasis = false;
  const keyTopics = new Set();
  const emphasisWeight = settings.emphasisWeight ?? 1;
  const chunkWeight = settings.chunkImportanceWeight ?? 1;

  SCHOOL_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) {
      importance += 2;
      keyTopics.add(kw);
      hasEmphasis = true;
    }
  });

  if (/\b[A-Z]{4,}\b/.test(text)) {
    importance += 2 * emphasisWeight;
    hasEmphasis = true;
  }
  importance += (text.match(/!/g) || []).length * emphasisWeight;

  return {
    importance: importance * chunkWeight,
    keyTopics: Array.from(keyTopics).slice(0, 6),
    hasEmphasis,
  };
}

function buildWeightMap(chunkSummaries = []) {
  const max = Math.max(...chunkSummaries.map(c => c.importance || 0), 1);
  const weights = new Map();
  chunkSummaries.forEach(c => {
    const ratio = Math.min((c.importance || 0) / max, 1);
    weights.set(c.index, 1 + ratio); // 1.0 - 2.0
  });
  return weights;
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

function buildMockAnalysis(rawText, title) {
  const lines = rawText.split('\n').filter(l => l.trim().length > 20);
  const settings = DEFAULT_ANALYSIS_SETTINGS;
  const highlights = extractEmphasisHighlights(rawText, settings, 5);

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
    speakerStyle: {
      tone: 'neutral',
      pace: 'moderate',
      structure: 'outline',
      emphasisSignals: highlights,
      dominantSignals: highlights.slice(0, 3),
      confidence: 0.4,
    },
    enrichment: [],
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Analyzes a single chunk of lecture content
 * @param {string} chunkText - The chunk content to analyze
 * @param {string} title - Session title
 * @param {string} sessionType - Session type
 * @returns {Promise<object>} Analysis of the chunk
 */
async function analyzeLectureChunk(chunk, title, sessionType, options = {}, highlights = [], settings = DEFAULT_ANALYSIS_SETTINGS) {
  const chunkText = typeof chunk === 'string' ? chunk : chunk.text;
  const chunkIndex = typeof chunk === 'object' ? chunk.index : null;

  if (options.quick) {
    return quickScanChunk(chunkText, settings);
  }

  const system = buildLectureSystemPrompt(sessionType, { conciseMode: settings.conciseMode });
  const user = buildLectureUserPrompt(chunkText, title, highlights);
  const maxTokens = options.deep ? 8192 : options.medium ? 4096 : 8192;
  const analysis = await generateJSON(system, user, maxTokens, lectureAnalysisSchema);
  if (chunkIndex != null) analysis._chunkIndex = chunkIndex;
  return analysis;
}

/**
 * Merges multiple chunk analyses into a single comprehensive analysis
 * @param {Array<object>} chunkAnalyses - Array of chunk analysis results
 * @param {string} title - Session title
 * @returns {object} Merged analysis
 */
function mergeLectureAnalyses(chunkAnalyses, title) {
  if (chunkAnalyses.length === 1) return chunkAnalyses[0];

  // Combine sections (avoid duplicates by title)
  const sectionMap = new Map();
  chunkAnalyses.forEach(analysis => {
    (analysis.sections || []).forEach(section => {
      if (!sectionMap.has(section.title)) {
        sectionMap.set(section.title, section);
      } else {
        // Merge key points if section exists
        const existing = sectionMap.get(section.title);
        existing.keyPoints = [...new Set([...(existing.keyPoints || []), ...(section.keyPoints || [])])];
      }
    });
  });

  // Combine concepts (merge by name, take highest importance)
  const conceptMap = new Map();
  chunkAnalyses.forEach(analysis => {
    (analysis.concepts || []).forEach(concept => {
      if (!conceptMap.has(concept.name)) {
        conceptMap.set(concept.name, concept);
      } else {
        const existing = conceptMap.get(concept.name);
        existing.importance = Math.max(existing.importance, concept.importance);
        existing.explanation = existing.explanation || concept.explanation;
        existing.crossReferences = [...new Set([...(existing.crossReferences || []), ...(concept.crossReferences || [])])];
      }
    });
  });

  // Combine flashcards (take top 15, avoid duplicates)
  const flashcardMap = new Map();
  chunkAnalyses.forEach(analysis => {
    (analysis.flashcards || []).forEach(card => {
      const key = `${card.front}|${card.back}`;
      if (!flashcardMap.has(key)) {
        flashcardMap.set(key, card);
      }
    });
  });

  // Combine questions and other arrays
  const allQuestions = chunkAnalyses.flatMap(a => a.questions || []);
  const allFollowUp = chunkAnalyses.flatMap(a => a.followUpQuestions || []);
  const allConfusion = chunkAnalyses.flatMap(a => a.confusionMoments || []);
  const allSuggestions = chunkAnalyses.flatMap(a => a.studySuggestions || []);

  return {
    summary: `Combined analysis of "${title}" from ${chunkAnalyses.length} content sections`,
    sections: Array.from(sectionMap.values()),
    concepts: Array.from(conceptMap.values()).sort((a, b) => b.importance - a.importance),
    flashcards: Array.from(flashcardMap.values()).slice(0, 15),
    questions: [...new Set(allQuestions.map(q => JSON.stringify(q)))].map(s => JSON.parse(s)).slice(0, 8),
    followUpQuestions: [...new Set(allFollowUp)].slice(0, 5),
    confusionMoments: [...new Set(allConfusion.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)).slice(0, 5),
    studySuggestions: [...new Set(allSuggestions)].slice(0, 5),
    importantMoments: chunkAnalyses.flatMap(a => a.importantMoments || []).slice(0, 10),
    enrichment: [] // Will be populated by enrichConcepts call
  };
}

function mergeLectureAnalysesWeighted(chunkAnalyses, title, chunkSummaries = []) {
  if (chunkAnalyses.length === 1) return chunkAnalyses[0];

  const weightMap = buildWeightMap(chunkSummaries);
  const getWeight = analysis => weightMap.get(analysis._chunkIndex) ?? 1;

  let bestSummary = null;
  let bestSummaryWeight = 0;

  const sectionMap = new Map();
  chunkAnalyses.forEach(analysis => {
    const weight = getWeight(analysis);
    if (analysis.summary && weight > bestSummaryWeight) {
      bestSummary = analysis.summary;
      bestSummaryWeight = weight;
    }
    (analysis.sections || []).forEach(section => {
      if (!sectionMap.has(section.title)) {
        sectionMap.set(section.title, { section: { ...section }, weight });
      } else {
        const existing = sectionMap.get(section.title);
        existing.section.keyPoints = [...new Set([...(existing.section.keyPoints || []), ...(section.keyPoints || [])])];
        if (section.summary && weight > existing.weight) {
          existing.section.summary = section.summary;
          existing.weight = weight;
        }
      }
    });
  });

  const conceptMap = new Map();
  chunkAnalyses.forEach(analysis => {
    const weight = getWeight(analysis);
    (analysis.concepts || []).forEach(concept => {
      const score = (concept.importance ?? 0) * weight;
      if (!conceptMap.has(concept.name)) {
        conceptMap.set(concept.name, { concept, score });
      } else {
        const existing = conceptMap.get(concept.name);
        if (score > existing.score) {
          existing.concept = concept;
          existing.score = score;
        } else {
          existing.concept.crossReferences = [...new Set([...(existing.concept.crossReferences || []), ...(concept.crossReferences || [])])];
        }
      }
    });
  });

  const flashcardMap = new Map();
  chunkAnalyses.forEach(analysis => {
    const weight = getWeight(analysis);
    (analysis.flashcards || []).forEach(card => {
      const key = `${card.front}|${card.back}`;
      const score = (card.importance ?? 0) * weight;
      if (!flashcardMap.has(key) || flashcardMap.get(key).score < score) {
        flashcardMap.set(key, { card, score });
      }
    });
  });

  const questionMap = new Map();
  chunkAnalyses.forEach(analysis => {
    const weight = getWeight(analysis);
    (analysis.questions || []).forEach(q => {
      const key = q.text || JSON.stringify(q);
      const score = (q.importance ?? 0) * weight;
      if (!questionMap.has(key) || questionMap.get(key).score < score) {
        questionMap.set(key, { q, score });
      }
    });
  });

  const importantMoments = chunkAnalyses
    .flatMap(a => (a.importantMoments || []).map(m => ({
      moment: m,
      score: (m.score ?? 0) * (getWeight(a)),
    })))
    .sort((a, b) => b.score - a.score)
    .map(m => m.moment)
    .slice(0, 10);

  const keyTakeaways = chunkAnalyses
    .flatMap(a => (a.keyTakeaways || []).map(t => ({
      text: t,
      score: getWeight(a),
    })))
    .reduce((acc, item) => {
      const key = item.text;
      if (!acc.map.has(key) || acc.map.get(key) < item.score) {
        acc.map.set(key, item.score);
      }
      return acc;
    }, { map: new Map() });

  const keyTakeawayList = Array.from(keyTakeaways.map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([text]) => text)
    .slice(0, 5);

  const allFollowUp = chunkAnalyses.flatMap(a => a.followUpQuestions || []);
  const allConfusion = chunkAnalyses.flatMap(a => a.confusionMoments || []);
  const allSuggestions = chunkAnalyses.flatMap(a => a.studySuggestions || []);
  const allCrossRefs = chunkAnalyses.flatMap(a => a.crossReferences || []);

  const speakerStyles = chunkAnalyses
    .map(a => ({ style: a.speakerStyle, weight: getWeight(a) }))
    .filter(s => s.style);

  const topSpeaker = speakerStyles.sort((a, b) => b.weight - a.weight)[0]?.style;
  const emphasisSignals = [
    ...new Set(speakerStyles.flatMap(s => s.style?.emphasisSignals || []))
  ];
  const dominantSignals = [
    ...new Set(speakerStyles.flatMap(s => s.style?.dominantSignals || []))
  ];

  return {
    summary: bestSummary || `Combined analysis of "${title}" from ${chunkAnalyses.length} content sections`,
    sections: Array.from(sectionMap.values()).map(s => s.section),
    concepts: Array.from(conceptMap.values())
      .sort((a, b) => b.score - a.score)
      .map(c => c.concept),
    flashcards: Array.from(flashcardMap.values())
      .sort((a, b) => b.score - a.score)
      .map(c => c.card)
      .slice(0, 15),
    questions: Array.from(questionMap.values())
      .sort((a, b) => b.score - a.score)
      .map(q => q.q)
      .slice(0, 8),
    followUpQuestions: [...new Set(allFollowUp.map(q => JSON.stringify(q)))].map(s => JSON.parse(s)).slice(0, 5),
    confusionMoments: [...new Set(allConfusion.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)).slice(0, 5),
    studySuggestions: [...new Set(allSuggestions)].slice(0, 5),
    crossReferences: [...new Set(allCrossRefs.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)).slice(0, 8),
    importantMoments,
    keyTakeaways: keyTakeawayList,
    speakerStyle: topSpeaker ? {
      ...topSpeaker,
      emphasisSignals,
      dominantSignals,
      confidence: topSpeaker.confidence ?? undefined
    } : undefined,
    enrichment: []
  };
}

/**
 * @param {string} rawText    - Pasted transcript or notes
 * @param {string} title      - Session title (displayed in prompts)
 * @param {string} sessionType - SESSION_TYPE constant
 * @returns {Promise<object>} Structured lecture analysis
 */
export async function analyzeLecture(rawText, title, sessionType = 'lecture', analysisSettings = {}) {
  if (!rawText?.trim()) {
    return buildMockAnalysis('', title);
  }

  if (isAIEnabled()) {
    try {
      const settings = { ...DEFAULT_ANALYSIS_SETTINGS, ...(analysisSettings || {}) };
      const highlights = extractEmphasisHighlights(rawText, settings, 8);
      // For long content, use chunked analysis
      if (rawText.length > 12000) {
        console.log(`🔄 Analyzing long lecture (${rawText.length.toLocaleString()} chars) using chunked approach`);

        const chunks = chunkContent(rawText);
        console.log(`📊 Split into ${chunks.length} chunks for analysis`);

        const hierarchy = await analyzeChunksHierarchically(
          chunks,
          (chunk, options) => analyzeLectureChunk(chunk, title, sessionType, options, highlights, settings)
        );

        const chunkAnalyses = hierarchy.analyses ?? [];
        const mergedAnalysis = mergeLectureAnalysesWeighted(chunkAnalyses, title, hierarchy.chunkSummaries);

        // Second pass: enrich top concepts with background context + sources
        const topConceptNames = (mergedAnalysis.concepts ?? [])
          .slice(0, 5)
          .map(c => c.name)
          .filter(Boolean);
        mergedAnalysis.enrichment = await enrichConcepts(topConceptNames);

        return mergedAnalysis;
      } else {
        // Original single-call approach for shorter content
        const system = buildLectureSystemPrompt(sessionType, { conciseMode: settings.conciseMode });
        const user = buildLectureUserPrompt(rawText, title, highlights);
        const analysis = await generateJSON(system, user, 8192, lectureAnalysisSchema);

        // Second pass: enrich top concepts with background context + sources.
        const topConceptNames = (analysis.concepts ?? [])
          .slice(0, 5)
          .map(c => c.name)
          .filter(Boolean);
        analysis.enrichment = await enrichConcepts(topConceptNames);

        return analysis;
      }
    } catch (err) {
      console.warn('[lectureAnalyzer] LLM failed, using heuristic fallback:', err.message);
    }
  }

  return buildMockAnalysis(rawText, title);
}
