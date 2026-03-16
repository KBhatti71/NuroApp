import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// @ts-ignore - Gradual migration to TypeScript
import { useAppContext } from '@/hooks/useAppContext';
// @ts-ignore - Gradual migration to TypeScript
import { VIEWS } from '@/constants/views';
// @ts-ignore - Gradual migration to TypeScript
import PageShell from '@/components/layout/PageShell';
// @ts-ignore - Gradual migration to TypeScript
import ErrorBoundary from '@/components/common/ErrorBoundary';
// @ts-ignore - Gradual migration to TypeScript
import Spinner from '@/components/ui/Spinner';

// Lazy-load views so each chunk is only fetched when first navigated to.
// @ts-ignore - Gradual migration to TypeScript
const LandingView        = lazy(() => import('@/features/landing/pages/LandingPage'));
// @ts-ignore - Gradual migration to TypeScript
const CourseSetupView    = lazy(() => import('@/features/course-setup/pages/CourseSetupPage'));
// @ts-ignore - Gradual migration to TypeScript
const DashboardView      = lazy(() => import('@/views/DashboardView'));
// @ts-ignore - Gradual migration to TypeScript
const ImportView         = lazy(() => import('@/features/import/pages/ImportPage'));
// @ts-ignore - Gradual migration to TypeScript
const AnalysisView       = lazy(() => import('@/views/AnalysisView'));
// @ts-ignore - Gradual migration to TypeScript
const CardGenerationView = lazy(() => import('@/views/CardGenerationView'));
// @ts-ignore - Gradual migration to TypeScript
const StudyModesView     = lazy(() => import('@/views/StudyModesView'));
// @ts-ignore - Gradual migration to TypeScript
const ExportView         = lazy(() => import('@/views/ExportView'));
// @ts-ignore - Gradual migration to TypeScript
const SchoolModeView     = lazy(() => import('@/views/SchoolModeView'));
// @ts-ignore - Gradual migration to TypeScript
const WorkModeView       = lazy(() => import('@/views/WorkModeView'));

// Map routes to views
const ROUTE_TO_VIEW = {
  '/': VIEWS.LANDING,
  '/course-setup': VIEWS.COURSE_SETUP,
  '/dashboard': VIEWS.DASHBOARD,
  '/import': VIEWS.IMPORT,
  '/analysis': VIEWS.ANALYSIS,
  '/card-generation': VIEWS.CARD_GENERATION,
  '/study-modes': VIEWS.STUDY_MODES,
  '/export': VIEWS.EXPORT,
  '/school-mode': VIEWS.SCHOOL_MODE,
  '/work-mode': VIEWS.WORK_MODE,
};

function ViewFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );
}

// Component to sync route with context
function RouteSyncer() {
  const { dispatch } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    const view = ROUTE_TO_VIEW[location.pathname as keyof typeof ROUTE_TO_VIEW];
    if (view) {
      dispatch({ type: 'SET_VIEW', payload: view });
    }
  }, [location.pathname, dispatch]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <RouteSyncer />
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path="/course-setup" element={<CourseSetupView />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/import" element={<ImportView />} />
        <Route path="/analysis" element={<AnalysisView />} />
        <Route path="/card-generation" element={<CardGenerationView />} />
        <Route path="/study-modes" element={<StudyModesView />} />
        <Route path="/export" element={<ExportView />} />
        <Route path="/school-mode" element={<SchoolModeView />} />
        <Route path="/work-mode" element={<WorkModeView />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/NuroApp">
      <PageShell>
        <ErrorBoundary>
          <Suspense fallback={<ViewFallback />}>
            <AppRoutes />
          </Suspense>
        </ErrorBoundary>
      </PageShell>
    </BrowserRouter>
  );
}
