
import React from 'react';
import ReactDOM from 'react-dom/client';
import NewApp from './NewApp';
import { AppProviders } from './providers/AppProviders';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

// Récupération de l'élément racine et assertion de son existence
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Élément racine non trouvé dans le DOM');
  throw new Error('Root element not found');
}

// Utilisation de createRoot avec le composant racine
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppProviders>
        <NewApp />
      </AppProviders>
    </HelmetProvider>
  </React.StrictMode>
);
