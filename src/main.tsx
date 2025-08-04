
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import './lib/accessibilityStyles.css'
import { AppProviders } from './providers/AppProviders.tsx'
import { toast } from 'sonner'

// Service worker registration code
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js', { 
        scope: '/',
        updateViaCache: 'none' // Force la vérification des mises à jour du SW
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
                { 
                  duration: 10000,
                  action: {
                    label: "Mettre à jour",
                    onClick: () => window.location.reload()
                  }
                }
              );
            }
          });
        }
      });

      // Vérifiez périodiquement les mises à jour (toutes les 2 heures)
      setInterval(() => {
        registration.update();
        console.log('Vérification des mises à jour du Service Worker');
      }, 2 * 60 * 60 * 1000);
      
      // Synchronisation en arrière-plan simplifiée
      console.log('Service Worker prêt pour la synchronisation');
      
    } catch (error) {
      console.error('Échec de l\'enregistrement du Service Worker:', error);
    }
  });
  
  // Gérer les messages du service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      toast.info('Contenu mis en cache pour utilisation hors ligne');
    } else if (event.data && event.data.type === 'NEW_CONTENT') {
      toast.info('Nouveau contenu disponible', {
        action: {
          label: "Rafraîchir",
          onClick: () => window.location.reload()
        }
      });
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
  <BrowserRouter>
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>
);
