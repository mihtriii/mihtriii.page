import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MobileNav from './MobileNav.jsx';
import { useI18n } from '../i18n/index.jsx';
import ThemeToggle from './ThemeToggle.jsx';

function useLocalTime(tz = 'Asia/Ho_Chi_Minh') {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
  return fmt;
}

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto');
  const location = useLocation();
  const time = useLocalTime();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tone, setTone] = useState(() => localStorage.getItem('tone') || 'warm');
  const [palette, setPalette] = useState(() => localStorage.getItem('palette') || 'earth');
  const [navHidden, setNavHidden] = useState(false);
  const headerRef = useRef(null);
  // Stabilize layout: auto-hide header is opt-in to avoid layout clashes
  const [autoHide, setAutoHide] = useState(
    () => (localStorage.getItem('ui:autoHideHeader') || 'false') === 'true'
  );

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'auto' && prefersDark);
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-tone', tone);
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('theme', theme);
    localStorage.setItem('tone', tone);
    localStorage.setItem('palette', palette);
  }, [theme, tone, palette]);

  // Auto-hide header on mobile when scrolling down (opt-in)
  useEffect(() => {
    if (!autoHide) {
      setNavHidden(false);
      return;
    }
    const mq = window.matchMedia('(max-width: 767.98px)');
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (!mq.matches) return setNavHidden(false);
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY;
        const down = dy > 6;
        const up = dy < -6;
        const nearTop = y < 40;
        if (nearTop) setNavHidden(false);
        else if (down) setNavHidden(true);
        else if (up) setNavHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const onChange = () => {
      if (!mq.matches) setNavHidden(false);
    };
    mq.addEventListener?.('change', onChange);
    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener?.('change', onChange);
    };
  }, [autoHide]);

  // Keep --header-offset synced with actual header height, and reduce when hidden on mobile
  useEffect(() => {
    const root = document.documentElement;
    const isMobile = () => window.matchMedia('(max-width: 767.98px)').matches;
    const compute = () => {
      const h = headerRef.current?.getBoundingClientRect().height || 72;
      const value = navHidden && isMobile() ? '8px' : `${Math.round(h)}px`;
      root.style.setProperty('--header-offset', value);
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
  }, [navHidden]);

  const toggleTheme = () =>
    setTheme((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'auto' : 'light'));
  const toggleTone = () => setTone((t) => (t === 'warm' ? 'cool' : 'warm'));
  const togglePalette = () => setPalette((p) => (p === 'earth' ? 'classic' : 'earth'));
  const toggleAutoHide = () =>
    setAutoHide((v) => {
      const nv = !v;
      localStorage.setItem('ui:autoHideHeader', String(nv));
      return nv;
    });
  const toggleLang = () => setLang((l) => (l === 'en' ? 'vi' : 'en'));

  // Prefetch non-home routes to speed up navigation
  const prefetch = {
    blog: () => import('../pages/Blog.jsx'),
    cv: () => import('../pages/CV.jsx'),
    repos: () => import('../pages/Repos.jsx'),
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      ref={headerRef}
      className={`sticky-top bg-body border-bottom header-auto${navHidden ? ' header-hidden' : ''}`}
    >
      <nav className="navbar glass navbar-expand-lg py-2" aria-label="Primary">
        <div className="container d-flex align-items-center justify-content-between">
          <Link
            to="/"
            className="navbar-brand fw-bold d-flex align-items-center text-decoration-none me-2"
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/logo.svg`}
              alt="Logo"
              width="28"
              height="28"
              className="me-2"
            />{' '}
            NMTrí
          </Link>
          <div className="d-none d-md-flex align-items-center ms-auto">
            <ul className="navbar-nav position-relative flex-row align-items-center">
              <li className="nav-item position-relative">
                <NavLink end to="/" className="nav-link px-3">
                  {({ isActive }) => (
                    <span className="position-relative d-inline-block">
                      {isActive && (
                        <motion.span layoutId="navHighlight" className="nav-highlight" />
                      )}
                      <span>{t('nav.about')}</span>
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item position-relative">
                <NavLink to="/blog" className="nav-link px-3" onMouseEnter={prefetch.blog}>
                  {({ isActive }) => (
                    <span className="position-relative d-inline-block">
                      {isActive && (
                        <motion.span layoutId="navHighlight" className="nav-highlight" />
                      )}
                      <span>{t('nav.blog')}</span>
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item position-relative">
                <NavLink to="/cv" className="nav-link px-3" onMouseEnter={prefetch.cv}>
                  {({ isActive }) => (
                    <span className="position-relative d-inline-block">
                      {isActive && (
                        <motion.span layoutId="navHighlight" className="nav-highlight" />
                      )}
                      <span>{t('nav.cv')}</span>
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item position-relative">
                <NavLink to="/repos" className="nav-link px-3" onMouseEnter={prefetch.repos}>
                  {({ isActive }) => (
                    <span className="position-relative d-inline-block">
                      {isActive && (
                        <motion.span layoutId="navHighlight" className="nav-highlight" />
                      )}
                      <span>{t('nav.repos')}</span>
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link px-3"
                  href="https://github.com/mihtriii"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('nav.github')}
                </a>
              </li>
            </ul>
            <div className="d-flex ms-2 gap-2 align-items-center">
              <span className="text-secondary small d-none d-md-inline">
                <i className="bi bi-clock"></i> {time}
              </span>
              <button
                onClick={toggleLang}
                className="btn btn-outline-secondary btn-sm"
                type="button"
                aria-label={`${t('common.language')}: ${lang}`}
                title={`${t('common.language')}: ${lang.toUpperCase()}`}
              >
                <i className="bi bi-translate"></i>
              </button>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                onClick={toggleTone}
                className="btn btn-outline-secondary btn-sm"
                type="button"
                aria-label={`Tone: ${tone}`}
                title={`Tone: ${tone}`}
              >
                <i className="bi bi-palette2"></i>
              </button>
              <button
                onClick={togglePalette}
                className="btn btn-outline-secondary btn-sm"
                type="button"
                aria-label={`Palette: ${palette}`}
                title={`Palette: ${palette}`}
              >
                <i className="bi bi-layers"></i>
              </button>
              <button
                onClick={toggleAutoHide}
                className="btn btn-outline-secondary btn-sm"
                type="button"
                aria-label={`Auto hide header: ${autoHide}`}
                title={`Auto hide header: ${autoHide ? 'on' : 'off'}`}
              >
                <i className="bi bi-chevron-bar-up"></i>
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center d-md-none ms-auto">
            <span className="text-secondary small me-2">
              <i className="bi bi-clock"></i> {time}
            </span>
            <button
              onClick={toggleLang}
              className="btn btn-outline-secondary btn-sm me-1"
              type="button"
              aria-label={`${t('common.language')}: ${lang}`}
            >
              <i className="bi bi-translate"></i>
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              onClick={toggleTone}
              className="btn btn-outline-secondary btn-sm me-1"
              type="button"
              aria-label={`Tone: ${tone}`}
              title={`Tone: ${tone}`}
            >
              <i className="bi bi-palette2"></i>
            </button>
            <button
              onClick={togglePalette}
              className="btn btn-outline-secondary btn-sm me-1"
              type="button"
              aria-label={`Palette: ${palette}`}
              title={`Palette: ${palette}`}
            >
              <i className="bi bi-layers"></i>
            </button>
            <button
              onClick={toggleAutoHide}
              className="btn btn-outline-secondary btn-sm me-1"
              type="button"
              aria-label={`Auto hide header: ${autoHide}`}
              title={`Auto hide header: ${autoHide ? 'on' : 'off'}`}
            >
              <i className="bi bi-chevron-bar-up"></i>
            </button>
            <button
              className="btn btn-primary btn-sm"
              type="button"
              aria-label={t('common.openMenu')}
              onClick={() => setMobileOpen(true)}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </nav>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
