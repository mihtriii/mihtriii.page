import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n/index.jsx';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileNav({ open, onClose }) {
  const { t } = useI18n();
  const firstLinkRef = useRef(null);
  const drawerRef = useRef(null);
  const lastActive = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const swiping = useRef(false);

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

  const onPointerDown = useCallback((e) => {
    startX.current = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    startY.current = e.clientY ?? (e.touches?.[0]?.clientY || 0);
    swiping.current = true;
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!swiping.current) return;
    const x = e.clientX ?? (e.touches?.[0]?.clientX || 0);
    const y = e.clientY ?? (e.touches?.[0]?.clientY || 0);
    const dx = x - startX.current;
    const dy = Math.abs(y - startY.current);
    // If user swipes right > 60px with low vertical movement, close
    if (dx > 60 && dy < 40) {
      swiping.current = false;
      onClose();
    }
  }, [onClose]);

  const onPointerUp = useCallback(() => { swiping.current = false; }, []);

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
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
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
                <NavLink to="/blog" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} onMouseEnter={() => import('../pages/Blog.jsx')} onTouchStart={() => import('../pages/Blog.jsx')} aria-label={t('nav.blog')}>
                  <i className="bi bi-journal-text"></i> {t('nav.blog')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/cv" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} onMouseEnter={() => import('../pages/CV.jsx')} onTouchStart={() => import('../pages/CV.jsx')} aria-label={t('nav.cv')}>
                  <i className="bi bi-badge-ad"></i> {t('nav.cv')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/repos" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} onMouseEnter={() => import('../pages/Repos.jsx')} onTouchStart={() => import('../pages/Repos.jsx')} aria-label={t('nav.repos')}>
                  <i className="bi bi-git"></i> {t('nav.repos')}
                </NavLink>
              </li>
              <li>
                <a href="https://github.com/mihtriii" target="_blank" rel="noopener" className="mobile-link" onClick={onClose} aria-label="GitHub profile">
                  <i className="bi bi-github"></i> {t('nav.github')}
                </a>
              </li>
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );

  // Render into a portal to avoid conflicts with header stacking/transform
  if (typeof document !== 'undefined' && document.body) {
    return createPortal(content, document.body);
  }
  return content;
}
