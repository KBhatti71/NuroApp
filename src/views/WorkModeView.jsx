import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppContext } from '../hooks/useAppContext';
import { useToast } from '../components/ui/useToast';
import { ACTIONS } from '../context/actions';
import { SESSION_TYPE, SESSION_TYPE_META, APP_MODE, getImportanceTier } from '../constants/modes';
import { analyzeMeeting } from '../services/ai/meetingAnalyzer';
import { triggerSessionPrint } from '../services/exportService';
import ImportanceBadge from '../components/intelligence/ImportanceBadge';
import MomentCard from '../components/intelligence/MomentCard';
import Spinner from '../components/ui/Spinner';

function meetingItemsToCards(analysis, session) {
  const cards = [];

  for (const item of (analysis.actionItems ?? [])) {
    if (!item.task) continue;
    const meta = [
      item.owner && `Owner: ${item.owner}`,
      item.deadline && `Due: ${item.deadline}`,
      item.urgency && `Urgency: ${item.urgency}`,
    ].filter(Boolean).join(' · ');

    cards.push({
      id: uuid(),
      unitId: null,
      topic: `${session.title}: Action Item`,
      coreIdea: meta || 'No owner or deadline specified.',
      keyTerms: [],
      mechanism: '',
      clinicalTieIn: '',
      professorEmphasis: '',
      memoryHook: '',
      likelyExamQuestion: item.task,
      likelyExamAnswer: meta || 'See meeting notes.',
      quizLikelihood: Math.round(item.importance ?? 60) / 100,
      pinned: item.committed ?? false,
      tags: [session.type, 'work', 'action-item'],
      sourceReferences: [session.id],
      createdAt: new Date().toISOString(),
      studyModeVariants: { professorWording: item.task, examCram: meta },
    });
  }

  for (const d of (analysis.decisions ?? [])) {
    if (!d.text) continue;
    const detail = [
      `Status: ${d.status}`,
      d.support?.length && `Support: ${d.support.join(', ')}`,
    ].filter(Boolean).join(' · ');

    cards.push({
      id: uuid(),
      unitId: null,
      topic: `${session.title}: Decision`,
      coreIdea: detail,
      keyTerms: [],
      mechanism: '',
      clinicalTieIn: '',
      professorEmphasis: '',
      memoryHook: '',
      likelyExamQuestion: d.text,
      likelyExamAnswer: detail,
      quizLikelihood: Math.round(d.importance ?? 60) / 100,
      pinned: false,
      tags: [session.type, 'work', 'decision'],
      sourceReferences: [session.id],
      createdAt: new Date().toISOString(),
      studyModeVariants: { professorWording: d.text, examCram: detail },
    });
  }

  return cards;
}

const WORK_SESSION_TYPES = Object.entries(SESSION_TYPE_META)
  .filter(([, meta]) => meta.mode === APP_MODE.WORK)
  .map(([id, meta]) => ({ id, ...meta }));

const URGENCY_STYLE = {
  urgent: 'bg-danger-50 text-danger-400 border-danger-100',
  normal: 'bg-primary-50 text-primary-700 border-primary-200',
  low:    'bg-surface-100 text-ink-500 border-surface-200',
};

const SENTIMENT_ICON = {
  supportive: { icon: '\u2705', color: 'text-emerald-600' },
  neutral:    { icon: '\u2796', color: 'text-ink-500' },
  concerned:  { icon: '\u26a0', color: 'text-amber-600' },
  opposed:    { icon: '\u{1f6ab}', color: 'text-red-600' },
};

