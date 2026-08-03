import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PillNav from './PillNav.jsx';
import MobileNav from './MobileNav.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function Header() {
  const { t } = useI18n();
  const { themeMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef(null);

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep --header-offset synced with actual header height
  useEffect(() => {
    const root = document.documentElement;
    const compute = () => {
      const h = headerRef.current?.getBoundingClientRect().height || 72;
      root.style.setProperty('--header-offset', `${Math.round(h)}px`);
    };
    compute();
    const onResize = () => compute();
    const ro = new ResizeObserver(compute);
    if (headerRef.current) ro.observe(headerRef.current);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  // Prefetch non-home routes
  const prefetch = {
    blog: () => import('../pages/Blog.jsx'),
    cv: () => import('../pages/CV.jsx'),
    repos: () => import('../pages/Repos.jsx'),
    moments: () => import('../pages/Moments.jsx'),
    news: () => import('../pages/News.jsx'),
    publications: () => import('../pages/Publications.jsx'),
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Theme icon helper
  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return 'bi-sun';
      case 'dark': return 'bi-moon-stars';
      default: return 'bi-circle-half';
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t('common.skipToContent')}
      </a>

      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />

      <header ref={headerRef} className="sticky-top bg-body border-bottom header-auto">
        <nav className="navbar glass py-2" aria-label="Primary">
          <div className="container d-flex align-items-center justify-content-between">
            <Link to="/" className="navbar-brand fw-bold d-flex align-items-center text-decoration-none me-2">
              <img
                src={`${import.meta.env.BASE_URL}assets/logo.svg`}
                alt="Logo"
                width="28"
                height="28"
                className="me-2"
              />
              <span className="font-display fw-bold" style={{ fontSize: '1.25rem' }}>NMTrí</span>
            </Link>

            {/* Desktop nav */}
            <div className="d-none d-xl-flex align-items-center ms-auto">
              <PillNav t={t} prefetchData={prefetch} />
              <button
                onClick={toggleTheme}
                className="btn btn-outline-secondary btn-sm ms-2"
                type="button"
                aria-label={`Theme: ${themeMode}`}
                title={`Theme: ${themeMode}`}
              >
                <i className={`bi ${getThemeIcon()}`}></i>
              </button>
            </div>

            {/* Mobile controls: theme + menu only */}
            <div className="d-flex d-xl-none align-items-center ms-auto">
              <button
                onClick={toggleTheme}
                className="btn btn-outline-secondary btn-sm me-1"
                type="button"
                aria-label={`Theme: ${themeMode}`}
              >
                <i className={`bi ${getThemeIcon()}`}></i>
              </button>
              <button
                className="btn btn-roman-primary btn-sm"
                type="button"
                aria-label={t('common.openMenu')}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
              >
                <i className="bi bi-list"></i>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}