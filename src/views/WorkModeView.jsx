import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppContext } from '../hooks/useAppContext';
import { ACTIONS } from '../context/actions';
import { SESSION_TYPE, SESSION_TYPE_META, APP_MODE, getImportanceTier } from '../constants/modes';
import { analyzeMeeting } from '../services/ai/meetingAnalyzer';
import ImportanceBadge from '../components/intelligence/ImportanceBadge';
import MomentCard from '../components/intelligence/MomentCard';
import Spinner from '../components/ui/Spinner';

const WORK_SESSION_TYPES = Object.entries(SESSION_TYPE_META)
  .filter(([, meta]) => meta.mode === APP_MODE.WORK)
  .map(([id, meta]) => ({ id, ...meta }));

const URGENCY_STYLE = {
  urgent: 'bg-red-50 text-red-700 border-red-200',
  normal: 'bg-sky-50 text-sky-700 border-sky-200',
  low:    'bg-surface-100 text-ink-500 border-surface-200',
};

const SENTIMENT_ICON = {
  supportive: { icon: '✅', color: 'text-green-600' },
  neutral:    { icon: '➖', color: 'text-ink-500'   },
  concerned:  { icon: '⚠️', color: 'text-amber-600' },
  opposed:    { icon: '🚫', color: 'text-red-600'   },
};

// ─── New Session Form ─────────────────────────────────────────────────────────

function NewSessionForm({ onCreate }) {
  const [title, setTitle]     = useState('');
  const [type, setType]       = useState(SESSION_TYPE.MEETING);
  const [rawText, setRawText] = useState('');

  const handleCreate = () => {
    if (!rawText.trim()) return;
    onCreate({ title: title || type, type, rawText });
    setTitle(''); setType(SESSION_TYPE.MEETING); setRawText('');
  };

  return (
    <div className="bg-surface-0 rounded-2xl border border-surface-200 p-6 space-y-4">
      <h3 className="text-sm font-semibold text-ink-900">Capture a new session</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-ink-500 font-medium block mb-1">Title (optional)</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Q2 Planning Sync"
            className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div>
          <label className="text-xs text-ink-500 font-medium block mb-1">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
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
          className="w-full px-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y font-mono"
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={!rawText.trim()}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        💼 Analyse Session
      </button>
    </div>
  );
}

// ─── Session Analysis Panel ───────────────────────────────────────────────────

