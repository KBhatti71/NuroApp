import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppProvider } from './context/AppContext.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import { seedDemoData } from './lib/data/seeds';

// Seed demo data on app startup
seedDemoData().catch(console.error);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppProvider>
  </StrictMode>
);
