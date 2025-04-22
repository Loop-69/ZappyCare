
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializePostHog } from './integrations/posthog/config';
import { ErrorBoundary } from './components/ErrorBoundary';

// Initialize PostHog with custom rate limiting settings
initializePostHog();

// Ensure React is properly initialized with StrictMode and error boundaries
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ErrorBoundary>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ErrorBoundary>
);
