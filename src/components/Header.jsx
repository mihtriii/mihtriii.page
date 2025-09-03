import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MobileNav from './MobileNav.jsx';

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
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto');
  const location = useLocation();
  const time = useLocalTime();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tone, setTone] = useState(() => localStorage.getItem('tone') || 'warm');
  const [palette, setPalette] = useState(() => localStorage.getItem('palette') || 'earth');

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

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : t === 'dark' ? 'auto' : 'light'));
  const toggleTone = () => setTone(t => (t === 'warm' ? 'cool' : 'warm'));
  const togglePalette = () => setPalette(p => (p === 'earth' ? 'classic' : 'earth'));

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky-top bg-body border-bottom">
      <nav className="navbar glass navbar-expand-lg py-2" aria-label="Primary">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand fw-bold d-flex align-items-center text-decoration-none me-2">
            <img src={`${import.meta.env.BASE_URL}assets/logo.svg`} alt="Logo" width="28" height="28" className="me-2" /> NMTrí
          </Link>
          <div className="d-none d-md-flex align-items-center ms-auto">
            <ul className="navbar-nav position-relative flex-row align-items-center">
              <li className="nav-item position-relative">
                <NavLink end to="/" className="nav-link px-3">
                  {({ isActive }) => (
                    <span className="position-relative d-inline-block">
                      {isActive && <motion.span layoutId="navHighlight" className="nav-highlight" />}
                      <span>About</span>
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item position-relative">
                <NavLink to="/blog" className="nav-link px-3">
                  {({ isActive }) => (
                    <span className="position-relative d-inline-block">
                      {isActive && <motion.span layoutId="navHighlight" className="nav-highlight" />}
                      <span>Blog</span>
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item position-relative">
                <NavLink to="/cv" className="nav-link px-3">
                  {({ isActive }) => (
                    <span className="position-relative d-inline-block">
                      {isActive && <motion.span layoutId="navHighlight" className="nav-highlight" />}
                      <span>CV</span>
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item position-relative">
                <NavLink to="/repos" className="nav-link px-3">
                  {({ isActive }) => (
                    <span className="position-relative d-inline-block">
                      {isActive && <motion.span layoutId="navHighlight" className="nav-highlight" />}
                      <span>Repos</span>
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link px-3" href="https://github.com/mihtriii" target="_blank" rel="noopener noreferrer">GitHub</a>
              </li>
            </ul>
            <div className="d-flex ms-2 gap-2 align-items-center">
              <span className="text-secondary small d-none d-md-inline"><i className="bi bi-clock"></i> {time}</span>
              <button onClick={toggleTheme} className="btn btn-outline-secondary btn-sm" type="button" aria-label={`Theme: ${theme}`}>
                <i className="bi bi-circle-half"></i>
              </button>
              <button onClick={toggleTone} className="btn btn-outline-secondary btn-sm" type="button" aria-label={`Tone: ${tone}`} title={`Tone: ${tone}`}>
                <i className="bi bi-palette2"></i>
              </button>
              <button onClick={togglePalette} className="btn btn-outline-secondary btn-sm" type="button" aria-label={`Palette: ${palette}`} title={`Palette: ${palette}`}>
                <i className="bi bi-layers"></i>
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center d-md-none ms-auto">
            <span className="text-secondary small me-2"><i className="bi bi-clock"></i> {time}</span>
            <button onClick={toggleTheme} className="btn btn-outline-secondary btn-sm me-1" type="button" aria-label={`Theme: ${theme}`}>
              <i className="bi bi-circle-half"></i>
            </button>
            <button onClick={toggleTone} className="btn btn-outline-secondary btn-sm me-1" type="button" aria-label={`Tone: ${tone}`} title={`Tone: ${tone}`}>
              <i className="bi bi-palette2"></i>
            </button>
            <button onClick={togglePalette} className="btn btn-outline-secondary btn-sm me-1" type="button" aria-label={`Palette: ${palette}`} title={`Palette: ${palette}`}>
              <i className="bi bi-layers"></i>
            </button>
            <button className="btn btn-primary btn-sm" type="button" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </nav>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
