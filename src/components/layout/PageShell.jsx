import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAppContext } from '../../hooks/useAppContext';

export default function PageShell({ children }) {
  const { state } = useAppContext();
  const showShell = state.currentView !== 'landing';

  if (!showShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
