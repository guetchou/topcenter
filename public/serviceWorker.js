
const CACHE_NAME = 'topcenter-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
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
  );
});

// Stratégie de cache : Network first avec fallback sur le cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cloner la réponse pour la mettre en cache
        const clonedResponse = response.clone();
        
        // Ouvrir le cache et y stocker la réponse
        caches.open(CACHE_NAME)
          .then((cache) => {
            // Ne mettre en cache que les requêtes qui ont réussi
            if (event.request.method === 'GET' && response.status === 200) {
              cache.put(event.request, clonedResponse);
            }
          });
        
        return response;
      })
      .catch(() => {
        // En cas d'échec de la requête réseau, essayer le cache
        return caches.match(event.request);
      })
  );
});

// Nettoyage des anciens caches lors de l'activation
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
    })
  );
});
