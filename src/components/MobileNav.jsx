import React, { useEffect, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileNav({ open, onClose }) {
  const firstLinkRef = useRef(null);
  const drawerRef = useRef(null);
  const lastActive = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const swiping = useRef(false);

  useEffect(() => {
    if (open) {
      lastActive.current = document.activeElement;
      document.body.style.overflow = 'hidden';
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
      };
    } else {
      document.body.style.overflow = '';
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

  return (
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
              <span id="mobileMenuTitle" className="fw-semibold">Menu</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={onClose} aria-label="Close menu">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <ul className="list-unstyled mb-0">
              <li>
                <NavLink to="/" end className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} ref={firstLinkRef} aria-label="About">
                  <i className="bi bi-person"></i> About
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} onMouseEnter={() => import('../pages/Blog.jsx')} onTouchStart={() => import('../pages/Blog.jsx')} aria-label="Blog">
                  <i className="bi bi-journal-text"></i> Blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/cv" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} onMouseEnter={() => import('../pages/CV.jsx')} onTouchStart={() => import('../pages/CV.jsx')} aria-label="CV">
                  <i className="bi bi-badge-ad"></i> CV
                </NavLink>
              </li>
              <li>
                <NavLink to="/repos" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} onMouseEnter={() => import('../pages/Repos.jsx')} onTouchStart={() => import('../pages/Repos.jsx')} aria-label="Repos">
                  <i className="bi bi-git"></i> Repos
                </NavLink>
              </li>
              <li>
                <a href="https://github.com/mihtriii" target="_blank" rel="noopener" className="mobile-link" onClick={onClose} aria-label="GitHub profile">
                  <i className="bi bi-github"></i> GitHub
                </a>
              </li>
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
