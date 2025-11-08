// Service Worker pour A KI PRI SA YÉ
// Ce fichier gère le cache statique afin de permettre l'accès hors-ligne.

const CACHE_NAME = 'aki-pri-sa-ye-cache-v1';

// Liste des ressources à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/public/assets/icon_192.png',
  '/public/assets/icon_256.png',
  '/public/assets/icon_512.png',
  '/public/assets/icon_192.webp',
  '/public/assets/icon_256.webp',
  '/public/assets/icon_512.webp',
  '/public/assets/0d3bd9ac-734a-4f7d-b671-6dc715ae9e94_lg.webp',
  '/public/assets/84ba022c-9450-4e4f-841b-64d5363aaae1_lg.webp',
  '/public/assets/b3ced496-7272-4600-b46e-c14cf625667e_lg.webp',
  '/public/assets/logo_base.webp',
  '/public/assets/aki_pri_sa_ye_banner.webp',
  '/public/assets/aki_pri_sa_ye_banner_dark.webp'
];

// Événement d'installation : mise en cache des ressources statiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Événement d'activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Événement de récupération : stratégie cache-first avec mise à jour
self.addEventListener('fetch', (event) => {
  // Ne traite que les requêtes GET
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Retourne la version du cache
        return cachedResponse;
      }
      // Sinon, effectue la requête réseau et met à jour le cache
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // En cas d'échec réseau, retourne la page d'accueil
        return caches.match('/');
      });
    })
  );
});