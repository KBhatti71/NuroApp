import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore - Gradual migration to TypeScript
import Button from '@/components/ui/Button';

export default function CourseSetupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    professor: '',
    institution: '',
    semester: '',
    examDate: '',
  });
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Course name is required.');
      return;
    }

    // For now, just navigate to import - we'll handle course creation with context later
    navigate('/import');
  };

  const inputCls = 'w-full px-4 py-3 bg-surface-0/80 border border-surface-200/70 rounded-xl text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow placeholder:text-ink-300';

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 mb-8 transition-colors"
        >
          ← Back
        </button>

        <div className="surface-card p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-lg">▣</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-900">Create New Course</h1>
              <p className="text-sm text-ink-500">Set up your neuroscience study workspace</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1.5 uppercase tracking-wider">
                Course Name <span className="text-danger-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. NEUR 301: Systems Neuroscience"
                value={form.name}
                onChange={set('name')}
                className={inputCls}
                autoFocus
              />
              {error && <p className="text-danger-400 text-xs mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1.5 uppercase tracking-wider">
                Professor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Sarah Chen"
                value={form.professor}
                onChange={set('professor')}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1.5 uppercase tracking-wider">
                  Institution
                </label>
                <input
                  type="text"
                  placeholder="e.g. State University"
                  value={form.institution}
                  onChange={set('institution')}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1.5 uppercase tracking-wider">
                  Semester
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spring 2026"
                  value={form.semester}
                  onChange={set('semester')}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1.5 uppercase tracking-wider">
                Exam Date (optional)
              </label>
              <input
                type="date"
                value={form.examDate}
                onChange={set('examDate')}
                className={inputCls}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full justify-center">
                Create Course →
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-ink-400 mt-5">
          After creating your course, you'll upload materials and start the analysis.
        </p>
      </div>
    </div>
  );
}