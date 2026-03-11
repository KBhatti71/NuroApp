import { useMemo } from 'react';
import { useAppContext, useNav } from '../hooks/useAppContext';
import { usePipeline } from '../hooks/usePipeline';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function UnitProgressBar({ unit, cards }) {
  const unitCards = cards.filter(c => c.unitId === unit.id);
  const avgLikelihood = unitCards.length > 0
    ? Math.round(unitCards.reduce((n, c) => n + c.quizLikelihood, 0) / unitCards.length)
    : 0;

  const UNIT_COLORS = {
    unit_01: '#6366f1',
    unit_02: '#0ea5e9',
    unit_03: '#10b981',
    unit_04: '#f59e0b',
    unit_05: '#8b5cf6',
  };
  const color = UNIT_COLORS[unit.id] || '#14b8a6';

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-ink-700 truncate">{unit.title}</span>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {unitCards.length > 0 && (
              <span className="text-xs text-ink-400">★ {avgLikelihood}%</span>
            )}
            <span className="text-xs text-ink-500">{unitCards.length} cards</span>
          </div>
        </div>
        <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${unit.weight * 100}%`, backgroundColor: color }} />
        </div>
      </div>
      <span className="text-xs font-semibold text-ink-700 w-8 shrink-0 text-right">
        {Math.round(unit.weight * 100)}%
      </span>
    </div>
  );
}

export default function DashboardView() {
  const { state } = useAppContext();
  const navigate = useNav();
  const { run, isRunning } = usePipeline();
  const { course, courseMap, sources, cards, analysis } = state;

  const hasCards = cards.length > 0;
  const hasAnalysis = !!analysis.professorStyle;

  const topCard = [...cards].sort((a, b) => b.quizLikelihood - a.quizLikelihood)[0];

  const daysUntilExam = useMemo(() => {
    if (!course?.examDate) return null;
    const examDate = new Date(course.examDate);
    const now = new Date();
    return Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }, [course]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Course overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-ink-900">{course?.name || 'No Course'}</h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {course?.professor && (
                <span className="text-sm text-ink-500">{course.professor}</span>
              )}
              {course?.semester && (
                <span className="text-xs px-2 py-0.5 bg-surface-100 text-ink-600 rounded-full">{course.semester}</span>
              )}
              {daysUntilExam !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  daysUntilExam <= 7 ? 'bg-danger-50 text-danger-400' :
                  daysUntilExam <= 14 ? 'bg-warn-50 text-yellow-700' :
                  'bg-success-50 text-green-700'
                }`}>
                  {daysUntilExam > 0 ? `${daysUntilExam} days until exam` : 'Exam today!'}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => navigate('import')} size="sm">
              + Add Materials
            </Button>
            {sources.length > 0 && !hasCards && (
              <Button onClick={run} disabled={isRunning} size="sm">
                {isRunning ? 'Analyzing...' : 'Run Analysis'}
              </Button>
            )}
            {hasCards && (
              <Button onClick={() => navigate('study_modes')} size="sm">
                Study Now →
              </Button>
            )}
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Sources', value: sources.length, icon: '↑', color: 'text-sky-500' },
            { label: 'Study Cards', value: cards.length, icon: '▣', color: 'text-primary-500' },
            { label: 'High-Yield Concepts', value: analysis.highYieldConcepts?.length || 0, icon: '★', color: 'text-warn-400' },
            { label: 'Pinned Cards', value: cards.filter(c => c.pinned).length, icon: '◎', color: 'text-success-400' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-surface-50 rounded-xl p-4 border border-surface-200">
              <div className={`text-lg ${color} mb-1`}>{icon}</div>
              <div className="text-2xl font-bold text-ink-900">{value}</div>
              <div className="text-xs text-ink-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course map */}
        {courseMap?.units && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-4">Course Units & Exam Weight</h3>
            <div className="divide-y divide-surface-200">
              {courseMap.units.map(unit => (
                <UnitProgressBar key={unit.id} unit={unit} cards={cards} />
              ))}
            </div>
          </Card>
        )}

        {/* Top concept */}
        {topCard && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-3">
              Top Priority Card
              <span className="ml-2 text-xs font-normal text-ink-500">Highest quiz likelihood</span>
            </h3>
            <div className="bg-surface-50 rounded-xl p-4 border border-surface-200">
              <div className="text-xs text-ink-400 mb-1">{topCard.unit}</div>
              <div className="text-sm font-bold text-ink-900 mb-1">{topCard.topic}</div>
              <div className="text-xs text-ink-600 leading-relaxed mb-3 line-clamp-3">{topCard.coreIdea}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 bg-success-100 text-green-700 rounded-full font-semibold">
                  ★ {topCard.quizLikelihood}% likely
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('card_generation')}
                >
                  View all cards →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Professor analysis summary */}
        {hasAnalysis && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-ink-900 mb-3">Professor Intelligence</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-500">Teaching style:</span>
                <span className="text-xs font-semibold text-ink-800 capitalize">
                  {analysis.professorStyle?.lectureStyle?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-500">Emphasis:</span>
                <span className="text-xs font-semibold text-ink-800 capitalize">
                  {analysis.professorStyle?.emphasisLevel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-500">Quiz format:</span>
                <span className="text-xs font-semibold text-ink-800 capitalize">
                  {analysis.quizPattern?.dominantFormat?.replace('_', ' ')}
                </span>
              </div>
              {analysis.professorStyle?.signatureTerms?.length > 0 && (
                <div>
                  <span className="text-xs text-ink-500 block mb-1">Signature terms:</span>
                  <div className="flex flex-wrap gap-1">
                    {analysis.professorStyle.signatureTerms.slice(0, 3).map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs border border-primary-100">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 -ml-2"
              onClick={() => navigate('analysis')}
            >
              View full analysis →
            </Button>
          </Card>
        )}

        {/* Quick actions */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Import more materials', action: () => navigate('import'), icon: '↑' },
              { label: 'View intelligence analysis', action: () => navigate('analysis'), icon: '◎' },
              { label: 'Browse study cards', action: () => navigate('card_generation'), icon: '▣' },
              { label: 'Start flashcard mode', action: () => { navigate('study_modes'); }, icon: '◈' },
              { label: 'Export cards as PDF', action: () => navigate('export'), icon: '↗' },
            ].map(({ label, action, icon }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-ink-700 hover:bg-surface-100 rounded-lg transition-colors text-left"
              >
                <span className="text-ink-400 text-base w-5 text-center">{icon}</span>
                {label}
                <span className="ml-auto text-ink-300">→</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
