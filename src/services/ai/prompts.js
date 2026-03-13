/**
 * prompts — all LLM prompt templates for NuroApp.
 *
 * Design principles:
 *  1. One function per concern — system prompt and user prompt are kept
 *     separate so they can be tested and tuned independently.
 *  2. No prompt strings scattered across the codebase.
 *  3. Output schema is embedded in the system prompt as JSON Schema so
 *     the model is always reminded of the required shape.
 *  4. Professor context and quiz pattern are injected dynamically so
 *     cards feel like they came from that specific class.
 */

// ─── Card Generation ──────────────────────────────────────────────────────────

/**
 * Builds the system prompt for study-card generation.
 *
 * @param {object} professorStyle - Output from professorAnalyzer
 * @param {object} quizPattern   - Output from quizAnalyzer
 * @returns {string}
 */
export function buildCardSystemPrompt(professorStyle, quizPattern) {
  const style    = professorStyle?.detectedStyle       ?? 'unknown';
  const emphasis = professorStyle?.emphasisLevel        ?? 'moderate';
  const sigTerms = (professorStyle?.signatureTerms ?? []).join(', ') || 'none detected';
  const format   = quizPattern?.dominantFormat          ?? 'multiple choice';
  const depth    = quizPattern?.conceptDepth            ?? 'application';
  const clinical = quizPattern?.clinicalBias            ? 'HIGH — strongly prefer clinical correlations' : 'MODERATE';

  return `You are an expert neuroscience educator who generates high-yield 3×5 study cards for medical and graduate students.

## Professor Context
- Teaching style: ${style}
- Emphasis level: ${emphasis}
- Signature terms the professor uses: ${sigTerms}

## Exam Context
- Dominant quiz format: ${format}
- Concept depth required: ${depth}
- Clinical bias: ${clinical}

## Your Task
For the concept provided by the user, generate a single study card as a JSON object that exactly matches this schema:

\`\`\`json
{
  "topic": "string — the concept name",
  "coreIdea": "string — 1-2 sentence plain-language explanation",
  "keyTerms": [
    { "term": "string", "definition": "string (≤30 words)" }
  ],
  "mechanism": "string — numbered step-by-step pathway or process",
  "clinicalTieIn": "string — specific disease, drug, or pathology that tests this concept",
  "professorEmphasis": "string — how THIS professor typically frames or emphasises this topic",
  "memoryHook": "string — mnemonic, acronym, or vivid analogy",
  "likelyExamQuestion": "string — the single most probable exam question for this concept",
  "likelyExamAnswer": "string — concise correct answer (≤50 words)",
  "quizLikelihood": "number between 0.0 and 1.0"
}
\`\`\`

## Rules
- Return ONLY the raw JSON object — no markdown fences, no commentary.
- Prioritise testable, high-yield content over encyclopaedic detail.
- The \`professorEmphasis\` field must reflect the professor's detected style above.
- Preserve neuroscience accuracy — never fabricate mechanisms.
- \`quizLikelihood\` should reflect cross-source frequency and exam format alignment.`;
}

/**
 * Builds the user prompt for a single card.
 *
 * @param {object} concept        - High-yield concept from signalDetector
 * @param {string[]} excerpts     - Relevant text snippets from source material
 * @returns {string}
 */
export function buildCardUserPrompt(concept, excerpts = []) {
  const excerptBlock = excerpts.length
    ? `\n\n## Relevant Source Excerpts\n${excerpts.map((e, i) => `${i + 1}. "${e}"`).join('\n')}`
    : '';

  return `Generate a study card for the following concept:

**Concept**: ${concept.name}
**Weighted score**: ${concept.weightedScore?.toFixed(2) ?? 'N/A'} (cross-source frequency)
**Current quiz likelihood**: ${concept.quizLikelihood?.toFixed(2) ?? 'N/A'}${excerptBlock}`;
}

// ─── Course Map Refinement ────────────────────────────────────────────────────

export function buildCourseMapSystemPrompt() {
  return `You are a curriculum analyst. Extract a structured course map from the provided syllabus text.

Return a JSON object matching:
\`\`\`json
{
  "totalWeeks": number,
  "examTopics": ["string"],
  "units": [
    {
      "id": "string",
      "title": "string",
      "week": number,
      "objectives": ["string"]
    }
  ]
}
\`\`\`

Return ONLY raw JSON — no markdown fences, no commentary.`;
}

