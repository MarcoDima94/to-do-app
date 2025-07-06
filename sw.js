// Definisce un nome e la versione della cache
const CACHE_NAME = 'todo-app-cache-v1';
// Lista dei file fondamentali dell'app da salvare in cache
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'images/icon-192x192.png',
    'images/icon-512x512.png'
];

// Evento 'install': si verifica quando il Service Worker viene installato
self.addEventListener('install', event => {
    // Il browser attende che la cache sia pronta
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aperta');
                // Aggiunge tutti i file della nostra lista alla cache
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento 'fetch': si verifica ogni volta che l'app richiede una risorsa (un file, un'immagine, ecc.)
self.addEventListener('fetch', event => {
    event.respondWith(
        // Controlla se la risorsa richiesta è già nella cache
        caches.match(event.request)
            .then(response => {
                // Se la risorsa è nella cache, la restituisce
                if (response) {
                    return response;
                }
                // Altrimenti, la richiede alla rete
                return fetch(event.request);
            })
    );
});