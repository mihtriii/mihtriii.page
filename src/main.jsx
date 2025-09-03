import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';
import ScrollProgress from './components/ScrollProgress.jsx';
import ToastContainer from './components/Toast.jsx';
import BackToTop from './components/BackToTop.jsx';
import RippleProvider from './components/RippleProvider.jsx';
import MobileTabBar from './components/MobileTabBar.jsx';
import { I18nProvider } from './i18n/index.jsx';

// Simple media query hook to guard mobile-only UI
function useMediaQuery(query) {
  const getMatch = (q) => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(q).matches;
  };
  const [matches, setMatches] = useState(getMatch(query));
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    // Ensure state is synced on mount
    setMatches(mql.matches);
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);
  return matches;
}

function Root() {
  const isMobile = useMediaQuery('(max-width: 767.98px)');
  return (
    <React.StrictMode>
      <I18nProvider>
        <BrowserRouter>
          <ScrollProgress />
          <ToastContainer />
          <BackToTop />
          <RippleProvider />
          {isMobile && <MobileTabBar />}
          <App />
        </BrowserRouter>
      </I18nProvider>
    </React.StrictMode>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Root />);
