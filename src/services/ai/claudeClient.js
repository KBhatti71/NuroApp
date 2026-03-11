/**
 * claudeClient — thin wrapper around @anthropic-ai/sdk for NuroApp.
 *
 * Architecture notes:
 *  - All LLM calls flow through this module so we have one place to
 *    add retries, rate-limit handling, telemetry, or swap models.
 *  - The client is instantiated lazily so the SDK is never imported
 *    unless VITE_USE_REAL_AI=true.
 *  - Streaming is exposed via an async generator so callers can update
 *    the UI incrementally without waiting for the full response.
 */

const MODEL   = import.meta.env.VITE_CLAUDE_MODEL      ?? 'claude-sonnet-4-6';
const MAX_TOK = Number(import.meta.env.VITE_CLAUDE_MAX_TOKENS ?? 1024);
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY ?? '';

/** True when a real API key is configured AND the feature flag is on. */
export const isAIEnabled = () =>
  import.meta.env.VITE_USE_REAL_AI === 'true' && API_KEY.length > 10;

let _client = null;

async function getClient() {
  if (_client) return _client;
  const { Anthropic } = await import('@anthropic-ai/sdk');
  _client = new Anthropic({
    apiKey: API_KEY,
    // Required for browser-based usage — ensure your API key is scoped
    // appropriately and never committed to version control.
    dangerouslyAllowBrowser: true,
  });
  return _client;
}

/**
 * generateText — single-turn, non-streaming text generation.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {Promise<string>} The assistant's text reply.
 */
export async function generateText(systemPrompt, userPrompt) {
  const client = await getClient();
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOK,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
  return message.content[0]?.text ?? '';
}

/**
 * generateJSON — calls Claude and parses the response as JSON.
 * Throws a descriptive error if the model doesn't return valid JSON.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {Promise<unknown>} Parsed JSON value.
 */
export async function generateJSON(systemPrompt, userPrompt) {
  const raw = await generateText(systemPrompt, userPrompt);
  // Strip markdown code fences the model sometimes wraps around JSON
  const stripped = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
  try {
    return JSON.parse(stripped);
  } catch {
    throw new Error(`Claude returned invalid JSON.\n\nRaw response:\n${raw}`);
  }
}

/**
 * streamText — streaming text generation via an async generator.
 *
 * Usage:
 *   for await (const chunk of streamText(sys, user)) {
 *     setPartialText(prev => prev + chunk);
 *   }
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @yields {string} Successive text deltas.
 */
export async function* streamText(systemPrompt, userPrompt) {
  const client = await getClient();
  const stream = await client.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOK,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });
  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta?.type === 'text_delta'
    ) {
      yield event.delta.text;
    }
  }
}
