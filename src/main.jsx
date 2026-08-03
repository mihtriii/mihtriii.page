import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import ToastContainer from './components/Toast.jsx';
import { I18nProvider } from './i18n/index.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { registerServiceWorker } from './utils/pwa.js';

function Root() {
  // Register service worker for PWA
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }
  }, []);

  return (
    <React.StrictMode>
      <ThemeProvider>
        <I18nProvider>
          <BrowserRouter>
            <ToastContainer />
            <App />
          </BrowserRouter>
        </I18nProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Root />);