function NewSessionForm({ onCreate, collapsed, onToggle, analysisSettings, onUpdateSettings }) {
  const [title, setTitle]     = useState('');
  const [type, setType]       = useState(SESSION_TYPE.MEETING);
  const [rawText, setRawText] = useState('');
  const settings = analysisSettings ?? {};

  const handleCreate = () => {
    if (!rawText.trim()) return;
    onCreate({ title: title || type, type, rawText });
    setTitle(''); setType(SESSION_TYPE.MEETING); setRawText('');
  };

  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-3 surface-card text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors rounded-xl border border-primary-200/60"
      >
        <span className="text-base">+</span> New Session
      </button>
    );
  }

  return (
    <div className="surface-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Capture a new session</h3>
        {onToggle && (
          <button onClick={onToggle} className="text-xs text-ink-400 hover:text-ink-600">
            ✕ Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-ink-500 font-medium block mb-1">Title (optional)</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Q2 Planning Sync"
            className="w-full px-3 py-2 text-sm border border-surface-200/70 rounded-xl bg-surface-50/80 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div>
          <label className="text-xs text-ink-500 font-medium block mb-1">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200/70 rounded-xl bg-surface-50/80 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {WORK_SESSION_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-ink-500 font-medium block mb-1">
          Paste transcript, notes, or meeting summary
        </label>
        <textarea
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          placeholder="Paste your meeting transcript or notes here..."
          rows={6}
          className="w-full px-3 py-2 text-sm border border-surface-200/70 rounded-xl bg-surface-50/80 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y font-mono"
        />
      </div>

      <div className="surface-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-ink-700">Concise mode</label>
          <input
            type="checkbox"
            checked={settings.conciseMode ?? true}
            onChange={e => onUpdateSettings?.({ conciseMode: e.target.checked })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-ink-500 font-medium block mb-1">Chunk weight</label>
            <input
              type="number"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.chunkImportanceWeight ?? 1}
              onChange={e => onUpdateSettings?.({ chunkImportanceWeight: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs border border-surface-200/70 rounded-lg bg-surface-50/80 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="text-[11px] text-ink-500 font-medium block mb-1">Emphasis weight</label>
            <input
              type="number"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.emphasisWeight ?? 1}
              onChange={e => onUpdateSettings?.({ emphasisWeight: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs border border-surface-200/70 rounded-lg bg-surface-50/80 focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={!rawText.trim()}
        className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {'\u{1f4bc}'} Analyze Session
      </button>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function EnrichmentList({ enrichment }) {
  if (!(enrichment ?? []).length) return null;
  return (
    <div className="space-y-3">
      {enrichment.map((e, i) => (
        <div key={i} className="surface-card p-4 space-y-2">
          <h4 className="text-sm font-semibold text-ink-900">{e.concept}</h4>
          <p className="text-sm text-ink-700 leading-relaxed">{e.background}</p>
          {(e.keyFacts ?? []).length > 0 && (
            <ul className="space-y-1 mt-1">
              {e.keyFacts.map((f, j) => (
                <li key={j} className="text-xs text-ink-600 flex gap-2">
                  <span className="text-primary-500 shrink-0">·</span> {f}
                </li>
              ))}
            </ul>
          )}
          {(e.suggestedSources ?? []).length > 0 && (
            <div className="space-y-1 pt-1">
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Sources</p>
              {e.suggestedSources.map((s, j) => (
                <div key={j} className="flex items-start gap-2 text-xs">
                  <span className="bg-primary-50 text-primary-700 border border-primary-200/60 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase shrink-0">
                    {s.type}
                  </span>
                  <span className="flex-1 min-w-0">
                    {s.url
                      ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-medium">{s.title}</a>
                      : <span className="font-medium text-ink-800">{s.title}</span>
                    }
                    {s.relevance && <span className="text-ink-500"> — {s.relevance}</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
          {(e.searchTerms ?? []).length > 0 && (
            <p className="text-xs text-ink-400 pt-1">
              <span className="font-medium text-ink-500">Search: </span>
              {e.searchTerms.map((t, j) => (
                <span key={j}>"{t}"{j < e.searchTerms.length - 1 ? ', ' : ''}</span>
              ))}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function FollowUpQuestionsList({ questions }) {
  if (!(questions ?? []).length) return (
    <p className="text-sm text-ink-400 text-center py-6">No follow-up questions generated.</p>
  );
  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={i} className="border-l-2 border-primary-400 pl-4 py-1 space-y-1">
          <p className="text-sm font-semibold text-ink-900">{i + 1}. {q.question}</p>
          {q.why && <p className="text-xs text-ink-500 leading-relaxed">{q.why}</p>}
          {(q.searchTerms ?? []).length > 0 && (
            <p className="text-xs text-ink-400">
              <span className="font-medium text-ink-500">Search: </span>
              {q.searchTerms.map((t, j) => (
                <span key={j}>"{t}"{j < q.searchTerms.length - 1 ? ', ' : ''}</span>
              ))}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function CrossRefList({ crossReferences }) {
  if (!(crossReferences ?? []).length) return null;
  return (
    <div className="surface-card p-4">
      <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">Topic Cross-References</h4>
      <div className="space-y-2">
        {crossReferences.map((r, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className="font-semibold text-primary-700 shrink-0">{r.from}</span>
            <span className="text-ink-400 shrink-0">↔</span>
            <span className="font-semibold text-primary-700 shrink-0">{r.to}</span>
            <span className="text-ink-500 leading-relaxed">— {r.relationship}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Session Analysis Panel ───────────────────────────────────────────────────

function SessionPanel({ session, dispatch, toast }) {
  const { analysis, analysisError, rawText } = session;
  const [tab, setTab] = useState('overview');
  const [saved, setSaved] = useState(false);

  const handleSaveToDeck = () => {
    const cards = meetingItemsToCards(analysis, session);
    if (cards.length === 0) return;
    dispatch({ type: ACTIONS.ADD_CARDS, payload: cards });
    setSaved(true);
    toast(`${cards.length} item${cards.length !== 1 ? 's' : ''} saved to your deck`, 'success');
  };

  if (analysisError) {
    return (
      <div className="p-4 bg-danger-50 border border-danger-100 rounded-xl text-sm text-danger-400">
        Analysis failed: {analysisError}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-32 gap-2 text-ink-400">
        <Spinner size="sm" /> Analyzing...
      </div>
    );
  }

  const itemCount = (analysis.actionItems ?? []).length + (analysis.decisions ?? []).length;
  const hasResearch = (analysis.enrichment ?? []).length > 0
    || (analysis.followUpQuestions ?? []).length > 0
    || (analysis.crossReferences ?? []).length > 0;

  const handlePrint = () => {
    try { triggerSessionPrint(session); }
    catch (err) { toast(err.message, 'error'); }
  };

  const tabs = [
    { id: 'overview',      label: '\u{1f4cb} Overview' },
    { id: 'actions',       label: `\u{1f525} Actions${(analysis.actionItems ?? []).length ? ` (${(analysis.actionItems ?? []).length})` : ''}` },
    { id: 'decisions',     label: '\u2696 Decisions' },
    { id: 'stakeholders',  label: '\u{1f465} People' },
    { id: 'moments',       label: '\u26a1 Moments' },
    { id: 'followups',     label: '\u{1f4cc} Follow-ups' },
    hasResearch && { id: 'research', label: '\u{1f310} Research' },
    { id: 'notes',         label: '\u{1f4dd} Notes' },
  ].filter(Boolean);

  return (
    <div className="space-y-0">
      {/* Header row: title + action buttons */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-sm font-semibold text-ink-800 truncate">{session.title}</h3>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-surface-100 text-ink-600 border border-surface-200/70 rounded-lg text-xs font-semibold hover:bg-surface-200 transition-colors"
          >
            {'\u{1f5a8}'} Export
          </button>
          {itemCount > 0 && (
            <button
              onClick={handleSaveToDeck}
              disabled={saved}
              className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saved ? '✓ Saved' : `\u{1f4bc} Save ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap border-b border-surface-200/70 mb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-medium rounded-t-xl transition-colors
              ${tab === t.id
                ? 'bg-surface-0 border border-surface-200/70 border-b-surface-0 -mb-px text-primary-700'
                : 'text-ink-500 hover:text-ink-900'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview: summary + key stats */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-primary-50/80 border border-primary-200/70 rounded-xl p-4">
            <p className="text-sm text-primary-900 leading-relaxed">{analysis.summary}</p>
          </div>

          {analysis.speakerStyle && (
            <div className="surface-card p-4">
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Speaker Style</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {analysis.speakerStyle.tone && (
                  <span className="px-2 py-0.5 bg-surface-50 border border-surface-200/70 rounded-full text-ink-600">
                    Tone: {analysis.speakerStyle.tone}
                  </span>
                )}
                {analysis.speakerStyle.pace && (
                  <span className="px-2 py-0.5 bg-surface-50 border border-surface-200/70 rounded-full text-ink-600">
                    Pace: {analysis.speakerStyle.pace}
                  </span>
                )}
                {analysis.speakerStyle.structure && (
                  <span className="px-2 py-0.5 bg-surface-50 border border-surface-200/70 rounded-full text-ink-600">
                    Structure: {analysis.speakerStyle.structure}
                  </span>
                )}
              </div>
              {(analysis.speakerStyle.emphasisSignals ?? []).length > 0 && (
                <ul className="space-y-1 mt-3">
                  {analysis.speakerStyle.emphasisSignals.map((s, i) => (
                    <li key={i} className="text-xs text-ink-600 flex gap-2">
                      <span className="text-primary-500 shrink-0">Â·</span> {s}
                    </li>
                  ))}
                </ul>
              )}
              {(analysis.speakerStyle.dominantSignals ?? []).length > 0 && (
                <ul className="space-y-1 mt-3">
                  {analysis.speakerStyle.dominantSignals.map((s, i) => (
                    <li key={i} className="text-xs text-ink-600 flex gap-2">
                      <span className="text-primary-500 shrink-0">Â·</span> {s}
                    </li>
                  ))}
                </ul>
              )}
              {analysis.speakerStyle.confidence != null && (
                <p className="text-[11px] text-ink-500 mt-2">
                  Confidence: {Math.round(analysis.speakerStyle.confidence * 100)}%
                </p>
              )}
            </div>
          )}

          {/* Quick-glance stats */}
          {(itemCount > 0 || (analysis.stakeholders ?? []).length > 0) && (
            <div className="grid grid-cols-3 gap-3">
              {(analysis.actionItems ?? []).length > 0 && (
                <div className="surface-card p-3 text-center">
                  <div className="text-2xl font-bold text-primary-700">{(analysis.actionItems ?? []).length}</div>
                  <div className="text-xs text-ink-500 mt-0.5">Action Items</div>
                </div>
              )}
              {(analysis.decisions ?? []).length > 0 && (
                <div className="surface-card p-3 text-center">
                  <div className="text-2xl font-bold text-primary-700">{(analysis.decisions ?? []).length}</div>
                  <div className="text-xs text-ink-500 mt-0.5">Decisions</div>
                </div>
              )}
              {(analysis.stakeholders ?? []).length > 0 && (
                <div className="surface-card p-3 text-center">
                  <div className="text-2xl font-bold text-primary-700">{(analysis.stakeholders ?? []).length}</div>
                  <div className="text-xs text-ink-500 mt-0.5">People</div>
                </div>
              )}
            </div>
          )}

          {/* Urgent action items callout */}
          {(analysis.actionItems ?? []).filter(a => a.urgency === 'urgent').length > 0 && (
            <div className="surface-card p-4">
              <h4 className="text-xs font-semibold text-danger-400 uppercase tracking-wider mb-3">
                {'\u{1f6a8}'} Urgent Actions
              </h4>
              <ul className="space-y-1.5">
                {(analysis.actionItems ?? [])
                  .filter(a => a.urgency === 'urgent')
                  .map((a, i) => (
                    <li key={i} className="text-sm text-ink-800 flex gap-2">
                      <span className="text-danger-400 shrink-0">·</span>
                      <span>
                        <span className="font-medium">{a.task}</span>
                        {a.owner && <span className="text-ink-500"> — {a.owner}</span>}
                      </span>
                    </li>
                  ))
                }
              </ul>
            </div>
          )}

          {/* Logical sections from meeting notes */}
          {(analysis.sections ?? []).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Meeting Topics</h4>
              {analysis.sections.map((sec, i) => (
                <div key={i} className="surface-card p-4 space-y-2">
                  <h5 className="text-sm font-semibold text-ink-900">{sec.title}</h5>
                  {sec.summary && <p className="text-xs text-ink-500 italic leading-relaxed">{sec.summary}</p>}
                  {(sec.keyPoints ?? []).length > 0 && (
                    <ul className="space-y-1 mt-1">
                      {sec.keyPoints.map((p, j) => (
                        <li key={j} className="text-sm text-ink-700 flex gap-2">
                          <span className="text-primary-500 shrink-0">·</span> {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  {(sec.relatedConcepts ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {sec.relatedConcepts.map((c, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 bg-primary-50 text-primary-700 border border-primary-200/60 rounded-full font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <CrossRefList crossReferences={analysis.crossReferences} />
        </div>
      )}

      {tab === 'actions' && (
        <div className="space-y-2">
          {(analysis.actionItems ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No action items detected.</p>
            : (analysis.actionItems ?? []).map((a, i) => (
                <div key={i} className={`border rounded-xl p-4 space-y-1 ${URGENCY_STYLE[a.urgency] ?? URGENCY_STYLE.normal}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{a.task}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {a.committed && (
                        <span className="text-xs bg-success-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-success-100">
                          Committed
                        </span>
                      )}
                      <ImportanceBadge score={a.importance ?? 60} compact />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs opacity-80">
                    {a.owner && <span>{'\u{1f464}'} {a.owner}</span>}
                    {a.deadline && <span>{'\u{1f4c5}'} {a.deadline}</span>}
                    <span className="capitalize font-medium">{a.urgency}</span>
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {tab === 'decisions' && (
        <div className="space-y-3">
          {(analysis.decisions ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No decisions detected.</p>
            : (analysis.decisions ?? []).map((d, i) => (
                <div key={i} className="border border-surface-200/70 rounded-xl p-4 space-y-3 bg-surface-0/80">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink-900">{d.text}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border
                        ${d.status === 'decided'  ? 'bg-success-50 text-emerald-700 border-success-100' :
                          d.status === 'blocked'  ? 'bg-danger-50 text-danger-400 border-danger-100' :
                          'bg-warn-50 text-amber-700 border-warn-100'}`}>
                        {d.status}
                      </span>
                      <ImportanceBadge score={d.importance ?? 60} compact />
                    </div>
                  </div>
                  {(d.support?.length > 0 || d.concerns?.length > 0) && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {d.support?.length > 0 && (
                        <div>
                          <span className="text-emerald-600 font-semibold block mb-1">{'\u2705'} Support</span>
                          {d.support.map((s, j) => <div key={j} className="text-ink-600">{s}</div>)}
                        </div>
                      )}
                      {d.concerns?.length > 0 && (
                        <div>
                          <span className="text-amber-600 font-semibold block mb-1">{'\u26a0'} Concerns</span>
                          {d.concerns.map((c, j) => <div key={j} className="text-ink-600">{c}</div>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
          }
        </div>
      )}

      {tab === 'stakeholders' && (
        <div className="space-y-2">
          {(analysis.stakeholders ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No stakeholders identified.</p>
            : (analysis.stakeholders ?? []).map((s, i) => {
                const sent = SENTIMENT_ICON[s.sentiment] ?? SENTIMENT_ICON.neutral;
                return (
                  <div key={i} className="flex gap-3 items-start border border-surface-200/70 rounded-xl p-3 bg-surface-0/80">
                    <span className="text-xl">{sent.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink-900">{s.name}</span>
                        <span className={`text-xs font-medium capitalize ${sent.color}`}>{s.sentiment}</span>
                        {s.confidence != null && (
                          <span className="text-xs text-ink-400 ml-auto">
                            {Math.round(s.confidence * 100)}% confidence
                          </span>
                        )}
                      </div>
                      {s.keyQuote && (
                        <p className="text-xs text-ink-500 mt-1 italic">"{s.keyQuote}"</p>
                      )}
                    </div>
                  </div>
                );
              })
          }
        </div>
      )}

      {tab === 'moments' && (
        <div className="space-y-2">
          {(analysis.importantMoments ?? analysis.criticalMoments ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No critical moments detected.</p>
            : (analysis.importantMoments ?? analysis.criticalMoments ?? []).map((m, i) => (
                <MomentCard key={i} moment={m} school={false} />
              ))
          }
        </div>
      )}

      {tab === 'followups' && (
        <div className="space-y-2">
          {(analysis.followUps ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No follow-ups needed.</p>
            : (analysis.followUps ?? []).map((f, i) => (
                <div key={i} className={`border rounded-xl p-3 flex gap-3 ${URGENCY_STYLE[f.priority] ?? URGENCY_STYLE.normal}`}>
                  <span className="text-sm font-bold shrink-0">
                    {f.priority === 'urgent' ? '\u{1f6a8}' : '\u{1f4cc}'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{f.topic}</p>
                    {f.person && <p className="text-xs mt-0.5">{'\u2192'} {f.person}</p>}
                    {f.context && <p className="text-xs opacity-70 mt-0.5">{f.context}</p>}
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {tab === 'research' && (
        <div className="space-y-5">
          {(analysis.enrichment ?? []).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
                {'\u{1f4da}'} Background Context &amp; Sources
              </h4>
              <p className="text-xs text-ink-400 mb-3">
                AI-suggested sources from training knowledge — verify before sharing externally.
              </p>
              <EnrichmentList enrichment={analysis.enrichment} />
            </div>
          )}

          {(analysis.followUpQuestions ?? []).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
                {'\u{1f50d}'} Open Questions to Investigate
              </h4>
              <FollowUpQuestionsList questions={analysis.followUpQuestions} />
            </div>
          )}

          {(analysis.enrichment ?? []).length === 0 && (analysis.followUpQuestions ?? []).length === 0 && (
            <p className="text-sm text-ink-400 text-center py-6">
              Research context not available — enable real AI mode to generate source suggestions.
            </p>
          )}
        </div>
      )}

      {tab === 'notes' && (
        <div className="bg-surface-50 border border-surface-200/70 rounded-xl p-4">
          <pre className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap font-mono">
            {rawText || <span className="text-ink-400 italic">No original text stored.</span>}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function WorkModeView() {
  const { state, dispatch } = useAppContext();
  const toast = useToast();
  const { sessions, activeSessionId, analysisSettings } = state;
  const [formOpen, setFormOpen] = useState(false);

  const workSessions   = sessions.filter(s => s.mode === APP_MODE.WORK);
  const hasSession     = workSessions.length > 0;
  const activeSession  = workSessions.find(s => s.id === activeSessionId)
    ?? workSessions[0]
    ?? null;

  const handleCreate = useCallback(async ({ title, type, rawText }) => {
    const id = uuid();
    const session = {
      id,
      mode: APP_MODE.WORK,
      type,
      title: title || SESSION_TYPE_META[type]?.label || 'Session',
      rawText,
      analysis: null,
      analysisError: null,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: ACTIONS.ADD_SESSION, payload: session });
    dispatch({ type: ACTIONS.SET_ACTIVE_SESSION, payload: id });
    dispatch({ type: ACTIONS.SESSION_ANALYSIS_START });
    setFormOpen(false);

    try {
      const analysis = await analyzeMeeting(rawText, session.title, type, analysisSettings);
      dispatch({ type: ACTIONS.SET_SESSION_ANALYSIS, payload: { id, analysis } });
      dispatch({ type: ACTIONS.SESSION_ANALYSIS_COMPLETE });
    } catch (err) {
      dispatch({
        type: ACTIONS.SESSION_ANALYSIS_ERROR,
        payload: { id, error: err.message },
      });
    }
  }, [dispatch, analysisSettings]);

  const updateAnalysisSettings = updates => {
    dispatch({ type: ACTIONS.SET_ANALYSIS_SETTINGS, payload: updates });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-900">{'\u{1f4bc}'} Work Mode</h2>
          <p className="text-sm text-ink-500 mt-0.5">
            Paste a meeting transcript — AI extracts decisions, action items, and stakeholder signals.
          </p>
        </div>
        {hasSession && (
          <div className="text-xs px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full font-semibold border border-primary-200/70">
            {workSessions.length} session{workSessions.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <NewSessionForm
            onCreate={handleCreate}
            collapsed={hasSession && !formOpen}
            onToggle={hasSession ? () => setFormOpen(o => !o) : null}
            analysisSettings={analysisSettings}
            onUpdateSettings={updateAnalysisSettings}
          />

          {hasSession && (
            <div className="surface-card p-4">
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">Sessions</h4>
              <div className="space-y-1">
                {workSessions.map(s => {
                  const meta = SESSION_TYPE_META[s.type] ?? {};
                  const topScore = s.analysis?.criticalMoments?.[0]?.score
                    ?? s.analysis?.importantMoments?.[0]?.score
                    ?? 0;
                  const tier = getImportanceTier(topScore);
                  return (
                    <button
                      key={s.id}
                      onClick={() => dispatch({ type: ACTIONS.SET_ACTIVE_SESSION, payload: s.id })}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors
                        ${activeSession?.id === s.id
                          ? 'bg-primary-50 border border-primary-200 text-primary-700'
                          : 'hover:bg-surface-100 text-ink-700'
                        }`}
                    >
                      <span>{meta.icon}</span>
                      <span className="flex-1 truncate font-medium">{s.title}</span>
                      {s.analysis && !s.analysisError && (
                        <span className="text-xs text-emerald-600 shrink-0">✓</span>
                      )}
                      {!s.analysis && !s.analysisError && (
                        <Spinner size="sm" />
                      )}
                      {topScore > 0 && (
                        <span className={`text-xs font-bold ${tier.color}`}>
                          {'\u2605'.repeat(tier.stars)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main panel */}
        <div className="lg:col-span-2">
          {activeSession
            ? <SessionPanel session={activeSession} dispatch={dispatch} toast={toast} />
            : (
              <div className="flex flex-col items-center justify-center h-64 text-center gap-3 bg-surface-50 rounded-2xl border border-dashed border-surface-300">
                <span className="text-4xl">{'\u{1f4bc}'}</span>
                <p className="text-sm text-ink-500">
                  Paste a meeting transcript on the left to extract intelligence.
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
