import { mockProfessorStyle } from '../../data/mockAnalysis';

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

  const fullText = transcripts.map(s => s.content).join('\n\n').toLowerCase();

  // Count phrase patterns
  const phrasePatterns = EMPHASIS_PHRASES
    .filter(p => fullText.includes(p))
    .map(p => `"${p}" (used ${countOccurrences(fullText, p)}x)`);

  // Determine emphasis level
  const clinicalCount = CLINICAL_KEYWORDS.reduce((n, kw) => n + countOccurrences(fullText, kw), 0);
  const molecularCount = MOLECULAR_KEYWORDS.reduce((n, kw) => n + countOccurrences(fullText, kw), 0);
  const mechanismCount = MECHANISM_KEYWORDS.reduce((n, kw) => n + countOccurrences(fullText, kw), 0);

  let emphasisLevel = 'balanced';
  if (clinicalCount > molecularCount * 1.5) emphasisLevel = 'clinical';
  else if (molecularCount > clinicalCount * 1.5) emphasisLevel = 'molecular';
  else if (mechanismCount > clinicalCount + molecularCount) emphasisLevel = 'systems';

  // Detect lecture style
  const hasCases = /patient|case|year.old|presents with/.test(fullText);
  const hasMechanisms = mechanismCount > 20;
  let lectureStyle = 'mixed';
  if (hasCases && hasMechanisms) lectureStyle = 'case_based';
  else if (hasMechanisms) lectureStyle = 'mechanism_first';
  else if (hasCases) lectureStyle = 'case_based';

  // Extract signature terms (neuroscience-specific)
  const signatureTerms = extractSignatureTerms(fullText);

  return {
    lectureStyle,
    emphasisLevel,
    phrasePatterns: phrasePatterns.length > 0 ? phrasePatterns : mockProfessorStyle.phrasePatterns,
    favoriteTopics: extractFavoriteTopics(fullText),
    signatureTerms: signatureTerms.length > 0 ? signatureTerms : mockProfessorStyle.signatureTerms,
    detectedStyle: buildStyleSummary(lectureStyle, emphasisLevel, phrasePatterns.length),
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

function extractSignatureTerms(text) {
  const neuroTerms = [
    'coincidence detector', 'all-or-none', 'quantal release', 'refractory period',
    'hebbian', 'decussation', 'saltatory conduction', 'e/i balance',
    'penumbra', 'therapeutic ratio', 'motor homunculus',
  ];
  return neuroTerms.filter(t => text.includes(t));
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
