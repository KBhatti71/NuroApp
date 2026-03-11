import { useState } from 'react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { SOURCE_TYPE_LABELS } from '../../services/pipeline/contentParser';

const TYPE_OPTIONS = Object.entries(SOURCE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export default function UrlImportForm({ onAdd }) {
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('transcript');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!text.trim()) {
      setError('Please paste some content first.');
      return;
    }
    onAdd({ name: name.trim() || `Pasted content (${type})`, text, type });
    setText('');
    setName('');
    setError('');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Label (e.g. Week 3 Lecture Transcript)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 bg-surface-0 border border-surface-200 rounded-lg text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="w-44">
          <Select value={type} onChange={setType} options={TYPE_OPTIONS} />
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setError(''); }}
        placeholder="Paste lecture transcript, quiz questions, study guide text, textbook excerpt, or any class content here..."
        rows={8}
        className="w-full px-3 py-2.5 bg-surface-0 border border-surface-200 rounded-xl text-sm text-ink-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y scrollbar-thin font-mono"
      />

      {error && <p className="text-danger-400 text-sm">{error}</p>}

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-500">
          {text ? `${text.split(/\s+/).filter(Boolean).length.toLocaleString()} words` : 'Paste any text content from your class'}
        </span>
        <Button onClick={handleAdd} disabled={!text.trim()} size="md">
          + Add Source
        </Button>
      </div>
    </div>
  );
}
