const CACHE_NAME = 'sai-admin-v1';
const ASSETS_TO_CACHE = [
  '/admin.html',
  '/css/styles.css',
  '/js/admin.js',
  '/js/supabase-client.js',
  '/images/sai_logo_icon.webp',
  '/images/sai_logo_icon_192.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Never cache Supabase API calls
  if (event.request.url.includes('supabase.co')) return;

  // Network-first for HTML and JS (always get fresh admin code)
  if (event.request.url.endsWith('.html') || event.request.url.endsWith('.js') || event.request.url === event.request.referrer) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Cache-first for images and CSS
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      });
    })
  );
});
