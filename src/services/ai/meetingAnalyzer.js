/**
 * meetingAnalyzer — Work Mode AI service.
 *
 * Analyses a meeting/1:1/standup transcript and extracts:
 *  - Logical sections (agenda items / topic shifts)
 *  - Decisions (with support/concerns/status)
 *  - Action items (owner, deadline, urgency, committed flag)
 *  - Stakeholder sentiment per person
 *  - Critical moments with 0-100 scores
 *  - Follow-up items that were dropped or need scheduling
 *  - Follow-up research questions for open issues
 *  - Cross-references between discussed topics
 *
 * After the primary analysis a second enrichment call adds background
 * context and source suggestions for the top topics/concepts.
 *
 * Falls back to text-based heuristic analysis when AI is disabled.
 */

import { isAIEnabled, generateJSON, enrichConcepts } from './claudeClient';
import { buildMeetingSystemPrompt, buildMeetingUserPrompt } from './prompts';
import { WORK_KEYWORDS, getImportanceTier, DEFAULT_ANALYSIS_SETTINGS } from '../../constants/modes';
import { meetingAnalysisSchema } from '../../lib/ai/validation';
import { chunkContent, analyzeChunksHierarchically } from '../../lib/ai/contentChunking';

const EMPHASIS_PHRASES = [
  'decision',
  'action item',
  'deadline',
  'blocker',
  'urgent',
  'must',
  'need to',
  'by end of',
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
  WORK_KEYWORDS.forEach(kw => {
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

  WORK_KEYWORDS.forEach(kw => {
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
    weights.set(c.index, 1 + ratio);
  });
  return weights;
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

const ACTION_PATTERNS = [
  /\b(i will|i'll|i'm going to|we will|we'll|will have|by [a-z]+day)\b/i,
  /\b(action item|todo|follow.?up|next step|deliverable)\b/i,
];

const DECISION_PATTERNS = [
  /\b(decided|decision|agreed|we're going to|going with|let's|we should)\b/i,
  /\b(approved|confirmed|finalized|resolved|consensus)\b/i,
];

function buildMockAnalysis(rawText, title) {
  const lines = rawText.split('\n').filter(l => l.trim().length > 15);
  const settings = DEFAULT_ANALYSIS_SETTINGS;
  const highlights = extractEmphasisHighlights(rawText, settings, 5);

  const importantMoments = lines
    .map(line => {
      let score = 0;
      const lower = line.toLowerCase();
      WORK_KEYWORDS.forEach(kw => { if (lower.includes(kw)) score += 15; });
      if (line === line.toUpperCase() && line.length > 10) score += 20;
      if ((line.match(/!/g) || []).length >= 2) score += 10;
      ACTION_PATTERNS.forEach(p => { if (p.test(line)) score += 10; });
      DECISION_PATTERNS.forEach(p => { if (p.test(line)) score += 12; });
      return { text: line.slice(0, 140), score: Math.min(score, 100) };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(m => ({ ...m, tier: getImportanceTier(m.score).label.toLowerCase(), reason: 'keyword' }));

  const actionCandidates = lines.filter(l => ACTION_PATTERNS.some(p => p.test(l)));
  const decisionCandidates = lines.filter(l => DECISION_PATTERNS.some(p => p.test(l)));

  return {
    summary: `Analysis of "${title || 'meeting'}". ${lines.length} content lines processed. Enable real AI (VITE_USE_REAL_AI=true) for full intelligence extraction.`,
    sections: [],
    decisions: decisionCandidates.slice(0, 3).map((text, i) => ({
      text: text.slice(0, 120),
      support: [],
      concerns: [],
      status: 'pending',
      importance: 60 + i * 5,
    })),
    actionItems: actionCandidates.slice(0, 4).map((text, i) => ({
      owner: 'Unknown',
      task: text.slice(0, 100),
      deadline: null,
      urgency: i === 0 ? 'urgent' : 'normal',
      committed: ACTION_PATTERNS[0].test(text),
      importance: 70 - i * 5,
    })),
    stakeholders: [],
    criticalMoments: importantMoments.filter(m => m.score >= 50),
    followUps: importantMoments.slice(0, 2).map(m => ({
      topic: m.text.slice(0, 80),
      person: null,
      priority: m.score >= 75 ? 'urgent' : 'normal',
      context: 'Flagged by keyword analysis',
    })),
    followUpQuestions: [],
    crossReferences: [],
    importantMoments,
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
 * Analyzes a single chunk of meeting content
 * @param {string} chunkText - The chunk content to analyze
 * @param {string} title - Session title
 * @param {string} sessionType - Session type
 * @returns {Promise<object>} Analysis of the chunk
 */
async function analyzeMeetingChunk(chunk, title, sessionType, options = {}, highlights = [], settings = DEFAULT_ANALYSIS_SETTINGS) {
  const chunkText = typeof chunk === 'string' ? chunk : chunk.text;
  const chunkIndex = typeof chunk === 'object' ? chunk.index : null;

  if (options.quick) {
    return quickScanChunk(chunkText, settings);
  }

  const system = buildMeetingSystemPrompt(sessionType, { conciseMode: settings.conciseMode });
  const user = buildMeetingUserPrompt(chunkText, title, highlights);
  const maxTokens = options.deep ? 8192 : options.medium ? 4096 : 8192;
  const analysis = await generateJSON(system, user, maxTokens, meetingAnalysisSchema);
  if (chunkIndex != null) analysis._chunkIndex = chunkIndex;
  return analysis;
}

/**
 * Merges multiple chunk analyses into a single comprehensive analysis
 * @param {Array<object>} chunkAnalyses - Array of chunk analysis results
 * @param {string} title - Session title
 * @returns {object} Merged analysis
 */
function mergeMeetingAnalyses(chunkAnalyses, title) {
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

  // Combine decisions (merge by text similarity)
  const decisionMap = new Map();
  chunkAnalyses.forEach(analysis => {
    (analysis.decisions || []).forEach(decision => {
      const key = decision.text?.slice(0, 50);
      if (!decisionMap.has(key)) {
        decisionMap.set(key, decision);
      }
    });
  });

  // Combine action items (avoid duplicates by text)
  const actionMap = new Map();
  chunkAnalyses.forEach(analysis => {
    (analysis.actionItems || []).forEach(action => {
      const key = `${action.task}|${action.owner || ''}`;
      if (!actionMap.has(key)) {
        actionMap.set(key, action);
      }
    });
  });

  // Combine stakeholders (merge by name, combine sentiments)
  const stakeholderMap = new Map();
  chunkAnalyses.forEach(analysis => {
    (analysis.stakeholders || []).forEach(stakeholder => {
      if (!stakeholderMap.has(stakeholder.name)) {
        stakeholderMap.set(stakeholder.name, stakeholder);
      } else {
        const existing = stakeholderMap.get(stakeholder.name);
        // Take the most recent sentiment or combine
        existing.sentiment = existing.sentiment || stakeholder.sentiment;
        existing.contributions = Math.max(existing.contributions || 0, stakeholder.contributions || 0);
      }
    });
  });

  // Combine other arrays
  const allFollowUps = chunkAnalyses.flatMap(a => a.followUps || []);
  const allFollowUpQuestions = chunkAnalyses.flatMap(a => a.followUpQuestions || []);
  const allCrossRefs = chunkAnalyses.flatMap(a => a.crossReferences || []);

  return {
    summary: `Combined analysis of "${title}" from ${chunkAnalyses.length} content sections`,
    sections: Array.from(sectionMap.values()),
    decisions: Array.from(decisionMap.values()).slice(0, 7),
    actionItems: Array.from(actionMap.values()).slice(0, 10),
    stakeholders: Array.from(stakeholderMap.values()).slice(0, 8),
    followUps: [...new Set(allFollowUps.map(f => JSON.stringify(f)))].map(s => JSON.parse(s)).slice(0, 5),
    followUpQuestions: [...new Set(allFollowUpQuestions)].slice(0, 5),
    crossReferences: [...new Set(allCrossRefs.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)).slice(0, 8),
    importantMoments: chunkAnalyses.flatMap(a => a.importantMoments || []).slice(0, 10),
    enrichment: [] // Will be populated by enrichConcepts call
  };
}

function mergeMeetingAnalysesWeighted(chunkAnalyses, title, chunkSummaries = []) {
  if (chunkAnalyses.length === 1) return chunkAnalyses[0];

  const weightMap = buildWeightMap(chunkSummaries);
  const getWeight = analysis => weightMap.get(analysis._chunkIndex) ?? 1;

  let bestSummary = null;
  let bestSummaryWeight = 0;

  const sectionMap = new Map();
  const decisionMap = new Map();
  const actionMap = new Map();
  const stakeholderMap = new Map();

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

    (analysis.decisions || []).forEach(decision => {
      const key = decision.text?.slice(0, 60);
      const score = (decision.importance ?? 0) * weight;
      if (!decisionMap.has(key) || decisionMap.get(key).score < score) {
        decisionMap.set(key, { decision, score });
      }
    });

    (analysis.actionItems || []).forEach(action => {
      const key = `${action.task}|${action.owner || ''}`;
      const score = (action.importance ?? 0) * weight;
      if (!actionMap.has(key) || actionMap.get(key).score < score) {
        actionMap.set(key, { action, score });
      }
    });

    (analysis.stakeholders || []).forEach(stakeholder => {
      const key = stakeholder.name;
      if (!stakeholderMap.has(key) || stakeholderMap.get(key).weight < weight) {
        stakeholderMap.set(key, { stakeholder, weight });
      }
    });
  });

  const allFollowUps = chunkAnalyses.flatMap(a => a.followUps || []);
  const allFollowUpQuestions = chunkAnalyses.flatMap(a => a.followUpQuestions || []);
  const allCrossRefs = chunkAnalyses.flatMap(a => a.crossReferences || []);

  const importantMoments = chunkAnalyses
    .flatMap(a => (a.importantMoments || []).map(m => ({
      moment: m,
      score: (m.score ?? 0) * (getWeight(a)),
    })))
    .sort((a, b) => b.score - a.score)
    .map(m => m.moment)
    .slice(0, 10);

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
    decisions: Array.from(decisionMap.values())
      .sort((a, b) => b.score - a.score)
      .map(d => d.decision)
      .slice(0, 7),
    actionItems: Array.from(actionMap.values())
      .sort((a, b) => b.score - a.score)
      .map(a => a.action)
      .slice(0, 10),
    stakeholders: Array.from(stakeholderMap.values())
      .map(s => s.stakeholder)
      .slice(0, 8),
    followUps: [...new Set(allFollowUps.map(f => JSON.stringify(f)))].map(s => JSON.parse(s)).slice(0, 5),
    followUpQuestions: [...new Set(allFollowUpQuestions)].slice(0, 5),
    crossReferences: [...new Set(allCrossRefs.map(c => JSON.stringify(c)))].map(s => JSON.parse(s)).slice(0, 8),
    importantMoments,
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
 * @param {string} title      - Session title
 * @param {string} sessionType - SESSION_TYPE constant
 * @returns {Promise<object>} Structured meeting analysis
 */
export async function analyzeMeeting(rawText, title, sessionType = 'meeting', analysisSettings = {}) {
  if (!rawText?.trim()) {
    return buildMockAnalysis('', title);
  }

  if (isAIEnabled()) {
    try {
      const settings = { ...DEFAULT_ANALYSIS_SETTINGS, ...(analysisSettings || {}) };
      const highlights = extractEmphasisHighlights(rawText, settings, 8);
      // For long content, use chunked analysis
      if (rawText.length > 12000) {
        console.log(`🔄 Analyzing long meeting (${rawText.length.toLocaleString()} chars) using chunked approach`);

        const chunks = chunkContent(rawText);
        console.log(`📊 Split into ${chunks.length} chunks for analysis`);

        const hierarchy = await analyzeChunksHierarchically(
          chunks,
          (chunk, options) => analyzeMeetingChunk(chunk, title, sessionType, options, highlights, settings)
        );

        const chunkAnalyses = hierarchy.analyses ?? [];
        const mergedAnalysis = mergeMeetingAnalysesWeighted(chunkAnalyses, title, hierarchy.chunkSummaries);

        // Second pass: enrich key topics with background context + sources
        const topTopics = [
          ...(mergedAnalysis.sections ?? []).slice(0, 3).map(s => s.title),
          ...(mergedAnalysis.decisions ?? []).slice(0, 2).map(d => d.text?.slice(0, 60)),
        ].filter(Boolean).slice(0, 5);
        mergedAnalysis.enrichment = await enrichConcepts(topTopics);

        return mergedAnalysis;
      } else {
        // Original single-call approach for shorter content
        const system = buildMeetingSystemPrompt(sessionType, { conciseMode: settings.conciseMode });
        const user = buildMeetingUserPrompt(rawText, title, highlights);
        const analysis = await generateJSON(system, user, 8192, meetingAnalysisSchema);

        // Second pass: enrich key topics with background context + sources.
        const topTopics = [
          ...(analysis.sections ?? []).slice(0, 3).map(s => s.title),
          ...(analysis.decisions ?? []).slice(0, 2).map(d => d.text?.slice(0, 60)),
        ].filter(Boolean).slice(0, 5);
        analysis.enrichment = await enrichConcepts(topTopics);

        return analysis;
      }
    } catch (err) {
      console.warn('[meetingAnalyzer] LLM failed, using heuristic fallback:', err.message);
    }
  }

  return buildMockAnalysis(rawText, title);
}
