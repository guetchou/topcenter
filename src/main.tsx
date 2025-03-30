
import React from 'react';
import ReactDOM from 'react-dom/client';
import NewApp from './NewApp';
import { AppProviders } from './providers/AppProviders';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <NewApp />
    </AppProviders>
  </React.StrictMode>
);
