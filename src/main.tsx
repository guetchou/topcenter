
import React from 'react';
import ReactDOM from 'react-dom/client';
import NewApp from './NewApp';
import { AppProviders } from './providers/AppProviders';
import './index.css';

// Utiliser createRoot avec une assertion non-null pour éviter les erreurs TypeScript
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProviders>
      <NewApp />
    </AppProviders>
  </React.StrictMode>
);
