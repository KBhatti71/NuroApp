/**
 * triggerSessionPrint — opens a formatted print window for a session's analysis.
 *
 * Renders sections, key takeaways, sources, and follow-up questions into a
 * clean, readable document suited for printing or saving as PDF.
 *
 * @param {object} session - Session object { title, type, rawText, analysis }
 */
export function triggerSessionPrint(session) {
  const { title = 'Session', analysis } = session;
  if (!analysis) throw new Error('Session has not been analysed yet.');

  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const sectionsHtml = (analysis.sections ?? []).map(sec => `
    <section class="section">
      <h2>${esc(sec.title)}</h2>
      <p class="section-summary">${esc(sec.summary)}</p>
      ${(sec.keyPoints ?? []).length ? `<ul>${sec.keyPoints.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      ${(sec.relatedConcepts ?? []).length
        ? `<div class="tags">${sec.relatedConcepts.map(c => `<span class="tag">${esc(c)}</span>`).join('')}</div>`
        : ''}
    </section>`).join('');

  const takeawaysHtml = (analysis.keyTakeaways ?? []).map((t, i) =>
    `<li><b>${i + 1}.</b> ${esc(t)}</li>`).join('');

  const enrichmentHtml = (analysis.enrichment ?? []).map(e => `
    <div class="enrich-block">
      <h4>${esc(e.concept)}</h4>
      <p>${esc(e.background)}</p>
      ${(e.keyFacts ?? []).length ? `<ul class="facts">${e.keyFacts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
      ${(e.suggestedSources ?? []).map(s =>
        `<div class="source">
          <span class="source-type">${esc(s.type)}</span>
          ${s.url ? `<a href="${esc(s.url)}" target="_blank">${esc(s.title)}</a>` : `<span>${esc(s.title)}</span>`}
          <span class="source-relevance"> — ${esc(s.relevance)}</span>
        </div>`).join('')}
      ${(e.searchTerms ?? []).length
        ? `<p class="search-terms"><b>Search:</b> ${e.searchTerms.map(t => `"${esc(t)}"`).join(', ')}</p>`
        : ''}
    </div>`).join('');

  const followUpHtml = (analysis.followUpQuestions ?? []).map((q, i) => `
    <div class="followup">
      <p class="followup-q"><b>${i + 1}.</b> ${esc(q.question)}</p>
      <p class="followup-why">${esc(q.why)}</p>
      ${(q.searchTerms ?? []).length
        ? `<p class="search-terms"><b>Search:</b> ${q.searchTerms.map(t => `"${esc(t)}"`).join(', ')}</p>`
        : ''}
    </div>`).join('');

  const crossRefHtml = (analysis.crossReferences ?? []).map(r => `
    <tr>
      <td>${esc(r.from)}</td>
      <td>↔</td>
      <td>${esc(r.to)}</td>
      <td>${esc(r.relationship)}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', 'Times New Roman', serif; color: #1a202c; background: white; padding: 0.75in; max-width: 8.5in; margin: 0 auto; font-size: 11pt; line-height: 1.6; }
  h1 { font-size: 20pt; color: #0f172a; border-bottom: 3px solid #6366f1; padding-bottom: 8px; margin-bottom: 4px; }
  .meta { font-size: 9pt; color: #64748b; margin-bottom: 24px; font-family: system-ui, sans-serif; }
  h2 { font-size: 13pt; color: #1e293b; margin: 20px 0 6px; border-left: 3px solid #6366f1; padding-left: 10px; font-family: system-ui, sans-serif; }
  h3 { font-size: 11pt; color: #334155; margin: 16px 0 6px; font-family: system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.04em; font-size: 9pt; }
  h4 { font-size: 10.5pt; color: #1e293b; margin: 12px 0 4px; font-family: system-ui, sans-serif; }
  p { margin-bottom: 6px; }
  ul { margin: 6px 0 6px 20px; }
  li { margin-bottom: 3px; }
  .summary-box { background: #f0f4ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 14px 16px; margin-bottom: 24px; }
  .summary-box p { margin: 0; }
  .section { margin-bottom: 20px; }
  .section-summary { color: #475569; font-style: italic; margin-bottom: 6px; }
  .tags { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px; }
  .tag { background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 12px; font-size: 8.5pt; font-family: system-ui, sans-serif; }
  .takeaways-list { list-style: none; padding: 0; }
  .takeaways-list li { padding: 6px 0; border-bottom: 1px solid #e2e8f0; }
  .takeaways-list li:last-child { border-bottom: none; }
  .enrich-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
  .facts { margin: 6px 0 6px 16px; font-size: 10pt; }
  .source { font-size: 9.5pt; margin: 4px 0; font-family: system-ui, sans-serif; }
  .source-type { background: #dbeafe; color: #1d4ed8; padding: 1px 6px; border-radius: 4px; font-size: 8pt; margin-right: 4px; text-transform: uppercase; }
  .source a { color: #4f46e5; }
  .source-relevance { color: #64748b; }
  .search-terms { font-size: 9pt; color: #64748b; margin-top: 6px; font-family: system-ui, sans-serif; }
  .followup { border-left: 3px solid #f59e0b; padding-left: 12px; margin-bottom: 14px; }
  .followup-q { font-weight: 600; margin-bottom: 3px; }
  .followup-why { color: #64748b; font-size: 10pt; }
  table { width: 100%; border-collapse: collapse; font-size: 10pt; }
  td { padding: 5px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  td:nth-child(2) { color: #6366f1; font-weight: bold; width: 24px; text-align: center; }
  .page-break { page-break-before: always; }
  @media print {
    body { padding: 0.5in; }
    a { text-decoration: none; color: inherit; }
  }
</style>
</head>
<body>

<h1>${esc(title)}</h1>
<div class="meta">Generated by NuroApp · ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>

${analysis.summary ? `<div class="summary-box"><p>${esc(analysis.summary)}</p></div>` : ''}

${takeawaysHtml ? `<h3>Key Takeaways</h3><ol class="takeaways-list">${takeawaysHtml}</ol>` : ''}

${sectionsHtml ? `<h3 style="margin-top:24px">Content Sections</h3>${sectionsHtml}` : ''}

${crossRefHtml ? `<h3 style="margin-top:24px">Concept Cross-References</h3><table>${crossRefHtml}</table>` : ''}

${enrichmentHtml ? `<div class="page-break"></div><h3>Background Context &amp; Sources</h3><p style="color:#64748b;font-size:9.5pt;margin-bottom:12px;font-family:system-ui,sans-serif">AI-suggested sources — verify before citing.</p>${enrichmentHtml}` : ''}

${followUpHtml ? `<h3 style="margin-top:24px">Follow-Up Questions for Deeper Learning</h3>${followUpHtml}` : ''}

</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) throw new Error('Pop-up blocked. Please allow pop-ups to use Print.');
  win.document.write(html);
  win.document.close();
  win.onload = () => win.print();
}

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
    doc.text((card.unit ?? '').toUpperCase(), MARGIN, y);

    // Quiz likelihood
    const likelihoodText = `QUIZ LIKELIHOOD: ${card.quizLikelihood ?? 0}%`;
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

    addSection('Core Idea', card.coreIdea ?? '', 3);
    addSection('Key Terms', (card.keyTerms ?? []).map(kt => `${kt.term}: ${kt.definition}`).join(' • '), 2);
    addSection('Mechanism', (card.mechanism ?? '').split('\n').slice(0, 4).join(' '), 2);
    addSection('Clinical', card.clinicalTieIn ?? '', 2);
    addSection('Memory Hook', card.memoryHook ?? '', 1);
    addSection('Likely Question', card.likelyExamQuestion ?? '', 2);

    // Footer
    doc.setFontSize(5);
    doc.setTextColor(...COLORS.label);
    doc.text('NeuroCard AI', MARGIN, PAGE_H - 0.1);
    doc.text((card.tags ?? []).slice(0, 3).join(' · '), PAGE_W - MARGIN, PAGE_H - 0.1, { align: 'right' });
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
${cards.map(card => {
  const clinical = card.clinicalTieIn ?? '';
  return `
<div class="card">
  <div class="likelihood">Quiz Likelihood: ${card.quizLikelihood ?? 0}%</div>
  <div class="unit">${card.unit ?? ''}</div>
  <div class="topic">${card.topic ?? ''}</div>
  <div class="label">Core Idea</div>
  <div class="content">${card.coreIdea ?? ''}</div>
  <div class="grid">
    <div>
      <div class="label">Key Terms</div>
      <div class="content">${(card.keyTerms ?? []).slice(0,3).map(kt => `<b>${kt.term}:</b> ${kt.definition}`).join('<br>')}</div>
    </div>
    <div>
      <div class="label">Clinical Tie-In</div>
      <div class="content">${clinical.slice(0, 200)}${clinical.length > 200 ? '...' : ''}</div>
    </div>
  </div>
  <div class="label">Memory Hook</div>
  <div class="content">${card.memoryHook ?? ''}</div>
  <div class="label">Likely Exam Question</div>
  <div class="content">${card.likelyExamQuestion ?? ''}</div>
</div>
`;}).join('')}
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
