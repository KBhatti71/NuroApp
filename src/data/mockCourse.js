export const mockCourse = {
  id: 'course_demo',
  name: 'NEUR 301: Systems Neuroscience',
  professor: 'Dr. Sarah Chen',
  institution: 'University Medical School',
  semester: 'Spring 2026',
  examDate: '2026-04-15T09:00:00Z',
  createdAt: '2026-01-10T00:00:00Z',
};

export const mockCourseMap = {
  totalWeeks: 15,
  examTopics: [
    'Ion channels and action potentials',
    'Synaptic transmission mechanisms',
    'Neurotransmitter systems and pharmacology',
    'Somatosensory and motor pathway localization',
    'Neuroplasticity and learning',
  ],
  units: [
    {
      id: 'unit_01',
      title: 'Unit 1: Neural Signaling',
      week: 1,
      endWeek: 3,
      weight: 0.20,
      learningObjectives: [
        'Describe the ionic basis of the resting membrane potential',
        'Explain the sequence of voltage-gated channel events during an AP',
        'Compare graded potentials to action potentials',
        'Apply knowledge of ion channel pharmacology to clinical scenarios',
      ],
    },
    {
      id: 'unit_02',
      title: 'Unit 2: Synaptic Transmission',
      week: 4,
      endWeek: 6,
      weight: 0.25,
      learningObjectives: [
        'Describe the vesicle cycle and SNARE complex function',
        'Distinguish glutamatergic and GABAergic transmission',
        'Explain the dual-gating mechanism of NMDA receptors',
        'Apply knowledge to neurotoxin mechanisms and seizure pharmacology',
      ],
    },
    {
      id: 'unit_03',
      title: 'Unit 3: Neurotransmitter Systems',
      week: 7,
      endWeek: 9,
      weight: 0.20,
      learningObjectives: [
        'Describe cholinergic transmission at the NMJ and autonomic nervous system',
        'Name and locate the four major dopaminergic tracts',
        'Explain how antipsychotic drugs produce both therapeutic and adverse effects',
        'Apply pathway knowledge to clinical disorders (Parkinson\'s, MG, schizophrenia)',
      ],
    },
    {
      id: 'unit_04',
      title: 'Unit 4: Sensory & Motor Systems',
      week: 10,
      endWeek: 12,
      weight: 0.25,
      learningObjectives: [
        'Trace DC-ML and anterolateral pathways including decussation levels',
        'Distinguish UMN from LMN lesion signs',
        'Apply pathway knowledge to spinal cord lesion syndromes',
        'Identify lesion level from clinical deficit pattern',
      ],
    },
    {
      id: 'unit_05',
      title: 'Unit 5: Plasticity & Higher Function',
      week: 13,
      endWeek: 15,
      weight: 0.10,
      learningObjectives: [
        'Explain the cellular mechanism of LTP including NMDA and CaMKII roles',
        'Describe Hebbian plasticity and its neural implementation',
        'Apply plasticity mechanisms to Alzheimer\'s disease and stroke rehabilitation',
        'Distinguish early and late LTP in terms of protein synthesis',
      ],
    },
  ],
};
