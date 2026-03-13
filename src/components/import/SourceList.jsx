import { useAppContext } from '../../hooks/useAppContext';
import { ACTIONS } from '../../context/actions';
import { SOURCE_TYPE_LABELS, SOURCE_WEIGHTS } from '../../services/pipeline/contentParser';
import SourceWeightBadge from './SourceWeightBadge';
import Select from '../ui/Select';

const TYPE_OPTIONS = Object.entries(SOURCE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export default function SourceList() {
  const { state, dispatch } = useAppContext();
  const { sources } = state;

  if (sources.length === 0) return null;

  const handleTypeChange = (id, newType) => {
    dispatch({
      type: ACTIONS.UPDATE_SOURCE,
      payload: { id, updates: { type: newType, weight: SOURCE_WEIGHTS[newType] } },
    });
  };

  const handleRemove = (id) => {
    dispatch({ type: ACTIONS.REMOVE_SOURCE, payload: id });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ink-900">
          Imported Materials
          <span className="ml-2 text-xs font-normal text-ink-500">({sources.length} source{sources.length !== 1 ? 's' : ''})</span>
        </h3>
        <div className="text-xs text-ink-500">
          Total: {sources.reduce((n, s) => n + (s.tokenCount || 0), 0).toLocaleString()} tokens
        </div>
      </div>

      <div className="space-y-2">
        {sources.map((source) => (
          <div
            key={source.id}
            className="flex items-center gap-3 p-3 bg-surface-0/80 border border-surface-200/70 rounded-xl"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-ink-900 truncate max-w-xs">{source.name}</span>
                <SourceWeightBadge type={source.type} />
                {source.needsTypeConfirmation && (
                  <span className="text-xs text-warn-400 font-medium">\u26a0 Confirm type</span>
                )}
              </div>
              <div className="text-xs text-ink-500 mt-0.5">
                {source.tokenCount?.toLocaleString()} tokens \u00b7 {new Date(source.uploadedAt).toLocaleTimeString()}
              </div>
            </div>

            <div className="shrink-0 w-40">
              <Select
                value={source.type}
                onChange={(val) => handleTypeChange(source.id, val)}
                options={TYPE_OPTIONS}
              />
            </div>

            <button
              onClick={() => handleRemove(source.id)}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-ink-400 hover:bg-danger-50 hover:text-danger-400 transition-colors text-sm"
              title="Remove source"
            >
              \u00d7
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
