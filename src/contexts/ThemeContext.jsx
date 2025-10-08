import React, { createContext, useContext, useEffect, useState } from 'react';

// Color themes
const colorThemes = {
  earth: {
    name: 'Earth',
    primary: '#8a7a5c',
    secondary: '#c97a40',
    accent: '#6b8f71',
    description: 'Warm earth tones',
  },
  ocean: {
    name: 'Ocean',
    primary: '#2c5aa0',
    secondary: '#1976d2',
    accent: '#0288d1',
    description: 'Cool ocean blues',
  },
  forest: {
    name: 'Forest',
    primary: '#2e7d32',
    secondary: '#388e3c',
    accent: '#43a047',
    description: 'Natural forest greens',
  },
  sunset: {
    name: 'Sunset',
    primary: '#e65100',
    secondary: '#ff5722',
    accent: '#ff9800',
    description: 'Warm sunset oranges',
  },
  lavender: {
    name: 'Lavender',
    primary: '#7b1fa2',
    secondary: '#9c27b0',
    accent: '#ba68c8',
    description: 'Elegant purples',
  },
  classic: {
    name: 'Classic',
    primary: '#0d6efd',
    secondary: '#6f42c1',
    accent: '#20c997',
    description: 'Bootstrap default',
  },
};

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Apply theme to CSS variables
function applyTheme(colorTheme, customAccent = null) {
  const root = document.documentElement;
  const theme = colorThemes[colorTheme];

  if (theme) {
    const primary = hexToRgb(theme.primary);
    const secondary = hexToRgb(theme.secondary);
    const accent = customAccent ? hexToRgb(customAccent) : hexToRgb(theme.accent);

    if (primary && secondary && accent) {
      root.style.setProperty('--brand-primary', theme.primary);
      root.style.setProperty('--brand-secondary', theme.secondary);
      root.style.setProperty('--brand-accent', customAccent || theme.accent);
      root.style.setProperty('--brand-primary-rgb', `${primary.r}, ${primary.g}, ${primary.b}`);
      root.style.setProperty(
        '--brand-secondary-rgb',
        `${secondary.r}, ${secondary.g}, ${secondary.b}`
      );
      root.style.setProperty('--brand-accent-rgb', `${accent.r}, ${accent.g}, ${accent.b}`);
      root.style.setProperty(
        '--particles-color',
        `rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, 0.55)`
      );
    }
  }
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved && saved !== 'auto') return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('theme') || 'auto';
  });

  const [colorTheme, setColorTheme] = useState(() => {
    return localStorage.getItem('colorTheme') || 'earth';
  });

  const [customAccent, setCustomAccent] = useState(() => {
    return localStorage.getItem('customAccent') || null;
  });

  // Auto theme detection
  useEffect(() => {
    if (themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => setDarkMode(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      setDarkMode(mediaQuery.matches);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    applyTheme(colorTheme, customAccent);
  }, [darkMode, colorTheme, customAccent]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    if (customAccent) {
      localStorage.setItem('customAccent', customAccent);
    } else {
      localStorage.removeItem('customAccent');
    }
  }, [customAccent]);

  const toggleTheme = () => {
    const modes = ['light', 'dark', 'auto'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setThemeMode(nextMode);

    if (nextMode !== 'auto') {
      setDarkMode(nextMode === 'dark');
    }
  };

  const setColorThemeWithPreview = (theme) => {
    setColorTheme(theme);
    // Reset custom accent when changing theme
    setCustomAccent(null);
  };

  const value = {
    darkMode,
    themeMode,
    colorTheme,
    customAccent,
    colorThemes,
    toggleTheme,
    setColorTheme: setColorThemeWithPreview,
    setCustomAccent,
    currentTheme: colorThemes[colorTheme],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
