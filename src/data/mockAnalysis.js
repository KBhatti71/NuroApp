export const mockProfessorStyle = {
  lectureStyle: 'case_based',
  emphasisLevel: 'clinical',
  phrasePatterns: [
    '"Know this — it will be on the exam"',
    '"Clinically speaking, this manifests as..."',
    '"The key distinction here is..."',
    '"Think about this mechanistically, not just as a fact"',
    '"Beautiful example of same mechanism, opposite clinical result"',
  ],
  favoriteTopics: [
    'Ion channel pharmacology',
    'SNARE proteins and neurotoxins',
    'UMN vs LMN localization',
    'Dopamine pathway pharmacology',
    'Excitotoxicity in stroke',
  ],
  signatureTerms: [
    'Coincidence detector (for NMDA)',
    'Zipper model (for SNARE)',
    'Sensor and effector (for voltage-gated channels)',
    'The therapeutic ratio (for antipsychotics)',
    'Decussation level (for pathways)',
  ],
  detectedStyle:
    'Dr. Chen teaches mechanism-first, then applies to clinical scenarios. She consistently links basic science to pharmacology and pathology. Lectures follow: core mechanism → why it matters clinically → what happens when it goes wrong → how we target it therapeutically. Quiz style mirrors this pattern — expect vignettes requiring you to apply mechanisms.',
};

export const mockQuizPattern = {
  dominantFormat: 'case_vignette',
  conceptDepth: 'application',
  clinicalBias: true,
  previousQuestions: [
    'A 45-year-old patient presents with descending paralysis and dysphagia after eating home-canned vegetables. What toxin is responsible, which specific SNARE protein does it cleave, and explain the resulting paralysis type.',
    'Using the Nernst equation logic, explain why hyperkalemia brings the resting membrane potential closer to threshold and leads to paradoxical weakness at high concentrations.',
    'A patient develops extrapyramidal symptoms after starting haloperidol. Identify the dopamine pathway responsible and explain why atypical antipsychotics produce fewer such side effects.',
    'Compare the sensory deficits in Brown-Séquard syndrome versus syringomyelia, explaining the anatomical basis for each pattern.',
    'Trace the corticospinal tract from M1 to the muscle fiber. At what structure does it decussate? What happens to tone, reflexes, and muscle bulk in a UMN versus LMN lesion?',
  ],
  repeatedlyTestedTopics: [
    'Ion channel pharmacology (lidocaine, tetrodotoxin)',
    'SNARE proteins and toxins',
    'UMN vs LMN clinical differentiation',
    'Dopamine pathways × antipsychotic side effects',
    'E/I balance in epilepsy and excitotoxicity',
    'Somatosensory pathway decussation levels',
    'LTP mechanism (NMDA, CaMKII, AMPA insertion)',
  ],
  questionVerbPatterns: [
    'Explain the mechanism by which...',
    'A patient presents with... What is the underlying cause?',
    'Compare and contrast... in terms of mechanism and clinical presentation',
    'Using ionic mechanisms, explain why...',
    'Trace the pathway from... to... and identify where a lesion at X would manifest',
  ],
};

export const mockHighYieldConcepts = [
  { id: 'hyc_001', name: 'Action Potential Ionic Basis', unitId: 'unit_01', crossSourceFrequency: 5, weightedScore: 94, quizLikelihood: 92 },
  { id: 'hyc_002', name: 'Dopamine Pathways (4 Tracts)', unitId: 'unit_03', crossSourceFrequency: 5, weightedScore: 91, quizLikelihood: 91 },
  { id: 'hyc_003', name: 'UMN vs LMN Signs', unitId: 'unit_04', crossSourceFrequency: 5, weightedScore: 89, quizLikelihood: 89 },
  { id: 'hyc_004', name: 'Synaptic Vesicle Cycle & SNARE', unitId: 'unit_02', crossSourceFrequency: 4, weightedScore: 87, quizLikelihood: 88 },
  { id: 'hyc_005', name: 'Acetylcholine & NMJ Pharmacology', unitId: 'unit_03', crossSourceFrequency: 4, weightedScore: 86, quizLikelihood: 87 },
  { id: 'hyc_006', name: 'Glutamate/GABA E/I Balance', unitId: 'unit_02', crossSourceFrequency: 4, weightedScore: 84, quizLikelihood: 85 },
  { id: 'hyc_007', name: 'Somatosensory Pathways & Decussation', unitId: 'unit_04', crossSourceFrequency: 4, weightedScore: 82, quizLikelihood: 83 },
  { id: 'hyc_008', name: 'LTP & Neuroplasticity', unitId: 'unit_05', crossSourceFrequency: 3, weightedScore: 78, quizLikelihood: 79 },
];
