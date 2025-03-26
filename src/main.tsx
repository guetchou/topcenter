
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/accessibilityStyles.css'
import { AppProviders } from './providers/AppProviders.tsx'
import { toast } from 'sonner'
import { checkDomainAndRedirect } from './utils/domainRedirect.ts'

// Check domain and redirect if needed
checkDomainAndRedirect();

// Service worker registration with better error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js', { 
        scope: '/'
      });
      
      console.log('Service Worker enregistré avec succès:', registration.scope);
      
      // Vérifier les mises à jour du service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              toast.info(
                "Une mise à jour est disponible. Veuillez rafraîchir la page pour l'appliquer.",
                { duration: 10000 }
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Échec de l\'enregistrement du Service Worker:', error);
      // Don't show toast for SW errors to avoid confusing users
    }
  });
  
  // Gérer les messages du service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      toast.info('Contenu mis en cache pour utilisation hors ligne');
    }
  });
}

// Add skip-to-content link for keyboard navigation
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.textContent = 'Aller au contenu principal';
document.body.prepend(skipLink);

// Initialize application with optimized resources
createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
