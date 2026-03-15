import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import { VIEWS } from '@/constants/views';
import PageShell from '@/components/layout/PageShell';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Spinner from '@/components/ui/Spinner';

// Lazy-load views so each chunk is only fetched when first navigated to.
const LandingView        = lazy(() => import('@/views/LandingView'));
const CourseSetupView    = lazy(() => import('@/views/CourseSetupView'));
const DashboardView      = lazy(() => import('@/views/DashboardView'));
const ImportView         = lazy(() => import('@/views/ImportView'));
const AnalysisView       = lazy(() => import('@/views/AnalysisView'));
const CardGenerationView = lazy(() => import('@/views/CardGenerationView'));
const StudyModesView     = lazy(() => import('@/views/StudyModesView'));
const ExportView         = lazy(() => import('@/views/ExportView'));
const SchoolModeView     = lazy(() => import('@/views/SchoolModeView'));
const WorkModeView       = lazy(() => import('@/views/WorkModeView'));

function ViewFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );
}

// Route wrapper that syncs with context
function RouteWrapper({ view, children }) {
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sync current view with route
    dispatch({ type: 'SET_VIEW', payload: view });
  }, [view, dispatch]);

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RouteWrapper view={VIEWS.LANDING}><LandingView /></RouteWrapper>} />
      <Route path="/course-setup" element={<RouteWrapper view={VIEWS.COURSE_SETUP}><CourseSetupView /></RouteWrapper>} />
      <Route path="/dashboard" element={<RouteWrapper view={VIEWS.DASHBOARD}><DashboardView /></RouteWrapper>} />
      <Route path="/import" element={<RouteWrapper view={VIEWS.IMPORT}><ImportView /></RouteWrapper>} />
      <Route path="/analysis" element={<RouteWrapper view={VIEWS.ANALYSIS}><AnalysisView /></RouteWrapper>} />
      <Route path="/card-generation" element={<RouteWrapper view={VIEWS.CARD_GENERATION}><CardGenerationView /></RouteWrapper>} />
      <Route path="/study-modes" element={<RouteWrapper view={VIEWS.STUDY_MODES}><StudyModesView /></RouteWrapper>} />
      <Route path="/export" element={<RouteWrapper view={VIEWS.EXPORT}><ExportView /></RouteWrapper>} />
      <Route path="/school-mode" element={<RouteWrapper view={VIEWS.SCHOOL_MODE}><SchoolModeView /></RouteWrapper>} />
      <Route path="/work-mode" element={<RouteWrapper view={VIEWS.WORK_MODE}><WorkModeView /></RouteWrapper>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
