/**
 * Content Chunking Utilities for Long Document Analysis
 *
 * Handles large transcripts by breaking them into manageable chunks
 * while preserving context and semantic coherence.
 */

const CHUNK_SIZE = 8000; // Characters per chunk
const CHUNK_OVERLAP = 1000; // Characters of overlap between chunks
const MAX_CHUNKS = 25; // Maximum chunks to process - increased for very long content
const MAX_CHUNKS_HIERARCHICAL = 50; // Even higher limit for hierarchical analysis

/**
 * Splits content into overlapping chunks for analysis
 * @param {string} content - The full content to chunk
 * @param {number} chunkSize - Maximum characters per chunk
 * @param {number} overlap - Characters of overlap between chunks
 * @returns {Array<{text: string, start: number, end: number, index: number}>}
 */
export function chunkContent(content, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  if (content.length <= chunkSize) {
    return [{
      text: content,
      start: 0,
      end: content.length,
      index: 0
    }];
  }

  const chunks = [];
  let start = 0;
  let index = 0;
  const maxChunks = content.length > 100000 ? MAX_CHUNKS_HIERARCHICAL : MAX_CHUNKS;

  while (start < content.length && chunks.length < maxChunks) {
    let end = Math.min(start + chunkSize, content.length);

    // Try to end at a sentence boundary if possible
    if (end < content.length) {
      const lastPeriod = content.lastIndexOf('.', end);
      const lastNewline = content.lastIndexOf('\n', end);
      const lastQuestion = content.lastIndexOf('?', end);
      const lastExclamation = content.lastIndexOf('!', end);

      // Use the latest sentence boundary within the last 500 chars
      const boundaries = [lastPeriod, lastNewline, lastQuestion, lastExclamation]
        .filter(pos => pos > end - 500 && pos > start);

      if (boundaries.length > 0) {
        end = Math.max(...boundaries) + 1;
      }
    }

    chunks.push({
      text: content.slice(start, end),
      start,
      end,
      index
    });

    // Move start position with overlap
    start = Math.max(start + 1, end - overlap);
    index++;
  }

  return chunks;
}

/**
 * Analyzes chunks hierarchically - first pass identifies important sections,
 * second pass does deep analysis on key chunks
 * @param {Array} chunks - Content chunks to analyze
 * @param {Function} analyzeChunk - Function to analyze individual chunks
 * @returns {Object} Combined analysis results
 */
export async function analyzeChunksHierarchically(chunks, analyzeChunk, options = {}) {
  if (chunks.length === 1) {
    return await analyzeChunk(chunks[0]);
  }

  // For very long content (>100k chars), use three-tier hierarchical approach
  if (chunks.length > 20) {
    return await analyzeVeryLongContent(chunks, analyzeChunk, options);
  }

  // Standard hierarchical analysis for moderately long content
  return await analyzeStandardHierarchical(chunks, analyzeChunk, options);
}

/**
 * Standard hierarchical analysis for content up to ~100k characters
 */
async function analyzeStandardHierarchical(chunks, analyzeChunk, options) {
  // First pass: Quick analysis of all chunks to identify importance
  const chunkSummaries = await Promise.all(
    chunks.map(async (chunk) => {
      const summary = await analyzeChunk(chunk, { quick: true });
      return {
        ...chunk,
        importance: summary.importance || 0,
        keyTopics: summary.keyTopics || [],
        hasEmphasis: summary.hasEmphasis || false
      };
    })
  );

  // Sort chunks by importance and select top chunks for deep analysis
  const sortedChunks = chunkSummaries
    .sort((a, b) => b.importance - a.importance)
    .slice(0, Math.min(5, chunks.length)); // Analyze top 5 most important chunks

  // Second pass: Deep analysis of important chunks
  const deepAnalyses = await Promise.all(
    sortedChunks.map(chunk => analyzeChunk(chunk, { deep: true }))
  );

  const mergeFn = options.mergeFn ?? mergeAnalyses;

  // Combine results
  return {
    totalChunks: chunks.length,
    analyzedChunks: deepAnalyses.length,
    combinedAnalysis: mergeFn(deepAnalyses),
    chunkSummaries: chunkSummaries.map(c => ({
      index: c.index,
      importance: c.importance,
      keyTopics: c.keyTopics,
      hasEmphasis: c.hasEmphasis
    })),
    analyses: deepAnalyses
  };
}