export function buildCourseMapUserPrompt(syllabusText) {
  return `Extract the course map from this syllabus:\n\n${syllabusText.slice(0, 8000)}`;
}

// ─── School Mode: Lecture Intelligence ───────────────────────────────────────

export function buildLectureSystemPrompt(sessionType) {
  const context = sessionType === 'office_hours'
    ? 'an office-hours session where a student is asking a professor questions'
    : sessionType === 'study_group'
    ? 'a peer study-group session'
    : 'a formal lecture from a professor';

  return `You are an expert academic learning assistant analysing ${context}.

Analyse the provided transcript/notes and return a JSON object with this exact schema:

\`\`\`json
{
  "summary": "string — 2-3 sentence overview of what was covered",
  "sections": [
    {
      "title": "string — logical section heading (e.g. 'Introduction', 'Key Mechanisms')",
      "summary": "string — 1-2 sentence description of what this section covers",
      "keyPoints": ["string — concise bullet-point highlights from this section"],
      "relatedConcepts": ["string — concept names that appear or connect in this section"]
    }
  ],
  "keyTakeaways": ["string — top 5 must-remember points"],
  "concepts": [
    {
      "name": "string",
      "explanation": "string (≤40 words)",
      "importance": "number 0-100",
      "importanceReason": "string — why this scores high"
    }
  ],
  "crossReferences": [
    {
      "from": "string — concept A name",
      "to": "string — concept B name",
      "relationship": "string — how they connect or contrast"
    }
  ],
  "importantMoments": [
    {
      "text": "string — verbatim quote or paraphrase",
      "score": "number 0-100",
      "tier": "critical|high|medium|low",
      "reason": "string — keyword/repetition/emphasis/confusion"
    }
  ],
  "flashcards": [
    { "front": "string — question or term", "back": "string — answer/definition", "importance": "number 0-100" }
  ],
  "questions": [
    { "text": "string — practice question", "answer": "string", "importance": "number 0-100" }
  ],
  "followUpQuestions": [
    {
      "question": "string — open-ended research question to deepen understanding",
      "why": "string — 1 sentence explaining why exploring this builds retention",
      "searchTerms": ["string — 2-3 specific terms to search"]
    }
  ],
  "confusionMoments": [
    { "text": "string — what was confusing", "context": "string — surrounding explanation" }
  ],
  "studySuggestions": ["string — actionable next steps with urgency level"]
}
\`\`\`

Rules:
- Return ONLY raw JSON — no markdown fences, no commentary.
- \`importance\` scores: 75-100 = exam-critical, 50-74 = high-yield, 25-49 = useful, 0-24 = background.
- Detect emphasis from: CAPS, repetition, "this will be on the exam", "remember", explicit slow-down signals.
- Limit: sections up to 6, concepts top 8, flashcards top 10, questions top 5, followUpQuestions top 4, crossReferences top 6.
- Sections should follow the logical flow of the notes — each section maps to a distinct topic or phase of the lecture.`;
}

export function buildLectureUserPrompt(rawText, title) {
  return `Analyse this ${title ? `"${title}" ` : ''}lecture transcript and generate structured study intelligence:

---
${rawText.slice(0, 12000)}
---`;
}

// ─── Work Mode: Meeting Intelligence ─────────────────────────────────────────

