import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppContext } from '../hooks/useAppContext';
import { ACTIONS } from '../context/actions';
import { SESSION_TYPE, SESSION_TYPE_META, APP_MODE, getImportanceTier } from '../constants/modes';
import { analyzeLecture } from '../services/ai/lectureAnalyzer';
import ImportanceBadge from '../components/intelligence/ImportanceBadge';
import MomentCard from '../components/intelligence/MomentCard';
import Spinner from '../components/ui/Spinner';

const SCHOOL_SESSION_TYPES = Object.entries(SESSION_TYPE_META)
  .filter(([, meta]) => meta.mode === APP_MODE.SCHOOL)
  .map(([id, meta]) => ({ id, ...meta }));

function NewSessionForm({ onCreate }) {
  const [title, setTitle]     = useState('');
  const [type, setType]       = useState(SESSION_TYPE.LECTURE);
  const [rawText, setRawText] = useState('');

  const handleCreate = () => {
    if (!rawText.trim()) return;
    onCreate({ title: title || type, type, rawText });
    setTitle(''); setType(SESSION_TYPE.LECTURE); setRawText('');
  };

  return (
    <div className="surface-card p-6 space-y-4">
      <h3 className="text-sm font-semibold text-ink-900">Capture a new session</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-ink-500 font-medium block mb-1">Title (optional)</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Neuroscience Week 4"
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
            {SCHOOL_SESSION_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-ink-500 font-medium block mb-1">
          Paste transcript, notes, or summary
        </label>
        <textarea
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          placeholder="Paste your lecture transcript, notes, or any text here..."
          rows={6}
          className="w-full px-3 py-2 text-sm border border-surface-200/70 rounded-xl bg-surface-50/80 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y font-mono"
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={!rawText.trim()}
        className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {'\u{1f4da}'} Analyze Session
      </button>
    </div>
  );
}

function SessionPanel({ session }) {
  const { analysis, analysisError } = session;
  const [tab, setTab] = useState('moments');

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

  const tabs = [
    { id: 'moments',      label: '\u26a1 Key Moments' },
    { id: 'flashcards',   label: '\u{1f0cf} Flashcards' },
    { id: 'questions',    label: '\u2753 Questions' },
    { id: 'suggestions',  label: '\u{1f4cb} Suggestions' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-primary-50/80 border border-primary-200/70 rounded-xl p-4">
        <p className="text-sm text-primary-900 leading-relaxed">{analysis.summary}</p>
      </div>

      {analysis.keyTakeaways?.length > 0 && (
        <div className="surface-card p-4">
          <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">
            Top Takeaways
          </h4>
          <ol className="space-y-1">
            {analysis.keyTakeaways.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-800">
                <span className="text-primary-600 font-bold shrink-0">{i + 1}.</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex gap-1 border-b border-surface-200/70 pb-0">
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

      {tab === 'moments' && (
        <div className="space-y-2">
          {(analysis.importantMoments ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No important moments detected.</p>
            : (analysis.importantMoments ?? []).map((m, i) => (
                <MomentCard key={i} moment={m} school />
              ))
          }
        </div>
      )}

      {tab === 'flashcards' && (
        <div className="space-y-2">
          {(analysis.flashcards ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No flashcards generated.</p>
            : (analysis.flashcards ?? []).map((f, i) => (
                <div key={i} className="border border-surface-200/70 rounded-xl overflow-hidden">
                  <div className="bg-primary-50/80 px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary-700">Front</span>
                    <ImportanceBadge score={f.importance ?? 0} compact />
                  </div>
                  <div className="px-4 py-2 text-sm text-ink-800 font-medium">{f.front}</div>
                  <div className="bg-surface-50 px-4 py-2 border-t border-surface-100">
                    <span className="text-xs text-ink-400 block mb-1">Back</span>
                    <span className="text-sm text-ink-700">{f.back}</span>
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {tab === 'questions' && (
        <div className="space-y-3">
          {(analysis.questions ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No practice questions generated.</p>
            : (analysis.questions ?? []).map((q, i) => (
                <div key={i} className="border border-surface-200/70 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink-900">{q.text}</p>
                    <ImportanceBadge score={q.importance ?? 0} compact />
                  </div>
                  <p className="text-sm text-ink-600 bg-surface-50 rounded-lg px-3 py-2">{q.answer}</p>
                </div>
              ))
          }
        </div>
      )}

      {tab === 'suggestions' && (
        <ul className="space-y-2">
          {(analysis.studySuggestions ?? []).map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink-700 bg-surface-50 rounded-lg px-3 py-2">
              <span className="text-primary-600">\u2192</span> {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SchoolModeView() {
  const { state, dispatch } = useAppContext();
  const { sessions, activeSessionId } = state;

  const schoolSessions = sessions.filter(s => s.mode === APP_MODE.SCHOOL);
  const activeSession  = schoolSessions.find(s => s.id === activeSessionId) ?? schoolSessions[0] ?? null;

  const handleCreate = useCallback(async ({ title, type, rawText }) => {
    const id = uuid();
    const session = {
      id,
      mode: APP_MODE.SCHOOL,
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
      const analysis = await analyzeLecture(rawText, session.title, type);
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-900">{'\u{1f4da}'} School Mode</h2>
          <p className="text-sm text-ink-500 mt-0.5">
            Paste a lecture transcript or notes - AI extracts what matters.
          </p>
        </div>
        <div className="text-xs px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full font-semibold border border-primary-200/70">
          {schoolSessions.length} session{schoolSessions.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <NewSessionForm onCreate={handleCreate} />

          {schoolSessions.length > 0 && (
            <div className="surface-card p-4">
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">Sessions</h4>
              <div className="space-y-1">
                {schoolSessions.map(s => {
                  const meta = SESSION_TYPE_META[s.type] ?? {};
                  const topScore = s.analysis?.importantMoments?.[0]?.score ?? 0;
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

        <div className="lg:col-span-2">
          {activeSession
            ? <SessionPanel session={activeSession} />
            : (
              <div className="flex flex-col items-center justify-center h-64 text-center gap-3 bg-surface-50 rounded-2xl border border-dashed border-surface-300">
                <span className="text-4xl">{'\u{1f4da}'}</span>
                <p className="text-sm text-ink-500">
                  Paste a transcript on the left to analyze your first session.
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
