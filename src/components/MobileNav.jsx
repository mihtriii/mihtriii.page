import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n/index.jsx';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { social } from '../config/site.js';

export default function MobileNav({ open, onClose }) {
  const { t } = useI18n();
  const { themeMode, toggleTheme } = useTheme();
  const firstLinkRef = useRef(null);
  const drawerRef = useRef(null);
  const lastActive = useRef(null);

  useEffect(() => {
    if (open) {
      lastActive.current = document.activeElement;

      // Robust scroll lock (works reliably on iOS Safari)
      const scrollY = window.scrollY || window.pageYOffset;
      const prev = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        width: document.body.style.width,
        overscrollBehavior: document.documentElement.style.overscrollBehavior,
      };
      document.documentElement.style.overscrollBehavior = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';

      const tm = setTimeout(() => firstLinkRef.current?.focus(), 50);
      const onKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);

      // Focus trap within drawer
      const trap = (e) => {
        if (e.key !== 'Tab' || !drawerRef.current) return;
        const focusables = Array.from(drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.hasAttribute('inert') && (el.tabIndex ?? 0) >= 0);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      };
      drawerRef.current?.addEventListener('keydown', trap);
      return () => {
        clearTimeout(tm);
        window.removeEventListener('keydown', onKey);
        drawerRef.current?.removeEventListener('keydown', trap);
        const y = -parseInt(document.body.style.top || '0', 10) || 0;
        document.body.style.overflow = prev.overflow;
        document.body.style.position = prev.position;
        document.body.style.top = prev.top;
        document.body.style.left = prev.left;
        document.body.style.right = prev.right;
        document.body.style.width = prev.width;
        document.documentElement.style.overscrollBehavior = prev.overscrollBehavior;
        window.scrollTo(0, y);
      };
    } else {
      lastActive.current && lastActive.current.focus?.();
    }
  }, [open, onClose]);

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return 'bi-sun-fill';
      case 'dark': return 'bi-moon-stars-fill';
      default: return 'bi-circle-half';
    }
  };

  const navItems = [
    { to: '/', label: t('nav.about'), icon: 'bi-person-badge', exact: true },
    { to: '/cv', label: t('nav.cv'), icon: 'bi-file-earmark-person' },
    { to: '/publications', label: t('nav.publications'), icon: 'bi-journal-richtext' },
    { to: '/blog', label: t('nav.blog'), icon: 'bi-journal-text' },
    { to: '/moments', label: t('nav.moments'), icon: 'bi-camera-reels' },
    { to: '/repos', label: t('nav.repos'), icon: 'bi-git' },
    { to: '/news', label: t('nav.news'), icon: 'bi-newspaper' },
  ];

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="mobile-overlay"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.nav
            key="drawer"
            className="mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header / Profile banner */}
            <div className="mobile-drawer-header d-flex align-items-center justify-content-between p-3 border-bottom border-zinc">
              <div className="d-flex align-items-center gap-2">
                <img
                  className="rounded-circle border border-zinc"
                  src={`${import.meta.env.BASE_URL}assets/avatar.JPG`}
                  alt="Nguyễn Minh Trí"
                  width="40"
                  height="40"
                />
                <div>
                  <div className="font-display fw-bold h6 mb-0 text-primary">Nguyễn Minh Trí</div>
                  <div className="text-gold font-mono small" style={{ fontSize: '0.7rem' }}>
                    AiTA Lab · FPTU HCMC
                  </div>
                </div>
              </div>
              <button
                className="btn-roman btn-roman-ghost btn-sm btn-icon"
                onClick={onClose}
                aria-label={t('common.closeMenu')}
                style={{ width: 36, height: 36, padding: 0 }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Nav list */}
            <div className="mobile-drawer-body flex-grow-1 p-3 overflow-y-auto">
              <div className="roman-eyebrow mb-2">Navigation</div>
              <ul className="list-unstyled d-flex flex-column gap-1 mb-3">
                {navItems.map((item, index) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.exact}
                      className={({ isActive }) =>
                        `mobile-link d-flex align-items-center justify-content-between p-2.5 rounded-3 text-decoration-none ${
                          isActive ? 'active' : ''
                        }`
                      }
                      onClick={onClose}
                      ref={index === 0 ? firstLinkRef : null}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <i className={`bi ${item.icon} fs-5 text-gold`}></i>
                        <span className="fw-semibold">{item.label}</span>
                      </div>
                      <i className="bi bi-chevron-right small text-muted"></i>
                    </NavLink>
                  </li>
                ))}
              </ul>

              {/* Direct PDF Download Action */}
              <div className="roman-eyebrow mb-2">Documents</div>
              <a
                href={`${import.meta.env.BASE_URL}CV_NguyenMinhTri.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-roman btn-roman-primary w-100 mb-3 justify-content-center py-2.5"
                onClick={onClose}
              >
                <i className="bi bi-download me-1"></i> Download PDF CV
              </a>

              {/* Social Profiles */}
              <div className="roman-eyebrow mb-2">Connect</div>
              <div className="d-flex gap-2 flex-wrap mb-3">
                <a className="icon-btn" href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
                  <i className="bi bi-github"></i>
                </a>
                <a className="icon-btn" href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a className="icon-btn" href={social.kaggle} target="_blank" rel="noopener noreferrer" aria-label="Kaggle" title="Kaggle">
                  <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="14" height="14" />
                </a>
                <a className="icon-btn" href={social.scholar} target="_blank" rel="noopener noreferrer" aria-label="Google Scholar" title="Google Scholar">
                  <i className="bi bi-mortarboard"></i>
                </a>
                <a className="icon-btn" href={social.orcid} target="_blank" rel="noopener noreferrer" aria-label="ORCID" title="ORCID">
                  <i className="bi bi-person-badge"></i>
                </a>
                <a className="icon-btn" href={social.email} aria-label="Email" title="Email">
                  <i className="bi bi-envelope"></i>
                </a>
              </div>
            </div>

            {/* Footer / Theme toggle */}
            <div className="mobile-drawer-settings p-3 border-top border-zinc mt-auto">
              <button
                onClick={toggleTheme}
                className="btn-roman btn-roman-ghost w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                type="button"
              >
                <i className={`bi ${getThemeIcon()} text-gold`}></i>
                <span className="small">Theme: {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}</span>
              </button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}