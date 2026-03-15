export const workCourse = {
  id: 'course_work',
  name: 'Professional Development: AI Ethics',
  professor: 'Dr. Michael Torres',
  institution: 'Tech Ethics Institute',
  semester: 'Ongoing',
  examDate: null,
  createdAt: '2026-02-01T00:00:00Z',
};

export const workCourseMap = {
  totalWeeks: 12,
  examTopics: [
    'AI bias and fairness',
    'Privacy and data protection',
    'Algorithmic accountability',
    'Ethical AI deployment',
    'Regulatory compliance',
  ],
  units: [
    {
      id: 'unit_work_01',
      title: 'Unit 1: Introduction to AI Ethics',
      week: 1,
      endWeek: 2,
      weight: 0.15,
      learningObjectives: [
        'Define key ethical principles in AI development',
        'Identify potential biases in AI systems',
        'Understand the importance of ethical AI',
      ],
    },
    {
      id: 'unit_work_02',
      title: 'Unit 2: Bias and Fairness',
      week: 3,
      endWeek: 4,
      weight: 0.20,
      learningObjectives: [
        'Explain sources of bias in training data',
        'Apply fairness metrics to AI models',
        'Implement bias mitigation techniques',
      ],
    },
    {
      id: 'unit_work_03',
      title: 'Unit 3: Privacy and Security',
      week: 5,
      endWeek: 6,
      weight: 0.20,
      learningObjectives: [
        'Understand data privacy regulations',
        'Implement secure AI practices',
        'Handle sensitive data ethically',
      ],
    },
    {
      id: 'unit_work_04',
      title: 'Unit 4: Accountability and Transparency',
      week: 7,
      endWeek: 8,
      weight: 0.20,
      learningObjectives: [
        'Explain algorithmic accountability',
        'Create transparent AI systems',
        'Document AI decision processes',
      ],
    },
    {
      id: 'unit_work_05',
      title: 'Unit 5: Deployment and Regulation',
      week: 9,
      endWeek: 12,
      weight: 0.25,
      learningObjectives: [
        'Navigate AI regulatory frameworks',
        'Conduct ethical impact assessments',
        'Ensure compliance in AI deployment',
      ],
    },
  ],
};