// Service Worker for PWA functionality
const CACHE_NAME = 'mihtriii-site-v1';
const BASE_URL = self.location.origin;

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/favicon.svg',
  '/assets/avatar.JPG',
  '/assets/avatar.svg',
  '/assets/logo.svg',
  '/manifest.json',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  // Network first for dynamic content
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate for frequently updated content
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Skip external requests
  if (url.origin !== BASE_URL) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Request handling strategy
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  try {
    // Determine cache strategy based on request type
    let strategy = CACHE_STRATEGIES.NETWORK_FIRST;
    
    if (isStaticAsset(path)) {
      strategy = CACHE_STRATEGIES.CACHE_FIRST;
    } else if (isPageRequest(request)) {
      strategy = CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
    }
    
    switch (strategy) {
      case CACHE_STRATEGIES.CACHE_FIRST:
        return await cacheFirst(request);
      case CACHE_STRATEGIES.NETWORK_FIRST:
        return await networkFirst(request);
      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
        return await staleWhileRevalidate(request);
      default:
        return fetch(request);
    }
  } catch (error) {
    console.error('[SW] Request handling failed:', error);
    return await handleOffline(request);
  }
}

// Cache first strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network first strategy
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {
      // Ignore network errors in background update
    });
  
  // Return cached version immediately if available
  if (cached) {
    // Don't await the fetch promise - let it update in background
    fetchPromise;
    return cached;
  }
  
  // If no cached version, wait for network
  return await fetchPromise;
}

// Handle offline scenarios
async function handleOffline(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try to find cached version
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  
  // For page requests, return offline page
  if (isPageRequest(request)) {
    const offlinePage = await cache.match('/');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Return offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'You are currently offline and this content is not cached.',
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Helper functions
function isStaticAsset(path) {
  return (
    path.startsWith('/assets/') ||
    path.endsWith('.css') ||
    path.endsWith('.js') ||
    path.endsWith('.svg') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.png') ||
    path.endsWith('.webp') ||
    path.endsWith('.ico') ||
    path === '/manifest.json'
  );
}

function isPageRequest(request) {
  return (
    request.method === 'GET' &&
    request.headers.get('accept')?.includes('text/html')
  );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'offline-form-submission') {
    event.waitUntil(handleOfflineFormSubmissions());
  }
});

// Handle offline form submissions
async function handleOfflineFormSubmissions() {
  // This could be extended to handle form submissions made while offline
  console.log('[SW] Processing offline form submissions...');
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  const title = data.title || 'New Update';
  const options = {
    body: data.body || 'Check out what\'s new!',
    icon: '/assets/favicon.svg',
    badge: '/assets/favicon.svg',
    tag: data.tag || 'general',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if a window is already open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});

console.log('[SW] Service worker script loaded');