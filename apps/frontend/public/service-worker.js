/* service-worker.js - cached assets + FORCE_OFFLINE toggle + push + sync */
const CACHE_NAME = 'sports-central-v2.0';
const DYNAMIC_CACHE = 'sports-central-dynamic-v1';
let FORCE_OFFLINE = false;

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/offline-sports.html',
  '/offline-quiz.html',
  '/game/sports.js',
  '/game/sports.css',
  '/quiz/quiz.js',
  '/quiz/quiz.css',
  '/quiz/questions.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Cache strategies with battery optimization
const CACHE_STRATEGIES = {
  networkFirst: ['api', 'predictions', 'matches'],
  cacheFirst: ['images', 'styles', 'scripts', 'fonts'],
  staleWhileRevalidate: ['news', 'scores']
};

// Battery-aware fetch strategy
async function batteryAwareFetch(request) {
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();

      // If battery is low and not charging, prefer cache
      if (battery.level < 0.2 && !battery.charging) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
    }
  } catch (error) {
    console.log('Battery API not available');
  }

  return fetch(request);
}

self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.map(n => {
        if (n !== CACHE_NAME && n !== DYNAMIC_CACHE) {
          console.log('[SW] Deleting old cache', n);
          return caches.delete(n);
        }
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'ENABLE_OFFLINE') {
    FORCE_OFFLINE = true;
    console.log('[SW] FORCE_OFFLINE = true');
  } else if (data.type === 'DISABLE_OFFLINE') {
    FORCE_OFFLINE = false;
    console.log('[SW] FORCE_OFFLINE = false');
  } else if (data.type === 'CLEAR_CACHE') {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => console.log('[SW] caches cleared')));
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  event.respondWith((async () => {
    if (FORCE_OFFLINE) {
      if (req.destination === 'document') {
        const cached = await caches.match('/offline.html');
        if (cached) return cached;
      }
      const c = await caches.match(req);
      return c || (await caches.match('/offline.html'));
    }

    const cached = await caches.match(req);
    if (cached) return cached;

    try {
      const networkResponse = await batteryAwareFetch(req);
      if (url.origin === location.origin && !url.pathname.startsWith('/api/')) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(req, networkResponse.clone());
      }
      return networkResponse;
    } catch (err) {
      if (req.destination === 'document') {
        return caches.match('/offline.html');
      }
      const fallback = await caches.match(req);
      return fallback || new Response('', { status: 503, statusText: 'Service Unavailable' });
    }
  })());
});

self.addEventListener('sync', (event) => {
  console.log('[SW] sync', event.tag);
  if (event.tag === 'sync-predictions') {
    event.waitUntil(syncPredictions());
  }
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Sports Central';
  const options = {
    body: data.body || 'New update',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: { url: data.url || '/' },
    actions: data.actions || [{ action: 'open', title: 'Open App' }]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});

async function syncPredictions() {
  try {
    console.log('[SW] syncPredictions stub');
    // Implement queued sync logic if needed
  } catch (err) {
    console.error('[SW] syncPredictions error', err);
  }
}