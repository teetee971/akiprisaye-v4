self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => console.log('Service Worker activé'));
self.addEventListener('fetch', (event) => {
  // Simple passthrough: pas de cache pour le moment
});
