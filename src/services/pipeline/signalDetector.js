import { SOURCE_WEIGHTS } from './contentParser';
import { mockHighYieldConcepts } from '../../data/mockAnalysis';
import { chunkContent } from '../../lib/ai/contentChunking';
import { v4 as uuidv4 } from 'uuid';

const NEURO_CONCEPTS = [
  { name: 'Action Potential Ionic Basis', unitId: 'unit_01', keywords: ['action potential', 'depolarization', 'na+', 'sodium', 'voltage-gated', 'threshold', 'refractory'] },
  { name: 'Synaptic Transmission & SNARE', unitId: 'unit_02', keywords: ['snare', 'exocytosis', 'vesicle', 'synaptotagmin', 'calcium', 'active zone', 'quantal'] },
  { name: 'Glutamate & GABA Balance', unitId: 'unit_02', keywords: ['glutamate', 'gaba', 'nmda', 'ampa', 'excitatory', 'inhibitory', 'benzodiazepine', 'excitotoxicity'] },
  { name: 'Acetylcholine & NMJ', unitId: 'unit_03', keywords: ['acetylcholine', 'ach', 'nmj', 'nicotinic', 'muscarinic', 'myasthenia', 'ache', 'chat'] },
  { name: 'Dopamine Pathways', unitId: 'unit_03', keywords: ['dopamine', 'nigrostriatal', 'mesolimbic', 'mesocortical', 'tuberoinfundibular', 'antipsychotic', 'd2', 'parkinson'] },
  { name: 'Somatosensory Pathways', unitId: 'unit_04', keywords: ['somatosensory', 'dorsal column', 'spinothalamic', 'medial lemniscus', 'brown-sequard', 'decussation', 'vpl'] },
  { name: 'Motor Cortex & Corticospinal Tract', unitId: 'unit_04', keywords: ['corticospinal', 'upper motor', 'lower motor', 'umn', 'lmn', 'babinski', 'internal capsule', 'spasticity', 'flaccid'] },
  { name: 'LTP & Neuroplasticity', unitId: 'unit_05', keywords: ['ltp', 'long-term potentiation', 'camkii', 'hebbian', 'ampa insertion', 'bdnf', 'plasticity', 'nmda receptor'] },
];

export function detectHighYieldConcepts(sources, courseMap, professorStyle, quizPattern) {
  if (!sources || sources.length === 0) {
    return mockHighYieldConcepts;
  }

  const fullText = sources.map(s => s.content || '').join('\n');

  if (fullText.length < 100) {
    return mockHighYieldConcepts;
  }

  // Handle long content with chunking
  if (fullText.length > 15000) {
    return detectConceptsInChunks(sources, fullText, courseMap, professorStyle, quizPattern);
  }

  return detectConceptsInText(sources, fullText.toLowerCase(), courseMap, professorStyle, quizPattern);
}

function detectConceptsInChunks(sources, fullText, courseMap, professorStyle, quizPattern) {
  console.log(`🔄 Detecting concepts in long content (${fullText.length.toLocaleString()} chars) using chunked approach`);

  const chunks = chunkContent(fullText);
  const chunkResults = chunks.map(chunk =>
    detectConceptsInText(sources, chunk.text.toLowerCase(), courseMap, professorStyle, quizPattern)
  );

  // Combine and deduplicate results across chunks
  const allConcepts = chunkResults.flat();
  const conceptMap = new Map();

  // Aggregate scores for same concepts across chunks
  allConcepts.forEach(concept => {
    const key = concept.name.toLowerCase();
    if (conceptMap.has(key)) {
      const existing = conceptMap.get(key);
      existing.score = Math.max(existing.score, concept.score);
      existing.mentions += concept.mentions;
      existing.sourceIds = [...new Set([...existing.sourceIds, ...concept.sourceIds])];
    } else {
      conceptMap.set(key, { ...concept });
    }
  });

  // Return top concepts, sorted by score
  return Array.from(conceptMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 15) // Limit to top 15 concepts
    .map(concept => ({
      ...concept,
      analysisMethod: 'chunked',
      chunksAnalyzed: chunks.length
    }));
}

function detectConceptsInText(sources, text, courseMap, professorStyle, quizPattern) {

  const scored = NEURO_CONCEPTS.map(concept => {
    let totalWeightedScore = 0;
    const sourceTypes = new Set();
    const sourceIds = [];

    for (const source of sources) {
      const text = (source.content || '').toLowerCase();
      const weight = SOURCE_WEIGHTS[source.type] || 0.3;
      const mentionCount = concept.keywords.reduce((n, kw) => n + countOccurrences(text, kw), 0);

      if (mentionCount > 0) {
        totalWeightedScore += weight * Math.log1p(mentionCount);
        sourceTypes.add(source.type);
        sourceIds.push(source.id);
      }
    }

    const crossSourceFrequency = sourceTypes.size;
    const inQuizTopics = quizPattern?.repeatedlyTestedTopics?.some(t =>
      concept.name.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(concept.keywords[0])
    );

    return {
      id: uuidv4(),
      name: concept.name,
      unitId: concept.unitId,
      rawScore: totalWeightedScore,
      crossSourceFrequency,
      sourceIds,
      inQuizTopics: !!inQuizTopics,
    };
  });

  // Normalize scores to 0-100
  const maxScore = Math.max(...scored.map(c => c.rawScore), 1);
  const normalized = scored.map(c => {
    const normalizedScore = Math.round((c.rawScore / maxScore) * 100);
    const quizBoost = c.inQuizTopics ? 20 : 0;
    const crossSourceBoost = Math.min(c.crossSourceFrequency * 5, 25);
    const weightedScore = Math.min(100, normalizedScore + quizBoost + crossSourceBoost);

    const quizSourceScore = c.sourceIds.some(id => {
      const src = sources.find(s => s.id === id);
      return src && src.type === 'quiz';
    }) ? 100 : 0;

    const quizLikelihood = Math.min(100, Math.round(
      0.6 * quizSourceScore + 0.4 * weightedScore + c.crossSourceFrequency * 3
    ));

    return {
      id: c.id,
      name: c.name,
      unitId: c.unitId,
      crossSourceFrequency: c.crossSourceFrequency,
      weightedScore,
      quizLikelihood,
      sourceIds: c.sourceIds,
    };
  });

  return normalized.sort((a, b) => b.quizLikelihood - a.quizLikelihood);
}

function countOccurrences(text, phrase) {
  if (!text || !phrase) return 0;
  let count = 0;
  let pos = 0;
  while ((pos = text.indexOf(phrase, pos)) !== -1) {
    count++;
    pos += phrase.length;
  }
  return count;
}
