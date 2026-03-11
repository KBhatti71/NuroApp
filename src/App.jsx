import { Suspense, lazy } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { VIEWS } from '@/constants/views';
import PageShell from '@/components/layout/PageShell';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Spinner from '@/components/ui/Spinner';

// Lazy-load views so each chunk is only fetched when first navigated to.
// This keeps the initial bundle small and improves perceived load time.
const LandingView        = lazy(() => import('@/views/LandingView'));
const CourseSetupView    = lazy(() => import('@/views/CourseSetupView'));
const DashboardView      = lazy(() => import('@/views/DashboardView'));
const ImportView         = lazy(() => import('@/views/ImportView'));
const AnalysisView       = lazy(() => import('@/views/AnalysisView'));
const CardGenerationView = lazy(() => import('@/views/CardGenerationView'));
const StudyModesView     = lazy(() => import('@/views/StudyModesView'));
const ExportView         = lazy(() => import('@/views/ExportView'));

const VIEW_MAP = {
  [VIEWS.LANDING]:         LandingView,
  [VIEWS.COURSE_SETUP]:    CourseSetupView,
  [VIEWS.DASHBOARD]:       DashboardView,
  [VIEWS.IMPORT]:          ImportView,
  [VIEWS.ANALYSIS]:        AnalysisView,
  [VIEWS.CARD_GENERATION]: CardGenerationView,
  [VIEWS.STUDY_MODES]:     StudyModesView,
  [VIEWS.EXPORT]:          ExportView,
};

function ViewFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );
}

function ViewRouter() {
  const { state } = useAppContext();
  const View = VIEW_MAP[state.currentView] ?? LandingView;

  return (
    <ErrorBoundary>
      <Suspense fallback={<ViewFallback />}>
        <View />
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <PageShell>
      <ViewRouter />
    </PageShell>
  );
}
