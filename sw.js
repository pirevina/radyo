const CACHE_NAME = 'radyo-kirkyama-v8.7';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './songs.json',
  './manifest.json',
  './assets/logo.svg',
  './assets/logo.svg?v=4',
  './assets/favicon-32.png',
  './assets/favicon-32.png?v=4',
  './assets/apple-touch-icon.png',
  './assets/apple-touch-icon.png?v=4',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-512.png?v=4',
  './assets/icon-maskable-512.png',
  './assets/player-idle-cover.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Audio stream veya range istekleri tarayıcı tarafında doğrudan network'e gitsin
  if (event.request.headers.get('range') || url.pathname.includes('/stream/') || url.pathname.endsWith('.mp3')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Arka planda güncelle (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
