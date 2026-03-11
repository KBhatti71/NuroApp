/**
 * meetingAnalyzer — Work Mode AI service.
 *
 * Analyses a meeting/1:1/standup transcript and extracts:
 *  - Decisions (with support/concerns/status)
 *  - Action items (owner, deadline, urgency, committed flag)
 *  - Stakeholder sentiment per person
 *  - Critical moments with 0-100 scores
 *  - Follow-up items that were dropped or need scheduling
 *
 * Falls back to text-based heuristic analysis when AI is disabled.
 */

import { isAIEnabled, generateJSON } from './claudeClient';
import { buildMeetingSystemPrompt, buildMeetingUserPrompt } from './prompts';
import { WORK_KEYWORDS, getImportanceTier } from '../../constants/modes';

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
    importantMoments,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * @param {string} rawText    - Pasted transcript or notes
 * @param {string} title      - Session title
 * @param {string} sessionType - SESSION_TYPE constant
 * @returns {Promise<object>} Structured meeting analysis
 */
export async function analyzeMeeting(rawText, title, sessionType = 'meeting') {
  if (!rawText?.trim()) {
    return buildMockAnalysis('', title);
  }

  if (isAIEnabled()) {
    try {
      const system = buildMeetingSystemPrompt(sessionType);
      const user   = buildMeetingUserPrompt(rawText, title);
      // Use 4096 tokens — the meeting schema (decisions, action items, stakeholders,
      // criticalMoments, followUps, importantMoments) exceeds the 1024-token default
      // and causes truncated/invalid JSON responses.
      return await generateJSON(system, user, 4096);
    } catch (err) {
      console.warn('[meetingAnalyzer] LLM failed, using heuristic fallback:', err.message);
    }
  }

  return buildMockAnalysis(rawText, title);
}
