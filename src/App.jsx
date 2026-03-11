import { useAppContext } from './hooks/useAppContext';
import PageShell from './components/layout/PageShell';
import LandingView from './views/LandingView';
import CourseSetupView from './views/CourseSetupView';
import DashboardView from './views/DashboardView';
import ImportView from './views/ImportView';
import AnalysisView from './views/AnalysisView';
import CardGenerationView from './views/CardGenerationView';
import StudyModesView from './views/StudyModesView';
import ExportView from './views/ExportView';

function ViewRouter() {
  const { state } = useAppContext();
  const { currentView } = state;

  switch (currentView) {
    case 'landing':         return <LandingView />;
    case 'course_setup':    return <CourseSetupView />;
    case 'dashboard':       return <DashboardView />;
    case 'import':          return <ImportView />;
    case 'analysis':        return <AnalysisView />;
    case 'card_generation': return <CardGenerationView />;
    case 'study_modes':     return <StudyModesView />;
    case 'export':          return <ExportView />;
    default:                return <LandingView />;
  }
}

export default function App() {
  return (
    <PageShell>
      <ViewRouter />
    </PageShell>
  );
}