function SessionPanel({ session }) {
  const { analysis, analysisError } = session;
  const [tab, setTab] = useState('actions');

  if (analysisError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
        Analysis failed: {analysisError}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-32 gap-2 text-ink-400">
        <Spinner size="sm" /> Analysing...
      </div>
    );
  }

  const tabs = [
    { id: 'actions',      label: '🔥 Action Items' },
    { id: 'decisions',    label: '⚖️ Decisions' },
    { id: 'stakeholders', label: '👥 Stakeholders' },
    { id: 'moments',      label: '⚡ Moments' },
    { id: 'followups',    label: '📌 Follow-ups' },
  ];

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
        <p className="text-sm text-sky-800 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-surface-200">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-medium rounded-t-lg transition-colors
              ${tab === t.id
                ? 'bg-white border border-surface-200 border-b-white -mb-px text-primary-600'
                : 'text-ink-500 hover:text-ink-900'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Action Items */}
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
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium border border-green-200">
                          Committed
                        </span>
                      )}
                      <ImportanceBadge score={a.importance ?? 60} compact />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs opacity-80">
                    {a.owner && <span>👤 {a.owner}</span>}
                    {a.deadline && <span>📅 {a.deadline}</span>}
                    <span className="capitalize font-medium">{a.urgency}</span>
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {/* Decisions */}
      {tab === 'decisions' && (
        <div className="space-y-3">
          {(analysis.decisions ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No decisions detected.</p>
            : (analysis.decisions ?? []).map((d, i) => (
                <div key={i} className="border border-surface-200 rounded-xl p-4 space-y-3 bg-surface-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink-900">{d.text}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border
                        ${d.status === 'decided'  ? 'bg-green-50 text-green-700 border-green-200' :
                          d.status === 'blocked'  ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {d.status}
                      </span>
                      <ImportanceBadge score={d.importance ?? 60} compact />
                    </div>
                  </div>
                  {(d.support?.length > 0 || d.concerns?.length > 0) && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {d.support?.length > 0 && (
                        <div>
                          <span className="text-green-600 font-semibold block mb-1">✅ Support</span>
                          {d.support.map((s, j) => <div key={j} className="text-ink-600">{s}</div>)}
                        </div>
                      )}
                      {d.concerns?.length > 0 && (
                        <div>
                          <span className="text-amber-600 font-semibold block mb-1">⚠️ Concerns</span>
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

      {/* Stakeholders */}
      {tab === 'stakeholders' && (
        <div className="space-y-2">
          {(analysis.stakeholders ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No stakeholders identified.</p>
            : (analysis.stakeholders ?? []).map((s, i) => {
                const sent = SENTIMENT_ICON[s.sentiment] ?? SENTIMENT_ICON.neutral;
                return (
                  <div key={i} className="flex gap-3 items-start border border-surface-200 rounded-xl p-3 bg-surface-0">
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

      {/* Critical Moments */}
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

      {/* Follow-ups */}
      {tab === 'followups' && (
        <div className="space-y-2">
          {(analysis.followUps ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No follow-ups needed.</p>
            : (analysis.followUps ?? []).map((f, i) => (
                <div key={i} className={`border rounded-xl p-3 flex gap-3 ${URGENCY_STYLE[f.priority] ?? URGENCY_STYLE.normal}`}>
                  <span className="text-sm font-bold shrink-0">
                    {f.priority === 'urgent' ? '🚨' : '📌'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{f.topic}</p>
                    {f.person && <p className="text-xs mt-0.5">→ {f.person}</p>}
                    {f.context && <p className="text-xs opacity-70 mt-0.5">{f.context}</p>}
                  </div>
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function WorkModeView() {
  const { state, dispatch } = useAppContext();
  const { sessions, activeSessionId } = state;

  const workSessions   = sessions.filter(s => s.mode === APP_MODE.WORK);
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

    try {
      const analysis = await analyzeMeeting(rawText, session.title, type);
      dispatch({ type: ACTIONS.SET_SESSION_ANALYSIS, payload: { id, analysis } });
      dispatch({ type: ACTIONS.SESSION_ANALYSIS_COMPLETE });
    } catch (err) {
      dispatch({
        type: ACTIONS.SESSION_ANALYSIS_ERROR,
        payload: { id, error: err.message },
      });
    }
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-900">💼 Work Mode</h2>
          <p className="text-sm text-ink-500 mt-0.5">
            Paste a meeting transcript — AI extracts decisions, action items, and stakeholder signals.
          </p>
        </div>
        <div className="text-xs px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full font-semibold border border-sky-200">
          {workSessions.length} session{workSessions.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form + session list */}
        <div className="lg:col-span-1 space-y-4">
          <NewSessionForm onCreate={handleCreate} />

          {workSessions.length > 0 && (
            <div className="bg-surface-0 border border-surface-200 rounded-2xl p-4">
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
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors
                        ${activeSession?.id === s.id
                          ? 'bg-primary-50 border border-primary-200 text-primary-700'
                          : 'hover:bg-surface-100 text-ink-700'
                        }`}
                    >
                      <span>{meta.icon}</span>
                      <span className="flex-1 truncate font-medium">{s.title}</span>
                      {topScore > 0 && (
                        <span className={`text-xs font-bold ${tier.color}`}>
                          {'★'.repeat(tier.stars)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: analysis panel */}
        <div className="lg:col-span-2">
          {activeSession
            ? <SessionPanel session={activeSession} />
            : (
              <div className="flex flex-col items-center justify-center h-64 text-center gap-3 bg-surface-50 rounded-2xl border border-dashed border-surface-300">
                <span className="text-4xl">💼</span>
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
