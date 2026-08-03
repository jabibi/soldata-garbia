// Service worker mínimo: no cachea nada, solo cumple el requisito de
// instalabilidad de PWA (un fetch handler activo bajo HTTPS).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
