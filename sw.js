// Definiamo un nome e una versione per la nostra cache
const CACHE_NAME = 'todo-app-cache-v1';

// Elenco dei file fondamentali dell'app da salvare in cache (l' "App Shell")
const URLS_TO_CACHE = [
  // Rimosso il problematico '/', lasciamo solo 'index.html'
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// 1. Evento "install"
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aperta');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// 2. Evento "fetch"
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// 3. Evento "activate"
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