/**
 * Advanced hierarchical analysis for very long content (>100k characters)
 * Uses a three-tier approach: quick scan → importance ranking → selective deep analysis
 */
async function analyzeVeryLongContent(chunks, analyzeChunk, options) {
  console.log(`🔄 Analyzing very long content (${chunks.length} chunks) using advanced hierarchical approach`);

  // Tier 1: Ultra-quick scan of all chunks (just keyword matching)
  const quickSummaries = chunks.map(chunk => ({
    ...chunk,
    importance: calculateQuickImportance(chunk.text),
    keyTopics: extractQuickTopics(chunk.text),
    hasEmphasis: hasEmphasisIndicators(chunk.text)
  }));

  // Tier 2: Analyze top 25% most important chunks with medium depth
  const topChunks = quickSummaries
    .sort((a, b) => b.importance - a.importance)
    .slice(0, Math.max(8, Math.floor(chunks.length * 0.25)));

  const mediumAnalyses = await Promise.all(
    topChunks.map(chunk => analyzeChunk(chunk, { medium: true }))
  );

  // Tier 3: Deep analysis of top 3 most important chunks
  const top3Chunks = mediumAnalyses
    .sort((a, b) => (b.importance || 0) - (a.importance || 0))
    .slice(0, 3);

  const deepAnalyses = await Promise.all(
    top3Chunks.map(chunk => analyzeChunk(chunk, { deep: true }))
  );

  const mergeFn = options.mergeFn ?? mergeAnalysesWeighted;

  // Combine all results with weighted merging
  return {
    totalChunks: chunks.length,
    analyzedChunks: deepAnalyses.length,
    combinedAnalysis: mergeFn([...mediumAnalyses, ...deepAnalyses]),
    analysisMethod: 'ultra-hierarchical',
    tier1Chunks: quickSummaries.length,
    tier2Chunks: mediumAnalyses.length,
    tier3Chunks: deepAnalyses.length,
    chunkSummaries: quickSummaries.map(c => ({
      index: c.index,
      importance: c.importance,
      keyTopics: c.keyTopics,
      hasEmphasis: c.hasEmphasis
    })),
    analyses: deepAnalyses
  };
}

/**
 * Quick importance calculation based on keyword density
 */
function calculateQuickImportance(text) {
  const keywords = [
    'important', 'critical', 'key', 'remember', 'exam', 'test', 'quiz',
    'clinical', 'patient', 'mechanism', 'pathway', 'signal', 'action potential',
    'neurotransmitter', 'synapse', 'cortex', 'brain', 'neuron'
  ];

  const lowerText = text.toLowerCase();
  let score = 0;

  keywords.forEach(keyword => {
    const count = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
    score += count * 2; // Weight each keyword match
  });

  // Bonus for emphasis phrases
  if (lowerText.includes('will be on the exam') || lowerText.includes('know this')) {
    score += 10;
  }

  return score;
}

/**
 * Extract key topics from text quickly
 */
function extractQuickTopics(text) {
  const topics = [];
  const lowerText = text.toLowerCase();

  const topicKeywords = {
    'neural signaling': ['action potential', 'depolarization', 'axon'],
    'synaptic transmission': ['synapse', 'neurotransmitter', 'vesicle'],
    'neural circuits': ['cortex', 'thalamus', 'basal ganglia'],
    'clinical neurology': ['patient', 'symptom', 'diagnosis', 'treatment']
  };

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(kw => lowerText.includes(kw))) {
      topics.push(topic);
    }
  });

  return topics;
}

/**
 * Check for emphasis indicators
 */
function hasEmphasisIndicators(text) {
  const indicators = [
    'important', 'critical', 'key point', 'remember', 'emphasis',
    'will be on the exam', 'know this', 'pay attention'
  ];

  return indicators.some(indicator => text.toLowerCase().includes(indicator));
}