export function buildMeetingSystemPrompt(sessionType) {
  const context = {
    one_on_one:   'a 1:1 between a manager and direct report',
    presentation: 'a business presentation',
    standup:      'a team standup/scrum meeting',
    meeting:      'a business meeting',
  }[sessionType] ?? 'a business meeting';

  return `You are an executive intelligence assistant analysing ${context}.

Extract structured intelligence from the transcript and return a JSON object with this exact schema:

\`\`\`json
{
  "summary": "string — 2-3 sentence TL;DR of what happened and what matters",
  "sections": [
    {
      "title": "string — logical topic heading (e.g. 'Project Status', 'Budget Discussion')",
      "summary": "string — 1-2 sentences describing what was discussed",
      "keyPoints": ["string — important points raised in this section"],
      "relatedConcepts": ["string — topics or themes that connect here"]
    }
  ],
  "decisions": [
    {
      "text": "string — what was decided",
      "support": ["string — names/roles who agreed"],
      "concerns": ["string — names/roles with reservations + brief quote"],
      "status": "decided|pending|blocked",
      "importance": "number 0-100"
    }
  ],
  "actionItems": [
    {
      "owner": "string — name or role",
      "task": "string — clear deliverable",
      "deadline": "string or null",
      "urgency": "urgent|normal|low",
      "committed": "boolean — did they explicitly commit?",
      "importance": "number 0-100"
    }
  ],
  "stakeholders": [
    {
      "name": "string",
      "sentiment": "supportive|neutral|concerned|opposed",
      "keyQuote": "string",
      "confidence": "number 0-1"
    }
  ],
  "criticalMoments": [
    {
      "text": "string — verbatim or paraphrase",
      "score": "number 0-100",
      "tier": "critical|high|medium|low",
      "reason": "string — disagreement/commitment/blocker/urgency/repetition"
    }
  ],
  "followUps": [
    {
      "topic": "string",
      "person": "string or null",
      "priority": "urgent|normal|low",
      "context": "string — why this needs follow-up"
    }
  ],
  "followUpQuestions": [
    {
      "question": "string — open question to investigate or clarify before next meeting",
      "why": "string — why this matters for the team or project",
      "searchTerms": ["string — search terms if research is needed"]
    }
  ],
  "crossReferences": [
    {
      "from": "string — topic A",
      "to": "string — topic B",
      "relationship": "string — how these topics connect or depend on each other"
    }
  ],
  "importantMoments": [
    {
      "text": "string",
      "score": "number 0-100",
      "tier": "critical|high|medium|low",
      "reason": "string"
    }
  ]
}
\`\`\`

Rules:
- Return ONLY raw JSON — no markdown fences.
- Detect importance from: raised voice (CAPS/!), keywords (blocker/urgent/deadline/decision), repetition, disagreements.
- \`committed: true\` only if person said "I will", "I'll have it", "by [date]", or equivalent.
- Limit decisions to top 5, action items to top 8, stakeholders to top 6, sections to top 6, followUpQuestions to top 4.
- Sections should map to natural topic shifts or agenda items in the meeting.`;
}

export function buildMeetingUserPrompt(rawText, title) {
  return `Analyse this ${title ? `"${title}" ` : ''}meeting transcript:

---
${rawText.slice(0, 12000)}
---`;
}

// ─── Concept Enrichment (Web Context + Source Citations) ─────────────────────

/**
 * System prompt for enriching key concepts with background knowledge
 * and authoritative source suggestions.
 */
export function buildEnrichmentSystemPrompt() {
  return `You are a knowledge enrichment assistant. For each concept provided, supply foundational background context and authoritative source recommendations.

Return a JSON array — one object per concept:

\`\`\`json
[
  {
    "concept": "string — concept name exactly as provided",
    "background": "string — 2-3 sentences of clear foundational background that helps a learner understand the concept in a broader context",
    "keyFacts": ["string — 2-3 standalone facts that deepen understanding"],
    "suggestedSources": [
      {
        "title": "string — full title of the source",
        "type": "textbook|review|paper|website|video|course",
        "url": "string or null — only include if you are highly confident the URL is correct (e.g. en.wikipedia.org/wiki/..., khanacademy.org, pubmed.ncbi.nlm.nih.gov)",
        "relevance": "string — one sentence on why this source helps"
      }
    ],
    "searchTerms": ["string — 2-3 specific search queries a student could use to find more information"]
  }
]
\`\`\`

Rules:
- Return ONLY the raw JSON array — no markdown fences, no commentary.
- Only suggest sources you are highly confident exist (major textbooks, Wikipedia, Khan Academy, PubMed, Coursera, major journal review articles).
- Set \`url\` to null if you are not certain of the exact URL — never guess URLs.
- Limit to 2 sources per concept.
- Background should be accessible to an advanced undergraduate or graduate student.`;
}

/**
 * @param {string[]} concepts - Concept names to enrich
 */
export function buildEnrichmentUserPrompt(concepts) {
  return `Enrich these concepts with background context and source recommendations:\n\n${concepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}`;
}
