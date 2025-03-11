
// Nom du cache
const CACHE_NAME = 'topcenter-cache-v1';

// Liste des ressources à mettre en cache
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/lovable-uploads/logo-topcenter.png',
  '/notification.mp3'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie de mise en cache network-first avec fallback
self.addEventListener('fetch', (event) => {
  // Exclure les requêtes vers Supabase ou API externes
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('api.')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Vérifier si la réponse est valide
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone la réponse
        const responseToCache = response.clone();
        
        // Mise à jour du cache avec la nouvelle réponse
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(() => {
        // Si la requête échoue, on cherche dans le cache
        return caches.match(event.request)
          .then((response) => {
            // Si trouvé dans le cache, on retourne la réponse
            if (response) {
              return response;
            }
            
            // Si c'est une requête de navigation et qu'il n'y a pas de réponse dans le cache
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            return new Response('Ressource non disponible hors ligne', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'Nouvelle notification',
        body: event.data.text(),
        icon: '/lovable-uploads/logo-topcenter.png'
      };
    }
  }

  const options = {
    body: data.body || 'Nouvelle mise à jour disponible',
    icon: data.icon || '/lovable-uploads/logo-topcenter.png',
    badge: '/lovable-uploads/logo-topcenter.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'TopCenter', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Si un onglet est déjà ouvert avec l'URL cible, on le focus
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Sinon on ouvre un nouvel onglet
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
