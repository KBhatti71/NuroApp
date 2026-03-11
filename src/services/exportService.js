export function exportToMarkdown(cards) {
  try {
    return cards.map(card => `
## ${card.topic}
**Unit:** ${card.unit} | **Quiz Likelihood:** ${card.quizLikelihood}%

**Core Idea:** ${card.coreIdea}

**Key Terms:**
${(card.keyTerms || []).map(kt => `- **${kt.term}:** ${kt.definition}`).join('\n')}

**Mechanism / Pathway:**
${card.mechanism}

**Clinical Tie-In:** ${card.clinicalTieIn}

**Professor Emphasis:** ${card.professorEmphasis}

**Memory Hook:** ${card.memoryHook}

**Likely Exam Question:** ${card.likelyExamQuestion}

**Answer:** ${card.likelyExamAnswer}
`).join('\n---\n');
  } catch (err) {
    console.error('exportToMarkdown failed:', err);
    throw new Error('Failed to generate Markdown export. Some card data may be incomplete.');
  }
}

export function exportToJSON(cards) {
  return JSON.stringify(cards, null, 2);
}

export async function exportToPDF(cards, options = {}) {
  try {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'in', format: [5, 3] });

  const PAGE_W = 5;
  const PAGE_H = 3;
  const MARGIN = 0.2;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  const COLORS = {
    heading: [15, 23, 42],
    label: [100, 116, 139],
    body: [51, 65, 85],
    accent: [20, 184, 166],
    border: [226, 232, 240],
    lightBg: [248, 250, 252],
  };

  cards.forEach((card, index) => {
    if (index > 0) doc.addPage();

    // Background
    doc.setFillColor(...COLORS.lightBg);
    doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

    // Top accent bar
    doc.setFillColor(...COLORS.accent);
    doc.rect(0, 0, PAGE_W, 0.06, 'F');

    let y = 0.18;

    // Unit badge
    doc.setFontSize(5.5);
    doc.setTextColor(...COLORS.label);
    doc.text(card.unit.toUpperCase(), MARGIN, y);

    // Quiz likelihood
    const likelihoodText = `QUIZ LIKELIHOOD: ${card.quizLikelihood}%`;
    doc.text(likelihoodText, PAGE_W - MARGIN, y, { align: 'right' });

    y += 0.14;

    // Topic
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.heading);
    doc.setFont(undefined, 'bold');
    const topicLines = doc.splitTextToSize(card.topic, CONTENT_W);
    doc.text(topicLines, MARGIN, y);
    y += topicLines.length * 0.12 + 0.06;

    // Divider
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.01);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 0.08;

    // Helper to add a labeled section
    const addSection = (label, text, maxLines = 2) => {
      if (y > PAGE_H - 0.25) return;
      doc.setFontSize(5);
      doc.setTextColor(...COLORS.label);
      doc.setFont(undefined, 'bold');
      doc.text(label.toUpperCase(), MARGIN, y);
      y += 0.1;

      doc.setFontSize(6.5);
      doc.setTextColor(...COLORS.body);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(text, CONTENT_W).slice(0, maxLines);
      doc.text(lines, MARGIN, y);
      y += lines.length * 0.1 + 0.06;
    };

    addSection('Core Idea', card.coreIdea, 3);
    addSection('Key Terms', card.keyTerms.map(kt => `${kt.term}: ${kt.definition}`).join(' • '), 2);
    addSection('Mechanism', card.mechanism.split('\n').slice(0, 4).join(' '), 2);
    addSection('Clinical', card.clinicalTieIn, 2);
    addSection('Memory Hook', card.memoryHook, 1);
    addSection('Likely Question', card.likelyExamQuestion, 2);

    // Footer
    doc.setFontSize(5);
    doc.setTextColor(...COLORS.label);
    doc.text('NeuroCard AI', MARGIN, PAGE_H - 0.1);
    doc.text(card.tags.slice(0, 3).join(' · '), PAGE_W - MARGIN, PAGE_H - 0.1, { align: 'right' });
  });

  const filename = (options.filename || 'neurocard-study') + '.pdf';
  doc.save(filename);
  } catch (err) {
    console.error('exportToPDF failed:', err);
    throw new Error('Failed to generate PDF. Some card data may be incomplete.');
  }
}

export function triggerPrint(cards, course) {
  try {
  const html = `<!DOCTYPE html>
<html>
<head>
<title>NeuroCard AI — ${course?.name || 'Study Cards'}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: white; }
  .card {
    width: 7.5in; height: 4.5in;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.3in;
    margin: 0.25in auto;
    page-break-after: always;
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: #14b8a6;
  }
  .unit { font-size: 8pt; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .topic { font-size: 14pt; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .label { font-size: 7pt; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px; margin-bottom: 2px; }
  .content { font-size: 8.5pt; color: #334155; line-height: 1.4; }
  .likelihood { position: absolute; top: 0.2in; right: 0.3in; font-size: 7pt; color: #14b8a6; font-weight: 600; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }
  @media print {
    .card { margin: 0; border-radius: 0; }
  }
</style>
</head>
<body>
${cards.map(card => `
<div class="card">
  <div class="likelihood">Quiz Likelihood: ${card.quizLikelihood}%</div>
  <div class="unit">${card.unit}</div>
  <div class="topic">${card.topic}</div>
  <div class="label">Core Idea</div>
  <div class="content">${card.coreIdea}</div>
  <div class="grid">
    <div>
      <div class="label">Key Terms</div>
      <div class="content">${card.keyTerms.slice(0,3).map(kt => `<b>${kt.term}:</b> ${kt.definition}`).join('<br>')}</div>
    </div>
    <div>
      <div class="label">Clinical Tie-In</div>
      <div class="content">${card.clinicalTieIn.slice(0, 200)}${card.clinicalTieIn.length > 200 ? '...' : ''}</div>
    </div>
  </div>
  <div class="label">Memory Hook</div>
  <div class="content">${card.memoryHook}</div>
  <div class="label">Likely Exam Question</div>
  <div class="content">${card.likelyExamQuestion}</div>
</div>
`).join('')}
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) throw new Error('Pop-up blocked. Please allow pop-ups to use Print.');
  win.document.write(html);
  win.document.close();
  win.onload = () => win.print();
  } catch (err) {
    console.error('triggerPrint failed:', err);
    throw err;
  }
}
