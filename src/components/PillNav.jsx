import { useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const navItems = [
  { to: '/', label: 'nav.about' },
  { to: '/blog', label: 'nav.blog' },
  { to: '/cv', label: 'nav.cv' },
  { to: '/repos', label: 'nav.repos' },
  { to: '/moments', label: 'nav.moments' },
  { to: '/news', label: 'nav.news' },
  { to: '/publications', label: 'nav.publications' },
];

export default function PillNav({ t, prefetchData }) {
  const containerRef = useRef(null);
  const pillRef = useRef(null);
  const location = useLocation();
  const itemRefs = useRef({});
  const containerRefCache = useRef(null);

  const activeIndex = navItems.findIndex(item =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  );

  const animatePill = useCallback((targetIndex) => {
    const pill = pillRef.current;
    const container = containerRef.current;
    const item = itemRefs.current[targetIndex];
    if (!pill || !container || !item) return;

    const contRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    gsap.to(pill, {
      x: itemRect.left - contRect.left,
      width: itemRect.width,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });

    // Show pill
    gsap.set(pill, { opacity: 1 });
  }, []);

  useLayoutEffect(() => {
    if (activeIndex >= 0) {
      requestAnimationFrame(() => animatePill(activeIndex));
    }
  }, []);

  useEffect(() => {
    if (activeIndex >= 0) {
      requestAnimationFrame(() => animatePill(activeIndex));
    }
  }, [location.pathname]);

  const handleMouseEnter = (index) => {
    if (index !== activeIndex && itemRefs.current[index]) {
      animatePill(index);
    }
    if (prefetchData?.[navItems[index]?.prefetch]) {
      prefetchData[navItems[index].prefetch]();
    }
  };

  const handleMouseLeave = () => {
    if (activeIndex >= 0) {
      requestAnimationFrame(() => animatePill(activeIndex));
    }
  };

  return (
    <div ref={containerRefCache}>
      <ul
        ref={containerRef}
        className="navbar-nav position-relative flex-row align-items-center"
        role="menubar"
        aria-label="Primary navigation"
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated Pill Indicator */}
        <li
          ref={pillRef}
          className="nav-pill"
          style={{
            position: 'absolute',
            left: 0,
            x: 0,
            width: 0,
            willChange: 'transform, width',
            opacity: 0,
          }}
          aria-hidden="true"
        >
          <div className="nav-pill-inner" />
          <div className="nav-pill-glow" />
        </li>

        {navItems.map((item, index) => (
          <li key={item.to} className="nav-item position-relative" role="none">
            <NavLink
              ref={(el) => { itemRefs.current[index] = el; }}
              end={item.to === '/'}
              to={item.to}
              className="nav-link px-3 nav-pill-wrapper"
              onMouseEnter={() => handleMouseEnter(index)}
              role="menuitem"
              aria-current={activeIndex === index ? 'page' : undefined}
            >
              <span className="position-relative d-inline-block">
                {t(item.label)}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}