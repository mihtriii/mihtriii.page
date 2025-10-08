import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if PWA is supported
    setIsSupported('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window);

    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = 'standalone' in window.navigator && window.navigator.standalone;

      setIsInstalled(isStandalone || (isIOS && isInStandaloneMode));
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show install prompt after a delay (to not be too aggressive)
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('PWA installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');

    // Reset dismissed state after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // Don't show if not supported or already installed
  if (!isSupported || isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
            style={{ zIndex: 1040 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />

          {/* Install prompt */}
          <motion.div
            className="position-fixed bottom-0 start-50 translate-middle-x bg-body border rounded-top shadow-lg"
            style={{
              zIndex: 1041,
              width: '90vw',
              maxWidth: '400px',
              marginBottom: 'env(safe-area-inset-bottom)',
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-4">
              {/* Header */}
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  <i
                    className="bi bi-download"
                    style={{
                      fontSize: '1.5rem',
                      color: 'var(--bs-primary)',
                    }}
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-semibold">Install App</h6>
                  <p className="mb-0 text-secondary small">
                    Get the full experience with offline access and faster loading
                  </p>
                </div>
                <button
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={handleDismiss}
                  aria-label="Dismiss install prompt"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* Features */}
              <div className="mb-3">
                <div className="row g-2 text-center">
                  <div className="col-4">
                    <div className="text-primary">
                      <i className="bi bi-wifi-off d-block mb-1"></i>
                      <small className="text-secondary">Offline Access</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-primary">
                      <i className="bi bi-lightning-charge d-block mb-1"></i>
                      <small className="text-secondary">Fast Loading</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-primary">
                      <i className="bi bi-phone d-block mb-1"></i>
                      <small className="text-secondary">Native Feel</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm flex-grow-1"
                  onClick={handleDismiss}
                >
                  Not Now
                </button>
                <button className="btn btn-primary btn-sm flex-grow-1" onClick={handleInstallClick}>
                  <i className="bi bi-download me-1"></i>
                  Install
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for PWA status
export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check installation status
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = 'standalone' in window.navigator && window.navigator.standalone;

      setIsInstalled(isStandalone || (isIOS && isInStandaloneMode));
    };

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Check for service worker updates
    const checkForUpdates = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.addEventListener('updatefound', () => {
            setUpdateAvailable(true);
          });
        }
      }
    };

    checkInstalled();
    checkForUpdates();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshApp = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  };

  return {
    isInstalled,
    isOnline,
    updateAvailable,
    refreshApp,
  };
}
