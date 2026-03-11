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
