import { mockProfessorStyle } from '../../data/mockAnalysis';
import { chunkContent } from '../../lib/ai/contentChunking';

const EMPHASIS_PHRASES = [
  'know this', 'important', 'will be on the exam', 'critical', 'key point',
  'remember this', 'this is crucial', 'do not forget', 'emphasis', 'notable',
  'clinically relevant', 'clinically speaking', 'pay attention',
];

const CLINICAL_KEYWORDS = [
  'patient', 'clinical', 'disease', 'disorder', 'syndrome', 'symptom', 'lesion',
  'deficit', 'diagnosis', 'treatment', 'therapy', 'pathology', 'case',
];

const MOLECULAR_KEYWORDS = [
  'receptor', 'channel', 'protein', 'enzyme', 'kinase', 'phosphorylation',
  'gene', 'expression', 'transcription', 'cascade', 'signaling', 'molecule',
];

const MECHANISM_KEYWORDS = [
  'mechanism', 'pathway', 'cascade', 'process', 'step', 'sequence',
  'how', 'why', 'because', 'therefore', 'resulting in',
];

export function analyzeProfessorStyle(sources) {
  const transcripts = sources.filter(s => s.type === 'transcript' || s.type === 'slides');

  if (transcripts.length === 0) {
    return mockProfessorStyle;
  }

  const fullText = transcripts.map(s => s.content).join('\n\n');

  // Check if content is too long and needs chunking
  if (fullText.length > 12000) {
    return analyzeLongTranscript(fullText);
  }

  return analyzeText(fullText.toLowerCase());
}

function analyzeLongTranscript(fullText) {
  console.log(`🔄 Analyzing long transcript (${fullText.length.toLocaleString()} chars) using chunked approach`);

  const chunks = chunkContent(fullText);

  // Analyze chunks hierarchically
  const chunkAnalyses = chunks.map(chunk => analyzeTextChunk(chunk.text.toLowerCase()));

  // Combine results from all chunks
  return combineChunkAnalyses(chunkAnalyses, chunks.length);
}

function analyzeTextChunk(text) {
  // Count phrase patterns
  const phrasePatterns = EMPHASIS_PHRASES
    .filter(p => text.includes(p))
    .map(p => `"${p}" (used ${countOccurrences(text, p)}x)`);

  // Determine emphasis level
  const clinicalCount = CLINICAL_KEYWORDS.reduce((n, kw) => n + countOccurrences(text, kw), 0);
  const molecularCount = MOLECULAR_KEYWORDS.reduce((n, kw) => n + countOccurrences(text, kw), 0);
  const mechanismCount = MECHANISM_KEYWORDS.reduce((n, kw) => n + countOccurrences(text, kw), 0);

  let emphasisLevel = 'balanced';
  if (clinicalCount > molecularCount * 1.5) emphasisLevel = 'clinical';
  else if (molecularCount > clinicalCount * 1.5) emphasisLevel = 'molecular';
  else if (mechanismCount > clinicalCount + molecularCount) emphasisLevel = 'systems';

  // Detect lecture style
  const hasCases = /patient|case|year.old|presents with/.test(text);
  const hasMechanisms = mechanismCount > 5; // Lower threshold for chunks
  const hasEmphasis = phrasePatterns.length > 0;

  return {
    phrasePatterns,
    clinicalCount,
    molecularCount,
    mechanismCount,
    emphasisLevel,
    hasCases,
    hasMechanisms,
    hasEmphasis,
    importance: (clinicalCount + molecularCount + mechanismCount + (hasEmphasis ? 10 : 0)) / 100
  };
}

function combineChunkAnalyses(analyses, totalChunks) {
  // Aggregate counts across all chunks
  const totalClinical = analyses.reduce((sum, a) => sum + a.clinicalCount, 0);
  const totalMolecular = analyses.reduce((sum, a) => sum + a.molecularCount, 0);
  const totalMechanism = analyses.reduce((sum, a) => sum + a.mechanismCount, 0);

  // Combine unique phrase patterns
  const allPatterns = analyses.flatMap(a => a.phrasePatterns);
  const uniquePatterns = [...new Set(allPatterns)];

  // Determine overall emphasis level
  let emphasisLevel = 'balanced';
  if (totalClinical > totalMolecular * 1.5) emphasisLevel = 'clinical';
  else if (totalMolecular > totalClinical * 1.5) emphasisLevel = 'molecular';
  else if (totalMechanism > totalClinical + totalMolecular) emphasisLevel = 'systems';

  // Detect lecture style
  const hasCases = analyses.some(a => a.hasCases);
  const hasMechanisms = analyses.some(a => a.hasMechanisms);
  const hasEmphasis = analyses.some(a => a.hasEmphasis);

  let lectureStyle = 'traditional';
  if (hasCases && hasMechanisms) lectureStyle = 'case-based integrated';
  else if (hasCases) lectureStyle = 'case-based';
  else if (hasMechanisms) lectureStyle = 'mechanistic';

  return {
    emphasisLevel,
    lectureStyle,
    emphasisPatterns: uniquePatterns,
    clinicalFocus: totalClinical > 20,
    molecularFocus: totalMolecular > 20,
    systemsFocus: totalMechanism > 20,
    usesCaseStudies: hasCases,
    emphasizesMechanisms: hasMechanisms,
    usesEmphasisPhrases: hasEmphasis,
    analysisMethod: 'chunked',
    chunksAnalyzed: totalChunks
  };
}

