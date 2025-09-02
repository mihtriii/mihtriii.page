import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

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

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'auto' && prefersDark);
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : t === 'dark' ? 'auto' : 'light'));

  return (
    <header className="sticky-top bg-body border-bottom">
      <nav className="navbar navbar-expand-md glass" aria-label="Primary">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold d-flex align-items-center text-decoration-none">
            <img src="/assets/logo.svg" alt="Logo" width="28" height="28" className="me-2" /> NMTrí
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#primaryNav"
            aria-controls="primaryNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="primaryNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink end to="/" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>About</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/blog" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>Blog</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/cv" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>CV</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/repos" className={({isActive}) => `nav-link${isActive ? ' active' : ''}`}>Repos</NavLink>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://github.com/mihtriii" target="_blank" rel="noopener noreferrer">GitHub</a>
              </li>
            </ul>
            <div className="d-flex ms-md-2 mt-2 mt-md-0 gap-2 align-items-center">
              <span className="text-secondary small d-none d-md-inline"><i className="bi bi-clock"></i> {time}</span>
              <button onClick={toggleTheme} className="btn btn-outline-secondary btn-sm" type="button" aria-label={`Theme: ${theme}`}>
                <i className="bi bi-circle-half"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
