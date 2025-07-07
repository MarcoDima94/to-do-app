// Un service worker "pass-through" che non usa la cache
// ma permette all'app di essere riconosciuta come PWA.

self.addEventListener('install', (event) => {
  // Salta la fase di attesa per attivare subito il service worker
  self.skipWaiting(); 
});

self.addEventListener('fetch', (event) => {
  // Non fa nulla con la cache, passa semplicemente la richiesta alla rete.
  // Questo evita qualsiasi problema di file non trovati o pagine bianche.
  event.respondWith(fetch(event.request));
});