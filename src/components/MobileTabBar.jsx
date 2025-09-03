import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../i18n/index.jsx';

const Item = ({ to, exact, icon, label, prefetch }) => (
  <NavLink
    end={exact}
    to={to}
    className={({ isActive }) => `tab-link${isActive ? ' active' : ''}`}
    aria-label={label}
    title={label}
    onMouseEnter={prefetch}
    onTouchStart={prefetch}
  >
    {({ isActive }) => (
      <span className="tab-inner">
        {isActive && <motion.span layoutId="tabbarHighlight" className="tab-highlight" />}
        <i className={`bi ${icon}`}></i>
        <span className="label">{label}</span>
      </span>
    )}
  </NavLink>
);

export default function MobileTabBar() {
  const { t } = useI18n();
  const [hidden, setHidden] = useState(false);
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
        const down = dy > 6;
        const up = dy < -6;
        const nearTop = y < 40;
        if (nearTop) setHidden(false);
        else if (down) setHidden(true);
        else if (up) setHidden(false);
        lastY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`mobile-tabbar${hidden ? ' hidden' : ''}`} role="navigation" aria-label="Primary bottom navigation">
      <Item to="/" exact icon="bi-house" label={t('nav.about')} />
      <Item to="/blog" icon="bi-journal-text" label={t('nav.blog')} prefetch={prefetch.blog} />
      <Item to="/cv" icon="bi-badge-ad" label={t('nav.cv')} prefetch={prefetch.cv} />
      <Item to="/repos" icon="bi-git" label={t('nav.repos')} prefetch={prefetch.repos} />
    </div>
  );
}
