import { demoCourseMap } from '../../data/courses';

export function buildCourseMap(sources) {
  const syllabusSources = sources.filter(s => s.type === 'syllabus');

  if (syllabusSources.length === 0) {
    // Return a default structure if no syllabus uploaded
    return mockCourseMap;
  }

  const fullText = syllabusSources.map(s => s.content).join('\n\n');
  const units = extractUnits(fullText);
  const examTopics = extractExamTopics(fullText);

  if (units.length === 0) {
    return mockCourseMap;
  }

  return {
    totalWeeks: Math.max(...units.map(u => u.endWeek || u.week), 15),
    examTopics,
    units,
  };
}

function extractUnits(text) {
  const unitPatterns = [
    /^(Unit|Module|Chapter|Week|Section)\s+(\d+)[:\s—]+(.+)$/gim,
    /^(\d+)\.\s+(.+)$/gim,
  ];

  const units = [];
  let unitNum = 1;

  for (const pattern of unitPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const title = (match[3] || match[2] || '').trim().replace(/\s+/g, ' ');
      if (title.length > 3 && title.length < 100) {
        const objectives = extractObjectivesNear(text, match.index);
        units.push({
          id: `unit_${String(unitNum).padStart(2, '0')}`,
          title: `Unit ${unitNum}: ${title}`,
          week: unitNum,
          endWeek: unitNum + 2,
          weight: 0.2,
          learningObjectives: objectives,
        });
        unitNum++;
      }
    }
    if (units.length > 0) break;
  }

  return units;
}

function extractObjectivesNear(text, startIdx) {
  const segment = text.slice(startIdx, startIdx + 800);
  const objectivePatterns = [
    /(?:Students will|By the end|You will|Learners will)\s+(.+?)(?:\n|$)/gi,
    /(?:Describe|Explain|Identify|Compare|Apply|Analyze|Understand)\s+(.+?)(?:\n|$)/gi,
  ];

  const objectives = [];
  for (const pattern of objectivePatterns) {
    let match;
    while ((match = pattern.exec(segment)) !== null) {
      const obj = match[0].trim();
      if (obj.length > 10 && obj.length < 200) {
        objectives.push(obj);
      }
    }
    if (objectives.length >= 3) break;
  }

  return objectives.slice(0, 5);
}

function extractExamTopics(text) {
  const topics = [];
  const examSection = text.match(/(?:exam|test|quiz)\s+(?:topic|content|coverage)[:\s]+([^]*?)(?:\n\n|\n[A-Z]|$)/i);
  if (examSection) {
    const items = examSection[1].split(/\n|•|-|\*/).map(s => s.trim()).filter(s => s.length > 5);
    topics.push(...items.slice(0, 10));
  }
  return topics;
}