/**
 * Merges multiple analysis results into a single coherent result
 * @param {Array} analyses - Array of analysis results to merge
 * @returns {Object} Merged analysis
 */
function mergeAnalyses(analyses) {
  if (analyses.length === 0) return {};
  if (analyses.length === 1) return analyses[0];

  // Combine key topics, removing duplicates
  const allTopics = analyses.flatMap(a => a.keyTopics || []);
  const uniqueTopics = [...new Set(allTopics)];

  // Average importance scores
  const avgImportance = analyses.reduce((sum, a) => sum + (a.importance || 0), 0) / analyses.length;

  // Combine emphasis patterns
  const emphasisPatterns = analyses.flatMap(a => a.emphasisPatterns || []);
  const uniquePatterns = [...new Set(emphasisPatterns)];

  return {
    keyTopics: uniqueTopics,
    importance: avgImportance,
    emphasisPatterns: uniquePatterns,
    analysisMethod: 'chunked',
    chunksAnalyzed: analyses.length
  };
}

/**
 * Merges multiple analysis results with weighted importance for hierarchical analysis
 * @param {Array} analyses - Array of analysis results to merge (weighted by importance)
 * @returns {Object} Merged analysis with weighted scoring
 */
function mergeAnalysesWeighted(analyses) {
  if (analyses.length === 0) return {};
  if (analyses.length === 1) return analyses[0];

  // Weight analyses by their importance scores
  const totalWeight = analyses.reduce((sum, a) => sum + Math.max(a.importance || 1, 1), 0);

  // Combine key topics with frequency weighting
  const topicFrequency = {};
  analyses.forEach(analysis => {
    const weight = Math.max(analysis.importance || 1, 1);
    (analysis.keyTopics || []).forEach(topic => {
      topicFrequency[topic] = (topicFrequency[topic] || 0) + weight;
    });
  });

  // Sort topics by weighted frequency and take top ones
  const sortedTopics = Object.entries(topicFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10 most frequent topics
    .map(([topic]) => topic);

  // Weighted average of importance scores
  const weightedImportance = analyses.reduce((sum, a) => {
    const weight = Math.max(a.importance || 1, 1);
    return sum + (a.importance || 0) * weight;
  }, 0) / totalWeight;

  // Combine emphasis patterns (deep analyses get more weight)
  const emphasisPatterns = [];
  const patternCount = {};

  analyses.forEach((analysis, index) => {
    const weight = index < 3 ? 2 : 1; // Give more weight to deep analyses (first 3)
    (analysis.emphasisPatterns || []).forEach(pattern => {
      patternCount[pattern] = (patternCount[pattern] || 0) + weight;
    });
  });

  // Sort patterns by weighted frequency
  Object.entries(patternCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) // Top 5 patterns
    .forEach(([pattern]) => emphasisPatterns.push(pattern));

  return {
    keyTopics: sortedTopics,
    importance: weightedImportance,
    emphasisPatterns: emphasisPatterns,
    analysisMethod: 'weighted-hierarchical',
    chunksAnalyzed: analyses.length,
    totalWeight: totalWeight
  };
}

/**
 * Estimates processing time and token usage for chunked analysis
 * @param {string} content - Content to analyze
 * @returns {Object} Processing estimates
 */
export function estimateChunkedProcessing(content) {
  const chunks = chunkContent(content);
  const totalTokens = chunks.reduce((sum, chunk) => sum + estimateTokens(chunk.text), 0);

  return {
    totalChunks: chunks.length,
    estimatedTokens: totalTokens,
    estimatedCost: (totalTokens / 1000) * 0.01, // Rough estimate
    processingTimeMinutes: Math.ceil(chunks.length * 0.5), // ~30 seconds per chunk
    recommendedApproach: chunks.length > 3 ? 'hierarchical' : 'direct'
  };
}

/**
 * Simple token estimation (rough approximation)
 * @param {string} text - Text to estimate tokens for
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  return Math.round(text.split(/\s+/).length * 1.3);
}
