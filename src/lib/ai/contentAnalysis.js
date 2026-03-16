/**
 * Content Analysis Utilities
 * Provides insights into content processing and analysis quality
 */

import { chunkContent, estimateChunkedProcessing } from './contentChunking';

/**
 * Analyzes content sources and provides processing insights
 * @param {Array} sources - Content sources to analyze
 * @returns {Object} Analysis insights and recommendations
 */
export function analyzeContentStats(sources) {
  const stats = {
    totalSources: sources.length,
    totalCharacters: 0,
    totalTokens: 0,
    sourceTypes: {},
    longSources: [],
    processingStrategy: 'direct',
    estimatedTime: 0,
    quality: 'good'
  };

  sources.forEach(source => {
    const content = source.content || '';
    const charCount = content.length;
    const tokenCount = estimateTokens(content);

    stats.totalCharacters += charCount;
    stats.totalTokens += tokenCount;

    // Track source types
    stats.sourceTypes[source.type] = (stats.sourceTypes[source.type] || 0) + 1;

    // Track long sources
    if (charCount > 10000) {
      stats.longSources.push({
        name: source.name,
        type: source.type,
        characters: charCount,
        tokens: tokenCount
      });
    }
  });

  // Determine processing strategy
  if (stats.totalCharacters > 100000) {
    stats.processingStrategy = 'ultra-hierarchical';
    const estimate = estimateChunkedProcessing(
      sources.map(s => s.content || '').join('\n')
    );
    stats.estimatedTime = Math.ceil(estimate.processingTimeMinutes * 1.5); // Extra time for hierarchical processing
  } else if (stats.totalCharacters > 30000) {
    stats.processingStrategy = 'hierarchical';
    const estimate = estimateChunkedProcessing(
      sources.map(s => s.content || '').join('\n')
    );
    stats.estimatedTime = estimate.processingTimeMinutes;
  } else {
    stats.processingStrategy = 'direct';
    stats.estimatedTime = Math.ceil(stats.totalTokens / 40000); // Rough estimate for direct processing
  }

  // Assess quality
  if (stats.longSources.length > 0) {
    stats.quality = stats.totalSources > 2 ? 'excellent' : 'good';
  } else if (stats.totalCharacters < 5000) {
    stats.quality = 'limited';
  }

  return stats;
}

/**
 * Generates user-friendly insights about content analysis
 * @param {Object} stats - Content statistics
 * @returns {Array} Array of insight messages
 */
export function generateContentInsights(stats) {
  const insights = [];

  if (stats.totalCharacters > 200000) {
    insights.push({
      type: 'warning',
      icon: '📊',
      message: `Extremely large content detected (${(stats.totalCharacters / 1000).toFixed(0)}K chars) - using ultra-efficient hierarchical analysis`
    });
  } else if (stats.totalCharacters > 100000) {
    insights.push({
      type: 'info',
      icon: '📊',
      message: `Large content detected (${(stats.totalCharacters / 1000).toFixed(0)}K chars) - using advanced chunking for complete analysis`
    });
  } else if (stats.totalCharacters > 50000) {
    insights.push({
      type: 'info',
      icon: '📊',
      message: `Large content detected (${stats.totalCharacters.toLocaleString()} chars) - using intelligent chunking for complete analysis`
    });
  }

  if (stats.longSources.length > 0) {
    insights.push({
      type: 'success',
      icon: '🎯',
      message: `${stats.longSources.length} comprehensive source${stats.longSources.length > 1 ? 's' : ''} found - deep analysis enabled`
    });
  }

  if (stats.processingStrategy === 'chunked') {
    insights.push({
      type: 'info',
      icon: '⏱️',
      message: `Processing time: ~${stats.estimatedTime} minutes (analyzing in sections for accuracy)`
    });
  }

  const highValueSources = Object.entries(stats.sourceTypes)
    .filter(([type, count]) => ['quiz', 'transcript', 'syllabus'].includes(type))
    .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`);

  if (highValueSources.length > 0) {
    insights.push({
      type: 'success',
      icon: '⭐',
      message: `High-value sources detected: ${highValueSources.join(', ')}`
    });
  }

  return insights;
}

/**
 * Estimates token count for text (rough approximation)
 * @param {string} text - Text to estimate
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  return Math.round(text.split(/\s+/).length * 1.3);
}