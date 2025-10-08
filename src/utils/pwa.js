// PWA Service Worker registration and management
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registered successfully:', registration);

    // Check for updates on page load
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('New service worker installing...');

      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('New service worker installed, update available');
          // Dispatch custom event for update notification
          window.dispatchEvent(new CustomEvent('sw-update-available', {
            detail: { registration }
          }));
        }
      });
    });

    // Handle service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATE_READY') {
        console.log('Service worker update ready');
        window.dispatchEvent(new CustomEvent('sw-update-ready'));
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return false;
  }
}

// Update service worker
export async function updateServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service Worker update triggered');
      return true;
    }
  } catch (error) {
    console.error('Service Worker update failed:', error);
  }
  
  return false;
}

// Unregister service worker (for development)
export async function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const result = await registration.unregister();
      console.log('Service Worker unregistered:', result);
      return result;
    }
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
  }
  
  return false;
}

// Get cache status
export async function getCacheStatus() {
  if (!('caches' in window)) {
    return { supported: false };
  }

  try {
    const cacheNames = await caches.keys();
    const cacheDetails = await Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        return {
          name,
          size: keys.length,
          urls: keys.map(req => req.url)
        };
      })
    );

    return {
      supported: true,
      caches: cacheDetails,
      totalCaches: cacheNames.length,
      totalCachedRequests: cacheDetails.reduce((sum, cache) => sum + cache.size, 0)
    };
  } catch (error) {
    console.error('Failed to get cache status:', error);
    return { supported: true, error: error.message };
  }
}

// Clear all caches
export async function clearAllCaches() {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('All caches cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear caches:', error);
    return false;
  }
}

// Check if app is running standalone (installed as PWA)
export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
}

// Get installation status
export function getInstallationStatus() {
  const isStandaloneMode = isStandalone();
  const isInstallPromptSupported = 'BeforeInstallPromptEvent' in window;
  const isServiceWorkerSupported = 'serviceWorker' in navigator;
  
  return {
    isInstalled: isStandaloneMode,
    canInstall: isInstallPromptSupported && !isStandaloneMode,
    isPWASupported: isServiceWorkerSupported,
    isStandalone: isStandaloneMode
  };
}

// Network status monitoring
export function createNetworkMonitor() {
  const callbacks = {
    online: [],
    offline: []
  };

  const notifyCallbacks = (type) => {
    callbacks[type].forEach(callback => callback());
  };

  const handleOnline = () => {
    console.log('App is online');
    notifyCallbacks('online');
  };

  const handleOffline = () => {
    console.log('App is offline');
    notifyCallbacks('offline');
  };

  // Add event listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return {
    isOnline: () => navigator.onLine,
    onOnline: (callback) => {
      callbacks.online.push(callback);
    },
    onOffline: (callback) => {
      callbacks.offline.push(callback);
    },
    destroy: () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      callbacks.online.length = 0;
      callbacks.offline.length = 0;
    }
  };
}

// Background sync registration
export async function registerBackgroundSync(tag, data) {
  if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
    console.log('Background Sync not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    
    // Store data for sync
    if (data) {
      localStorage.setItem(`bg-sync-${tag}`, JSON.stringify(data));
    }
    
    console.log('Background sync registered:', tag);
    return true;
  } catch (error) {
    console.error('Background sync registration failed:', error);
    return false;
  }
}

// Push notification subscription
export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Push notification permission denied');
      return null;
    }

    // You would need to replace this with your actual VAPID public key
    const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey
    });

    console.log('Push notification subscription created:', subscription);
    return subscription;
  } catch (error) {
    console.error('Push notification subscription failed:', error);
    return null;
  }
}