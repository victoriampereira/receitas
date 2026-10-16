// Receitas: cache leve para abrir rápido e funcionar como app instalado.
const CACHE = "receitas-v10";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-r-192.png", "icon-r-512.png", "apple-touch-icon-r.png", "favicon-r.png", "papel.png", "flores/orquidea.png", "flores/hibisco-vermelho.png", "flores/flor-branca.png", "flores/buganvilia.png", "flores/plumeria-amarela.png", "flores/hibisco-laranja.png", "flores/plumeria-rosa.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request, {cache:"no-cache"}).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request)));
});
