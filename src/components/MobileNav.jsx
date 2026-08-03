import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n/index.jsx';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext.jsx';

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

      const t = setTimeout(() => firstLinkRef.current?.focus(), 0);
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
        clearTimeout(t);
        window.removeEventListener('keydown', onKey);
        drawerRef.current?.removeEventListener('keydown', trap);
        // Restore scroll position and previous styles
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
      case 'light': return 'bi-sun';
      case 'dark': return 'bi-moon-stars';
      default: return 'bi-circle-half';
    }
  };

  const content = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="mobile-overlay"
            aria-hidden="true"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.nav
            key="drawer"
            className="mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobileMenuTitle"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
          >
            <div className="mobile-drawer-header">
              <span id="mobileMenuTitle" className="fw-semibold">{t('common.menu')}</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={onClose} aria-label={t('common.closeMenu')}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <ul className="list-unstyled mb-0">
              <li>
                <NavLink to="/" end className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} ref={firstLinkRef} aria-label={t('nav.about')}>
                  <i className="bi bi-person"></i> {t('nav.about')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} aria-label={t('nav.blog')}>
                  <i className="bi bi-journal-text"></i> {t('nav.blog')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/cv" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} aria-label={t('nav.cv')}>
                  <i className="bi bi-badge-ad"></i> {t('nav.cv')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/repos" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} aria-label={t('nav.repos')}>
                  <i className="bi bi-git"></i> {t('nav.repos')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/moments" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} aria-label={t('nav.moments')}>
                  <i className="bi bi-camera-reels"></i> {t('nav.moments')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/news" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} aria-label={t('nav.news')}>
                  <i className="bi bi-newspaper"></i> {t('nav.news')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/publications" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} aria-label={t('nav.publications')}>
                  <i className="bi bi-journal-richtext"></i> {t('nav.publications')}
                </NavLink>
              </li>
              <li>
                <a href="https://github.com/mihtriii" target="_blank" rel="noopener" className="mobile-link" onClick={onClose} aria-label="GitHub profile">
                  <i className="bi bi-github"></i> {t('nav.github')}
                </a>
              </li>
            </ul>

            <div className="mobile-drawer-settings mt-4 pt-3 border-top border-zinc">
              <button
                onClick={toggleTheme}
                className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                type="button"
              >
                <i className={`bi ${getThemeIcon()}`}></i>
                <span>Theme: {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}</span>
              </button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}