function analyzeText(text) {
  // Count phrase patterns
  const phrasePatterns = EMPHASIS_PHRASES
    .filter(p => text.includes(p))
    .map(p => `"${p}" (used ${countOccurrences(text, p)}x)`);

  // Determine emphasis level
  const clinicalCount = CLINICAL_KEYWORDS.reduce((n, kw) => n + countOccurrences(text, kw), 0);
  const molecularCount = MOLECULAR_KEYWORDS.reduce((n, kw) => n + countOccurrences(text, kw), 0);
  const mechanismCount = MECHANISM_KEYWORDS.reduce((n, kw) => n + countOccurrences(text, kw), 0);

  let emphasisLevel = 'balanced';
  if (clinicalCount > molecularCount * 1.5) emphasisLevel = 'clinical';
  else if (molecularCount > clinicalCount * 1.5) emphasisLevel = 'molecular';
  else if (mechanismCount > clinicalCount + molecularCount) emphasisLevel = 'systems';

  // Detect lecture style
  const hasCases = /patient|case|year.old|presents with/.test(text);
  const hasMechanisms = mechanismCount > 20;
  const hasEmphasis = phrasePatterns.length > 0;

  let lectureStyle = 'traditional';
  if (hasCases && hasMechanisms) lectureStyle = 'case-based integrated';
  else if (hasCases) lectureStyle = 'case-based';
  else if (hasMechanisms) lectureStyle = 'mechanistic';

  return {
    emphasisLevel,
    lectureStyle,
    emphasisPatterns: phrasePatterns,
    clinicalFocus: clinicalCount > 20,
    molecularFocus: molecularCount > 20,
    systemsFocus: mechanismCount > 20,
    usesCaseStudies: hasCases,
    emphasizesMechanisms: hasMechanisms,
    usesEmphasisPhrases: hasEmphasis,
  };
}

function countOccurrences(text, phrase) {
  let count = 0;
  let pos = 0;
  while ((pos = text.indexOf(phrase, pos)) !== -1) {
    count++;
    pos += phrase.length;
  }
  return count;
}

function extractFavoriteTopics(text) {
  const topicCounts = {
    'action potentials': countOccurrences(text, 'action potential'),
    'synaptic transmission': countOccurrences(text, 'synap'),
    'dopamine pathways': countOccurrences(text, 'dopamin'),
    'neurotransmitters': countOccurrences(text, 'neurotransmitter'),
    'ion channels': countOccurrences(text, 'channel'),
    'receptor pharmacology': countOccurrences(text, 'receptor'),
  };

  return Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, n]) => n > 3)
    .slice(0, 5)
    .map(([topic]) => topic);
}

function buildStyleSummary(lectureStyle, emphasisLevel, emphasisPhraseCount) {
  const styleDesc = {
    case_based: 'case-based (clinical scenarios first)',
    mechanism_first: 'mechanism-first (explain then apply)',
    mixed: 'mixed (alternates between mechanisms and cases)',
    systems_overview: 'systems-level (big picture → details)',
  };

  const emphasisDesc = {
    clinical: 'clinical application and patient-relevant outcomes',
    molecular: 'molecular mechanisms and signaling precision',
    systems: 'systems-level pathways and circuit logic',
    balanced: 'balanced molecular and clinical coverage',
  };

  return `Detected teaching style: ${styleDesc[lectureStyle] || lectureStyle}. Emphasis on ${emphasisDesc[emphasisLevel] || emphasisLevel}. ${emphasisPhraseCount > 0 ? `${emphasisPhraseCount} emphasis phrases detected — high-frequency signals for exam relevance.` : 'Consistent lecture density across topics.'}`;
}
