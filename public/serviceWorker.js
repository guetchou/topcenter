
// Nom et version du cache
const CACHE_NAME = 'topcenter-cache-v1';

// Liste des ressources à mettre en cache pour le fonctionnement hors ligne
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/lovable-uploads/logo-topcenter.png',
  '/placeholder.svg',
  '/favicon.ico',
  '/offline.html'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  // Pour les requêtes API, on utilise réseau d'abord avec fallback cache
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('.supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Mise en cache de la nouvelle réponse
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Si la requête échoue, on essaie de récupérer du cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Si la ressource n'est pas dans le cache, on renvoie la page hors ligne
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              return new Response('Erreur réseau', { status: 503 });
            });
        })
    );
  } else {
    // Pour les autres ressources, on utilise le cache d'abord avec fallback réseau
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Si la ressource est dans le cache, on la renvoie
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Sinon, on essaie de récupérer la ressource depuis le réseau
          return fetch(event.request)
            .then((response) => {
              // Mise en cache de la nouvelle réponse si c'est une requête GET
              if (response.status === 200 && event.request.method === 'GET') {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // Si la requête échoue et qu'on demande une page HTML, on renvoie la page hors ligne
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              // Pour les autres types de ressources, on renvoie une erreur
              return new Response('Erreur réseau', { status: 503 });
            });
        })
    );
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Fonction pour synchroniser les données stockées localement
async function syncData() {
  // Synchronisation des données stockées dans IndexedDB
  // À implémenter selon les besoins
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/lovable-uploads/logo-topcenter.png',
      badge: '/favicon.ico',
      data: data.url
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion du clic sur une notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
