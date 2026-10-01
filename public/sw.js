// Offline cache for returning visitors.
// v8: clears v7 caches, which could hold the home page stored under a missing
// /js/ file name after a deploy (that broke pages with "Failed to fetch
// dynamically imported module").
const CACHE_NAME = 'cafe-at-once-v8';
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => cacheName !== CACHE_NAME ? caches.delete(cacheName) : Promise.resolve())
    )).then(() => self.clients.claim())
  );
});

const isHtml = (response) => (response.headers.get('content-type') || '').includes('text/html');

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Guard: only same-origin http/https
  if (url.origin !== self.location.origin) return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Never touch API calls, Netlify functions, query strings or the Firebase Auth helper
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/.netlify/') || url.search) return;
  if (url.pathname.startsWith('/__/')) return;

  // HTML navigations: network first, so every visit gets the latest version.
  // Offline: the cached copy of this page, else the cached app shell.
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request)
            .then((cached) => cached || caches.match('/index.html'))
            .then((cached) => cached || Response.error())
        )
    );
    return;
  }

  // Built files (their names change with every deploy): cache first. Only real
  // files are stored, never an HTML page sent back for a file that doesn't exist.
  if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/css/') || url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached && !isHtml(cached)) return cached;
        return fetch(request).then((response) => {
          if (response.ok && !isHtml(response)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // Everything else (images, manifest): cache first, then network
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => Response.error()))
  );
});
