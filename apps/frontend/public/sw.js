
/* sw.js - Enhanced Sports Central PWA Service Worker */
const CACHE_NAME = 'sports-central-v3.0';
const DYNAMIC_CACHE = 'sports-central-dynamic-v2';

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

/* INSTALL */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v3.0...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ACTIVATE */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v3.0...');
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(n => {
          if (n !== CACHE_NAME && n !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', n);
            return caches.delete(n);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

/* FETCH with Network-First for API calls */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const { url } = event.request;
  const isAPI = url.includes('/api/');

  event.respondWith((async () => {
    // Network-first for API calls
    if (isAPI) {
      try {
        const response = await fetch(event.request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(event.request, response.clone());
        return response;
      } catch (err) {
        const cached = await caches.match(event.request);
        return cached || new Response('Offline', { status: 503 });
      }
    }

    // Cache-first for static assets
    const cached = await caches.match(event.request);
    if (cached) return cached;

    try {
      const response = await fetch(event.request);
      if (response && response.status === 200 && response.type === 'basic') {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (err) {
      if (event.request.destination === 'document') {
        return caches.match('/offline.html');
      }
      return new Response('Service unavailable', { status: 503 });
    }
  })());
});

/* BACKGROUND SYNC */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-predictions') {
    event.waitUntil(syncPredictions());
  } else if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncPredictions() {
  try {
    const cache = await caches.open('predictions-queue');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        await fetch(request.clone());
        await cache.delete(request);
        console.log('[SW] Synced prediction:', request.url);
      } catch (err) {
        console.error('[SW] Failed to sync:', err);
      }
    }
  } catch (err) {
    console.error('[SW] Sync predictions error:', err);
  }
}

async function syncNotifications() {
  console.log('[SW] Syncing notifications...');
}

/* PUSH NOTIFICATIONS */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const title = data.title || 'Sports Central';
  const options = {
    body: data.body || 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Open App', icon: '/icons/icon-72x72.png' },
      { action: 'close', title: 'Close', icon: '/icons/icon-72x72.png' }
    ],
    tag: data.tag || 'general',
    requireInteraction: false,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/* NOTIFICATION CLICK */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

/* PERIODIC BACKGROUND SYNC (if supported) */
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-scores') {
    event.waitUntil(updateLiveScores());
  }
});

async function updateLiveScores() {
  try {
    const response = await fetch('/api/backend/predictions/live');
    const data = await response.json();
    
    // Cache updated scores
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put('/api/backend/predictions/live', new Response(JSON.stringify(data)));
    
    console.log('[SW] Updated live scores');
  } catch (err) {
    console.error('[SW] Failed to update scores:', err);
  }
}

/* MESSAGE HANDLER */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(names => 
        Promise.all(names.map(name => caches.delete(name)))
      )
    );
  }
});
