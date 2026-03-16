import { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useAppContext } from '../hooks/useAppContext';
import { useToast } from '../components/ui/useToast';
import { ACTIONS } from '../context/actions';
import { SESSION_TYPE, SESSION_TYPE_META, APP_MODE, getImportanceTier } from '../constants/modes';
import { analyzeLecture } from '../services/ai/lectureAnalyzer';
import { triggerSessionPrint } from '../services/exportService';
import ImportanceBadge from '../components/intelligence/ImportanceBadge';
import MomentCard from '../components/intelligence/MomentCard';
import Spinner from '../components/ui/Spinner';

/**
 * Converts session flashcards to full study cards, enriching each card with
 * matching concept data (keyTerms, memoryHook) where available.
 */
function flashcardsToCards(flashcards, session) {
  const concepts = session.analysis?.concepts ?? [];

  return flashcards
    .filter(f => f.front && f.back)
    .map(f => {
      // Try to match a concept by comparing the flashcard front text
      const frontLower = f.front.toLowerCase();
      const matched = concepts.find(c =>
        c.name && frontLower.includes(c.name.toLowerCase())
      );

      return {
        id: uuid(),
        unitId: null,
        topic: session.title,
        coreIdea: f.back,
        keyTerms: matched
          ? [{ term: matched.name, definition: matched.explanation ?? '' }]
          : [],
        mechanism: '',
        clinicalTieIn: '',
        professorEmphasis: matched?.importanceReason ?? '',
        memoryHook: '',
        likelyExamQuestion: f.front,
        likelyExamAnswer: f.back,
        quizLikelihood: Math.round(f.importance ?? 60) / 100,
        pinned: false,
        tags: [session.type, 'school'],
        sourceReferences: [session.id],
        createdAt: new Date().toISOString(),
        studyModeVariants: {
          professorWording: matched?.explanation ?? f.back,
          examCram: f.front,
        },
      };
    });
}

const SCHOOL_SESSION_TYPES = Object.entries(SESSION_TYPE_META)
  .filter(([, meta]) => meta.mode === APP_MODE.SCHOOL)
  .map(([id, meta]) => ({ id, ...meta }));

