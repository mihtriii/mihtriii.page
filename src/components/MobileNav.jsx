import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileNav({ open, onClose }) {
  const firstLinkRef = useRef(null);
  const lastActive = useRef(null);

  useEffect(() => {
    if (open) {
      lastActive.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => firstLinkRef.current?.focus(), 0);
      const onKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);
      return () => {
        clearTimeout(t);
        window.removeEventListener('keydown', onKey);
      };
    } else {
      document.body.style.overflow = '';
      lastActive.current && lastActive.current.focus?.();
    }
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="overlay"
            className="mobile-overlay"
            aria-label="Close menu"
            aria-modal="true"
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />
          <motion.nav
            key="drawer"
            className="mobile-drawer"
            aria-label="Mobile navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
          >
            <div className="mobile-drawer-header">
              <span className="fw-semibold">Menu</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={onClose} aria-label="Close menu">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <ul className="list-unstyled mb-0">
              <li>
                <NavLink to="/" end className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose} ref={firstLinkRef}>
                  <i className="bi bi-person"></i> About
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose}>
                  <i className="bi bi-journal-text"></i> Blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/cv" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose}>
                  <i className="bi bi-badge-ad"></i> CV
                </NavLink>
              </li>
              <li>
                <NavLink to="/repos" className={({isActive}) => `mobile-link${isActive ? ' active' : ''}`} onClick={onClose}>
                  <i className="bi bi-git"></i> Repos
                </NavLink>
              </li>
              <li>
                <a href="https://github.com/mihtriii" target="_blank" rel="noopener" className="mobile-link" onClick={onClose}>
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
