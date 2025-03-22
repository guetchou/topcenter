
// Nom du cache
const CACHE_NAME = 'topcenter-cache-v2';

// Liste des ressources à mettre en cache
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/lovable-uploads/logo-topcenter.png',
  '/notification.mp3',
  // Images couramment utilisées
  '/lovable-uploads/equipe-topcenter.jpg',
  // Styles et scripts principaux
  '/src/index.css',
  // Polices
  '/fonts/inter.woff2',
];

// Pages importantes à mettre en cache
const importantPages = [
  '/',
  '/about',
  '/services',
  '/contact',
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

// Déterminer si une URL est une page importante
const isImportantPage = (url) => {
  const parsedUrl = new URL(url);
  return importantPages.some(page => parsedUrl.pathname === page);
};

// Stratégie de mise en cache - Stale-While-Revalidate pour les ressources importantes
// Network-first avec fallback pour les autres ressources
self.addEventListener('fetch', (event) => {
  // Exclure les requêtes vers Supabase, API externes ou analytiques
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('api.') ||
      event.request.url.includes('analytics') ||
      event.request.url.includes('socket')) {
    return;
  }
  
  // Extraire l'URL
  const requestUrl = new URL(event.request.url);
  
  // Stratégie différente selon le type de ressource
  if (event.request.destination === 'image' || 
      event.request.url.endsWith('.css') || 
      event.request.url.endsWith('.js') ||
      event.request.url.includes('fonts')) {
    
    // Pour les assets statiques : Cache-first, puis réseau
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Cache hit - retourner la réponse
          if (response) {
            // En parallèle, mettre à jour le cache (sans attendre)
            fetch(event.request)
              .then((networkResponse) => {
                if (networkResponse && networkResponse.ok) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, networkResponse.clone()));
                }
              })
              .catch(() => console.log('Failed to update cache for: ' + event.request.url));
              
            return response;
          }
          
          // Cache miss - faire une requête réseau
          return fetch(event.request)
            .then((networkResponse) => {
              if (!networkResponse || !networkResponse.ok) {
                return networkResponse;
              }
              
              // Mise en cache de la nouvelle réponse
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache));
                
              return networkResponse;
            })
            .catch(() => {
              // Si c'est une image, retourner une image placeholder
              if (event.request.destination === 'image') {
                return caches.match('/placeholder.svg');
              }
              return new Response('Ressource non disponible hors ligne', {
                status: 503,
                headers: new Headers({ 'Content-Type': 'text/plain' })
              });
            });
        })
    );
  } else if (isImportantPage(event.request.url) || event.request.mode === 'navigate') {
    // Pour les requêtes de navigation vers des pages importantes : Réseau puis cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Stocker dans le cache pour les futures visites hors ligne
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // Si offline, chercher dans le cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Si pas dans le cache, retourner la page offline
              return caches.match('/offline.html');
            });
        })
    );
  } else {
    // Pour tout le reste: Network-first avec fallback cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Mise à jour du cache pour les futures utilisations hors ligne
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // Si offline, chercher dans le cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              return cachedResponse || new Response('Ressource non disponible hors ligne', {
                status: 503,
                headers: new Headers({ 'Content-Type': 'text/plain' })
              });
            });
        })
    );
  }
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
    },
    actions: [
      {
        action: 'open',
        title: 'Voir',
      },
      {
        action: 'close',
        title: 'Fermer',
      },
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'TopCenter', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
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

// Périodiquement vérifier et mettre en cache les pages importantes
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(
      Promise.all(
        importantPages.map(page => {
          const url = new URL(page, self.location.origin).toString();
          return fetch(url)
            .then(response => {
              const responseToCache = response.clone();
              return caches.open(CACHE_NAME)
                .then(cache => cache.put(url, responseToCache));
            })
            .catch(error => console.error(`Failed to update cache for ${url}`, error));
        })
      )
    );
  }
});

// Background sync pour les actions différées
self.addEventListener('sync', (event) => {
  if (event.tag === 'deferred-operations') {
    event.waitUntil(
      // Récupérer les opérations en attente de IndexedDB et les envoyer
      console.log('Background sync triggered for deferred operations')
    );
  }
});
