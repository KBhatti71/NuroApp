import { v4 as uuidv4 } from 'uuid';
import * as pdfjsLib from 'pdfjs-dist';

// Point the worker at the bundled worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

export const SOURCE_TYPE_LABELS = {
  quiz: 'Quiz / Assessment',
  syllabus: 'Syllabus',
  transcript: 'Lecture Transcript',
  slides: 'Slides / PowerPoint',
  study_guide: 'Study Guide',
  notes: 'Notes',
  textbook: 'Textbook',
  web: 'Web / Online Book',
};

export const SOURCE_WEIGHTS = {
  quiz:        1.00,
  syllabus:    0.90,
  transcript:  0.85,
  slides:      0.75,
  study_guide: 0.75,
  notes:       0.50,
  textbook:    0.35,
  web:         0.20,
};

export const SOURCE_TYPE_COLORS = {
  quiz: '#6366f1',
  syllabus: '#8b5cf6',
  transcript: '#0ea5e9',
  slides: '#10b981',
  study_guide: '#14b8a6',
  notes: '#f59e0b',
  textbook: '#6b7280',
  web: '#9ca3af',
};

function inferSourceType(filename) {
  const lower = filename.toLowerCase();
  if (/quiz|exam|test|midterm|final/.test(lower)) return 'quiz';
  if (/syllabus|schedule|overview/.test(lower)) return 'syllabus';
  if (/transcript|lecture|recording/.test(lower)) return 'transcript';
  if (/slide|ppt|powerpoint/.test(lower)) return 'slides';
  if (/study.?guide|review|prep/.test(lower)) return 'study_guide';
  if (/note|handout/.test(lower)) return 'notes';
  if (/textbook|chapter|book/.test(lower)) return 'textbook';
  if (/web|online|article/.test(lower)) return 'web';
  return null;
}

export async function parseFileContent(file) {
  const text = file.type === 'application/pdf'
    ? await readPdfAsText(file)
    : await readFileAsText(file);
  const inferredType = inferSourceType(file.name);
  return {
    id: uuidv4(),
    name: file.name,
    type: inferredType || 'notes',
    content: cleanText(text),
    uploadedAt: new Date().toISOString(),
    weight: SOURCE_WEIGHTS[inferredType] || SOURCE_WEIGHTS.notes,
    unitId: null,
    tokenCount: estimateTokens(text),
    needsTypeConfirmation: !inferredType,
  };
}

export function parseTextContent(name, rawText, type = 'notes') {
  const isHtml = type === 'web' || /<[a-z][\s\S]*>/i.test(rawText);
  const content = cleanText(rawText, isHtml);
  return {
    id: uuidv4(),
    name,
    type,
    content,
    uploadedAt: new Date().toISOString(),
    weight: SOURCE_WEIGHTS[type],
    unitId: null,
    tokenCount: estimateTokens(content),
    needsTypeConfirmation: false,
  };
}

async function readPdfAsText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pageTexts.push(content.items.map((item) => item.str).join(' '));
  }
  return pageTexts.join('\n\n');
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function stripHtml(text) {
  // Remove script/style blocks entirely
  return text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    // Strip remaining HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function cleanText(text, isHtml = false) {
  const raw = isHtml ? stripHtml(text) : text;
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, '  ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

function estimateTokens(text) {
  return Math.round(text.split(/\s+/).length * 1.3);
}
