import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../i18n/index.jsx';

// Enhanced touch feedback
const hapticFeedback = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10); // Light haptic feedback
  }
};

const Item = ({ to, exact, icon, label, prefetch }) => (
  <NavLink
    end={exact}
    to={to}
    className={({ isActive }) => `tab-link${isActive ? ' active' : ''}`}
    aria-label={label}
    title={label}
    onMouseEnter={prefetch}
    onTouchStart={(e) => {
      hapticFeedback();
      if (prefetch) prefetch();
    }}
  >
    {({ isActive }) => (
      <motion.span className="tab-inner" whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
        <AnimatePresence>
          {isActive && (
            <motion.span
              layoutId="tabbarHighlight"
              className="tab-highlight"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        <motion.i
          className={`bi ${icon}`}
          animate={{
            scale: isActive ? 1.1 : 1,
            color: isActive ? 'var(--bs-primary)' : 'var(--bs-secondary)',
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="label"
          animate={{
            opacity: isActive ? 1 : 0.7,
            fontSize: isActive ? '0.75rem' : '0.7rem',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.span>
    )}
  </NavLink>
);

export default function MobileTabBar() {
  const { t } = useI18n();
  const [hidden, setHidden] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  const prefetch = {
    blog: () => import('../pages/Blog.jsx'),
    cv: () => import('../pages/CV.jsx'),
    repos: () => import('../pages/Repos.jsx'),
  };

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY.current;
        const down = dy > 8; // Increased threshold for better UX
        const up = dy < -8;
        const nearTop = y < 60;

        if (nearTop) {
          setHidden(false);
        } else if (down && y > 100) {
          setHidden(true);
        } else if (up) {
          setHidden(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    // Touch gesture support
    let touchStartY = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      // Show/hide based on swipe direction
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          setHidden(true); // Swipe up - hide
        } else {
          setHidden(false); // Swipe down - show
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <motion.div
      className="mobile-tabbar"
      initial={{ y: 0 }}
      animate={{ y: hidden ? '100%' : 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      role="navigation"
      aria-label="Primary bottom navigation"
    >
      <motion.div
        className="tabbar-content"
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Item to="/" exact icon="bi-house" label={t('nav.about')} />
        <Item to="/blog" icon="bi-journal-text" label={t('nav.blog')} prefetch={prefetch.blog} />
        <Item to="/cv" icon="bi-badge-ad" label={t('nav.cv')} prefetch={prefetch.cv} />
        <Item to="/repos" icon="bi-git" label={t('nav.repos')} prefetch={prefetch.repos} />
      </motion.div>
    </motion.div>
  );
}
