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

      <header ref={headerRef} className="sticky-top header-auto">
        <nav className="navbar glass py-2 px-1" aria-label="Primary">
          <div className="container d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <Link to="/" className="navbar-brand fw-bold d-flex align-items-center text-decoration-none m-0">
                <img
                  src={`${import.meta.env.BASE_URL}assets/logo.svg`}
                  alt="Logo"
                  width="28"
                  height="28"
                  className="me-2 brand-logo"
                />
                <span className="font-display fw-bold brand-name" style={{ fontSize: '1.25rem', letterSpacing: '-0.01em' }}>
                  NMTrí
                </span>
              </Link>
              
              {/* Research Active Status Badge */}
              <div className="d-none d-md-flex align-items-center gap-2 px-2 py-1 rounded-pill status-pill">
                <span className="pulse-dot" />
                <span className="status-text font-mono" style={{ fontSize: '0.72rem' }}>
                  Research @ AiTA Lab
                </span>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="d-none d-xl-flex align-items-center gap-2 ms-auto">
              <PillNav t={t} prefetchData={prefetch} />
              
              <a
                href={`${import.meta.env.BASE_URL}CV_NguyenMinhTri.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-roman btn-roman-ghost btn-sm d-inline-flex align-items-center gap-1 ms-2"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                title="Download Curriculum Vitae PDF"
              >
                <i className="bi bi-file-earmark-pdf"></i>
                <span>CV.pdf</span>
              </a>

              <button
                onClick={toggleTheme}
                className="btn-roman btn-roman-ghost btn-sm btn-icon"
                type="button"
                aria-label={`Theme: ${themeMode}`}
                title={`Theme: ${themeMode}`}
                style={{ width: 36, height: 36, padding: 0 }}
              >
                <i className={`bi ${getThemeIcon()}`}></i>
              </button>
            </div>

            {/* Mobile / Tablet controls */}
            <div className="d-flex d-xl-none align-items-center gap-2 ms-auto">
              <button
                onClick={toggleTheme}
                className="btn-roman btn-roman-ghost btn-sm btn-icon"
                type="button"
                aria-label={`Theme: ${themeMode}`}
                style={{ width: 36, height: 36, padding: 0 }}
              >
                <i className={`bi ${getThemeIcon()}`}></i>
              </button>
              <button
                className="btn-roman btn-roman-primary btn-sm"
                type="button"
                aria-label={t('common.openMenu')}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
                style={{ height: 36, padding: '0 0.75rem' }}
              >
                <i className="bi bi-list fs-6 me-1"></i>
                <span className="small fw-semibold">{t('common.menu')}</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}