function NewSessionForm({ onCreate, collapsed, onToggle, analysisSettings, onUpdateSettings }) {
  const [title, setTitle]     = useState('');
  const [type, setType]       = useState(SESSION_TYPE.LECTURE);
  const [rawText, setRawText] = useState('');
  const settings = analysisSettings ?? {};

  const handleCreate = () => {
    if (!rawText.trim()) return;
    onCreate({ title: title || type, type, rawText });
    setTitle(''); setType(SESSION_TYPE.LECTURE); setRawText('');
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
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-ink-500 font-medium">
            Paste transcript, notes, or summary
          </label>
          <span className={`text-[10px] font-mono ${rawText.length > 50000 ? 'text-amber-500' : 'text-ink-400'}`}>
            {rawText.length.toLocaleString()} chars
            {rawText.length > 50000 && ' — very long; chunked analysis enabled'}
          </span>
        </div>
        <textarea
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          placeholder="Paste your lecture transcript, notes, or any text here..."
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
        {'\u{1f4da}'} Analyze Session
      </button>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Renders a list of enrichment blocks (background + sources + search terms). */
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

/** Renders follow-up research questions with rationale and search terms. */
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

/** Renders cross-references between concepts. */
function CrossRefList({ crossReferences }) {
  if (!(crossReferences ?? []).length) return null;
  return (
    <div className="surface-card p-4">
      <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">Concept Cross-References</h4>
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

// ─── Interactive Flashcard Deck ───────────────────────────────────────────────

/**
 * Click-to-flip flashcard deck with navigation arrows.
 * Each card shows the question on the front and reveals the answer on click.
 */
function FlashcardDeck({ flashcards }) {
  const [index, setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!flashcards.length) {
    return <p className="text-sm text-ink-400 text-center py-6">No flashcards generated.</p>;
  }

  const card = flashcards[index];
  const total = flashcards.length;

  const goNext = () => { setIndex(i => (i + 1) % total); setFlipped(false); };
  const goPrev = () => { setIndex(i => (i - 1 + total) % total); setFlipped(false); };

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-ink-400">
        <span>{index + 1} / {total}</span>
        <ImportanceBadge score={card.importance ?? 0} compact />
      </div>

      {/* Card — click to flip */}
      <button
        onClick={() => setFlipped(f => !f)}
        className={`w-full text-left rounded-2xl border-2 transition-all duration-200 min-h-[140px] flex flex-col justify-center px-6 py-5 gap-2
          ${flipped
            ? 'bg-primary-50 border-primary-300 shadow-md'
            : 'bg-surface-50 border-surface-200/70 hover:border-primary-300 hover:bg-primary-50/30'
          }`}
        aria-label={flipped ? 'Click to see question' : 'Click to reveal answer'}
      >
        <span className={`text-[10px] font-semibold uppercase tracking-widest ${flipped ? 'text-primary-500' : 'text-ink-400'}`}>
          {flipped ? 'Answer' : 'Question — click to reveal'}
        </span>
        <span className="text-sm font-medium text-ink-900 leading-relaxed">
          {flipped ? card.back : card.front}
        </span>
      </button>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={goPrev}
          className="px-4 py-1.5 text-xs font-semibold text-ink-600 bg-surface-100 hover:bg-surface-200 rounded-lg transition-colors border border-surface-200/70"
        >
          ← Prev
        </button>
        <button
          onClick={() => setFlipped(f => !f)}
          className="flex-1 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors border border-primary-200/60"
        >
          {flipped ? 'Hide Answer' : 'Reveal Answer'}
        </button>
        <button
          onClick={goNext}
          className="px-4 py-1.5 text-xs font-semibold text-ink-600 bg-surface-100 hover:bg-surface-200 rounded-lg transition-colors border border-surface-200/70"
        >
          Next →
        </button>
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
    const cards = flashcardsToCards(analysis.flashcards ?? [], session);
    if (cards.length === 0) return;
    dispatch({ type: ACTIONS.ADD_CARDS, payload: cards });
    setSaved(true);
    toast(`${cards.length} card${cards.length !== 1 ? 's' : ''} saved to your deck`, 'success');
  };

  const handlePrint = () => {
    try { triggerSessionPrint(session); }
    catch (err) { toast(err.message, 'error'); }
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

  const cardCount = (analysis.flashcards ?? []).length;
  const hasResearch = (analysis.enrichment ?? []).length > 0
    || (analysis.followUpQuestions ?? []).length > 0
    || (analysis.crossReferences ?? []).length > 0;

  const tabs = [
    { id: 'overview',   label: '\u{1f4cb} Overview' },
    { id: 'flashcards', label: `\u{1f0cf} Flashcards${cardCount ? ` (${cardCount})` : ''}` },
    { id: 'questions',  label: '\u2753 Questions' },
    { id: 'moments',    label: '\u26a1 Moments' },
    { id: 'suggestions',label: '\u{1f4a1} Study Tips' },
    hasResearch && { id: 'research', label: '\u{1f310} Research' },
    { id: 'notes',      label: '\u{1f4dd} Notes' },
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
          {cardCount > 0 && (
            <button
              onClick={handleSaveToDeck}
              disabled={saved}
              className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saved ? '✓ Saved' : `\u{1f0cf} Save ${cardCount} card${cardCount !== 1 ? 's' : ''}`}
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

      {/* Overview: summary + sections + takeaways + confusion */}
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

          {(analysis.keyTakeaways ?? []).length > 0 && (
            <div className="surface-card p-4">
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
                Key Takeaways
              </h4>
              <ol className="space-y-1.5">
                {analysis.keyTakeaways.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-800">
                    <span className="text-primary-600 font-bold shrink-0">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Logical sections extracted from notes */}
          {(analysis.sections ?? []).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Content Sections</h4>
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

          {(analysis.confusionMoments ?? []).length > 0 && (
            <div className="surface-card p-4">
              <h4 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">
                {'\u26a0'} Confusion Points
              </h4>
              <ul className="space-y-1.5">
                {analysis.confusionMoments.map((c, i) => (
                  <li key={i} className="text-sm text-ink-700 flex gap-2">
                    <span className="text-amber-500 shrink-0">·</span>
                    {typeof c === 'string' ? c : c.text}
                    {c.context && <span className="text-ink-400 text-xs ml-1">— {c.context}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <CrossRefList crossReferences={analysis.crossReferences} />
        </div>
      )}

      {tab === 'flashcards' && (
        <FlashcardDeck flashcards={analysis.flashcards ?? []} />
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

      {tab === 'suggestions' && (
        <ul className="space-y-2">
          {(analysis.studySuggestions ?? []).length === 0
            ? <p className="text-sm text-ink-400 text-center py-6">No study suggestions.</p>
            : (analysis.studySuggestions ?? []).map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-700 bg-surface-50 rounded-lg px-3 py-2">
                  <span className="text-primary-600">{'\u2192'}</span> {s}
                </li>
              ))
          }
        </ul>
      )}

      {tab === 'research' && (
        <div className="space-y-5">
          {(analysis.enrichment ?? []).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
                {'\u{1f4da}'} Background Context &amp; Sources
              </h4>
              <p className="text-xs text-ink-400 mb-3">
                AI-suggested sources from training knowledge — verify before citing in assignments.
              </p>
              <EnrichmentList enrichment={analysis.enrichment} />
            </div>
          )}

          {(analysis.followUpQuestions ?? []).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
                {'\u{1f50d}'} Follow-Up Questions for Deeper Learning
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

export default function SchoolModeView() {
  const { state, dispatch } = useAppContext();
  const toast = useToast();
  const { sessions, activeSessionId, analysisSettings } = state;
  const [formOpen, setFormOpen]           = useState(false);
  const [sessionSearch, setSessionSearch] = useState('');

  const schoolSessions = sessions.filter(s => s.mode === APP_MODE.SCHOOL);
  const hasSession     = schoolSessions.length > 0;
  const activeSession  = schoolSessions.find(s => s.id === activeSessionId) ?? schoolSessions[0] ?? null;

  const filteredSessions = sessionSearch.trim()
    ? schoolSessions.filter(s =>
        s.title.toLowerCase().includes(sessionSearch.toLowerCase())
      )
    : schoolSessions;

  const handleDeleteSession = (e, id) => {
    e.stopPropagation();
    dispatch({ type: ACTIONS.DELETE_SESSION, payload: id });
    toast('Session deleted', 'info');
  };

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
    setFormOpen(false);

    try {
      const analysis = await analyzeLecture(rawText, session.title, type, analysisSettings);
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
          <h2 className="text-xl font-bold text-ink-900">{'\u{1f4da}'} School Mode</h2>
          <p className="text-sm text-ink-500 mt-0.5">
            Paste a lecture transcript or notes — AI extracts what matters.
          </p>
        </div>
        {hasSession && (
          <div className="text-xs px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full font-semibold border border-primary-200/70">
            {schoolSessions.length} session{schoolSessions.length !== 1 ? 's' : ''}
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
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
                Sessions ({schoolSessions.length})
              </h4>

              {schoolSessions.length > 3 && (
                <input
                  value={sessionSearch}
                  onChange={e => setSessionSearch(e.target.value)}
                  placeholder="Search sessions..."
                  className="w-full mb-2 px-3 py-1.5 text-xs border border-surface-200/70 rounded-lg bg-surface-50/80 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              )}

              <div className="space-y-1">
                {filteredSessions.length === 0 && (
                  <p className="text-xs text-ink-400 text-center py-2">No sessions match.</p>
                )}
                {filteredSessions.map(s => {
                  const meta = SESSION_TYPE_META[s.type] ?? {};
                  const topScore = s.analysis?.importantMoments?.[0]?.score ?? 0;
                  const tier = getImportanceTier(topScore);
                  return (
                    <div
                      key={s.id}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer
                        ${activeSession?.id === s.id
                          ? 'bg-primary-50 border border-primary-200 text-primary-700'
                          : 'hover:bg-surface-100 text-ink-700'
                        }`}
                      onClick={() => dispatch({ type: ACTIONS.SET_ACTIVE_SESSION, payload: s.id })}
                    >
                      <span className="shrink-0">{meta.icon}</span>
                      <span className="flex-1 truncate font-medium text-left">{s.title}</span>

                      {s.analysis && !s.analysisError && (
                        <span className="text-xs text-emerald-600 shrink-0">✓</span>
                      )}
                      {!s.analysis && !s.analysisError && (
                        <Spinner size="sm" />
                      )}
                      {topScore > 0 && (
                        <span className={`text-xs font-bold shrink-0 ${tier.color}`}>
                          {'\u2605'.repeat(tier.stars)}
                        </span>
                      )}

                      {/* Delete — visible on hover */}
                      <button
                        onClick={e => handleDeleteSession(e, s.id)}
                        title="Delete session"
                        className="shrink-0 opacity-0 group-hover:opacity-100 text-ink-300 hover:text-danger-500 transition-opacity text-xs leading-none"
                        aria-label="Delete session"
                      >
                        ✕
                      </button>
                    </div>
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
