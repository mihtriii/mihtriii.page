import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Accessibility Context for managing a11y preferences
 */
const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    // Load saved preferences
    const saved = localStorage.getItem('accessibility-preferences');
    return saved
      ? JSON.parse(saved)
      : {
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          highContrast: window.matchMedia('(prefers-contrast: high)').matches,
          largeText: false,
          focusVisible: true,
          screenReaderOptimized: false,
          keyboardNavigation: true,
        };
  });

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));

    // Apply CSS custom properties
    const root = document.documentElement;

    // Reduced motion
    if (preferences.reducedMotion) {
      root.style.setProperty('--motion-duration', '0ms');
      root.style.setProperty('--motion-distance', '0px');
    } else {
      root.style.removeProperty('--motion-duration');
      root.style.removeProperty('--motion-distance');
    }

    // High contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (preferences.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Focus visible
    if (preferences.focusVisible) {
      root.classList.add('focus-visible-enabled');
    } else {
      root.classList.remove('focus-visible-enabled');
    }
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

/**
 * Accessibility Settings Panel
 */
export function AccessibilityPanel({ isOpen, onClose }) {
  const { preferences, updatePreference } = useAccessibility();

  return (
    <motion.div
      className={`accessibility-panel ${isOpen ? 'show' : ''}`}
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 300 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '350px',
        backgroundColor: 'var(--bs-body-bg)',
        border: '1px solid var(--bs-border-color)',
        borderRight: 'none',
        zIndex: 1050,
        overflowY: 'auto',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
      }}
      role="dialog"
      aria-labelledby="a11y-panel-title"
      aria-modal="true"
    >
      <div className="p-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 id="a11y-panel-title" className="h5 mb-0">
            <i className="bi bi-universal-access me-2" aria-hidden="true"></i>
            Accessibility Settings
          </h3>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
            aria-label="Close accessibility panel"
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        {/* Settings */}
        <div className="d-grid gap-3">
          {/* Reduced Motion */}
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="reduced-motion"
              checked={preferences.reducedMotion}
              onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="reduced-motion">
              <strong>Reduce Motion</strong>
              <div className="small text-muted">Minimizes animations and transitions</div>
            </label>
          </div>

          {/* High Contrast */}
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="high-contrast"
              checked={preferences.highContrast}
              onChange={(e) => updatePreference('highContrast', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="high-contrast">
              <strong>High Contrast</strong>
              <div className="small text-muted">Increases color contrast for better visibility</div>
            </label>
          </div>

          {/* Large Text */}
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="large-text"
              checked={preferences.largeText}
              onChange={(e) => updatePreference('largeText', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="large-text">
              <strong>Large Text</strong>
              <div className="small text-muted">Increases text size for better readability</div>
            </label>
          </div>

          {/* Focus Visible */}
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="focus-visible"
              checked={preferences.focusVisible}
              onChange={(e) => updatePreference('focusVisible', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="focus-visible">
              <strong>Enhanced Focus</strong>
              <div className="small text-muted">
                Shows clearer focus indicators for keyboard navigation
              </div>
            </label>
          </div>

          {/* Screen Reader Optimized */}
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="screen-reader"
              checked={preferences.screenReaderOptimized}
              onChange={(e) => updatePreference('screenReaderOptimized', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="screen-reader">
              <strong>Screen Reader Mode</strong>
              <div className="small text-muted">Optimizes interface for screen readers</div>
            </label>
          </div>

          {/* Keyboard Navigation */}
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="keyboard-nav"
              checked={preferences.keyboardNavigation}
              onChange={(e) => updatePreference('keyboardNavigation', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="keyboard-nav">
              <strong>Keyboard Navigation</strong>
              <div className="small text-muted">
                Enables enhanced keyboard shortcuts and navigation
              </div>
            </label>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-4 pt-3 border-top">
          <h4 className="h6 mb-3">Keyboard Shortcuts</h4>
          <div className="small text-muted">
            <div className="d-flex justify-content-between mb-1">
              <span>Skip to main content</span>
              <kbd>Tab</kbd>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Open accessibility panel</span>
              <kbd>Alt + A</kbd>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Navigate sections</span>
              <kbd>Arrow Keys</kbd>
            </div>
            <div className="d-flex justify-content-between">
              <span>Activate element</span>
              <kbd>Enter / Space</kbd>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4 pt-3 border-top">
          <button
            className="btn btn-outline-warning btn-sm w-100"
            onClick={() => {
              const defaultPrefs = {
                reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                highContrast: window.matchMedia('(prefers-contrast: high)').matches,
                largeText: false,
                focusVisible: true,
                screenReaderOptimized: false,
                keyboardNavigation: true,
              };
              Object.entries(defaultPrefs).forEach(([key, value]) => {
                updatePreference(key, value);
              });
            }}
          >
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
            Reset to Defaults
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Accessibility toggle button
 */
export function AccessibilityToggle() {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut (Alt + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        className="btn btn-outline-secondary position-fixed"
        style={{
          top: '50%',
          right: isOpen ? '350px' : '20px',
          transform: 'translateY(-50%)',
          zIndex: 1051,
          transition: 'right 0.3s ease',
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close accessibility settings' : 'Open accessibility settings'}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        title="Accessibility Settings (Alt + A)"
      >
        <i className="bi bi-universal-access" aria-hidden="true"></i>
      </button>

      <AccessibilityPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Backdrop */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"
          style={{ zIndex: 1049 }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

/**
 * Skip to main content link
 */
export function SkipLink() {
  return (
    <a
      className="skip-link position-absolute bg-primary text-white px-3 py-2 text-decoration-none rounded"
      href="#main-content"
      style={{
        top: '-100px',
        left: '10px',
        zIndex: 9999,
        transition: 'top 0.3s',
      }}
      onFocus={(e) => (e.target.style.top = '10px')}
      onBlur={(e) => (e.target.style.top = '-100px')}
    >
      Skip to main content
    </a>
  );
}

/**
 * Live region for announcements
 */
export function LiveRegion() {
  const [announcement, setAnnouncement] = useState('');

  // Global function to announce messages
  useEffect(() => {
    window.announceToScreenReader = (message) => {
      setAnnouncement(message);
      setTimeout(() => setAnnouncement(''), 1000);
    };

    return () => {
      delete window.announceToScreenReader;
    };
  }, []);

  return (
    <div aria-live="polite" aria-atomic="true" className="visually-hidden" role="status">
      {announcement}
    </div>
  );
}
