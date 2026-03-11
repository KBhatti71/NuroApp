import { mockQuizPattern } from '../../data/mockAnalysis';

export function analyzeQuizzes(sources) {
  const quizSources = sources.filter(s => s.type === 'quiz');

  if (quizSources.length === 0) {
    return mockQuizPattern;
  }

  const fullText = quizSources.map(s => s.content).join('\n\n');

  const dominantFormat = detectQuestionFormat(fullText);
  const conceptDepth = detectConceptDepth(fullText);
  const clinicalBias = detectClinicalBias(fullText);
  const previousQuestions = extractQuestions(fullText);
  const repeatedlyTestedTopics = detectRepeatedTopics(fullText);
  const questionVerbPatterns = extractQuestionVerbs(fullText);

  return {
    dominantFormat,
    conceptDepth,
    clinicalBias,
    previousQuestions,
    repeatedlyTestedTopics,
    questionVerbPatterns,
  };
}

function detectQuestionFormat(text) {
  const mcqSignals = (text.match(/\b[A-E]\)/g) || []).length + (text.match(/\b[a-e]\./g) || []).length;
  const vignetteSignals = (text.match(/\d{2,3}[\s-]year[\s-]old/gi) || []).length +
    (text.match(/patient presents/gi) || []).length;
  const shortAnswerSignals = (text.match(/explain|describe|discuss|compare/gi) || []).length;

  if (vignetteSignals > 2 || (vignetteSignals > 0 && mcqSignals > 5)) return 'case_vignette';
  if (mcqSignals > 10) return 'mcq';
  if (shortAnswerSignals > mcqSignals) return 'short_answer';
  return 'mixed';
}

function detectConceptDepth(text) {
  const recallVerbs = (text.match(/\b(list|name|identify|define|state|which)\b/gi) || []).length;
  const applicationVerbs = (text.match(/\b(explain|describe|apply|calculate|predict|interpret)\b/gi) || []).length;
  const analysisVerbs = (text.match(/\b(analyze|compare|contrast|evaluate|justify|synthesize)\b/gi) || []).length;

  if (analysisVerbs > recallVerbs) return 'analysis';
  if (applicationVerbs > recallVerbs) return 'application';
  return 'recall';
}

function detectClinicalBias(text) {
  const clinicalTerms = (text.match(/patient|clinical|symptom|diagnosis|treatment|disorder|disease|case|presents/gi) || []).length;
  const totalWords = text.split(/\s+/).length;
  return clinicalTerms / totalWords > 0.02;
}

function extractQuestions(text) {
  const lines = text.split('\n');
  const questions = [];
  for (const line of lines) {
    const clean = line.trim();
    if (clean.length > 30 && clean.length < 400 && /\?$/.test(clean)) {
      questions.push(clean);
    }
    if (questions.length >= 5) break;
  }
  return questions.length > 0 ? questions : mockQuizPattern.previousQuestions.slice(0, 3);
}

function detectRepeatedTopics(text) {
  const neuroTopics = {
    'action potential': /action potential/gi,
    'synaptic transmission': /synaptic|synapse/gi,
    'dopamine': /dopamin/gi,
    'acetylcholine': /acetylcholine|cholinergic|nmj/gi,
    'glutamate/GABA': /glutamate|gaba|excitatory|inhibitory/gi,
    'somatosensory': /somatosensory|dorsal column|spinothalamic/gi,
    'motor pathways': /corticospinal|upper motor|lower motor|umn|lmn/gi,
    'plasticity/LTP': /plasticity|ltp|long.term potentiation/gi,
  };

  return Object.entries(neuroTopics)
    .map(([topic, regex]) => ({ topic, count: (text.match(regex) || []).length }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(({ topic }) => topic);
}

function extractQuestionVerbs(text) {
  const patterns = [];
  const verbMatches = text.match(/(?:explain|describe|compare|apply|trace|identify|list|what is|why does|how does|what happens)[^.?!]*[.?]/gi);
  if (verbMatches) {
    const unique = [...new Set(verbMatches.map(m => m.trim().slice(0, 80)))];
    patterns.push(...unique.slice(0, 5));
  }
  return patterns.length > 0 ? patterns : mockQuizPattern.questionVerbPatterns;
}
