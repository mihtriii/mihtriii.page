import { useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const NAV_LABELS = {
  about: 'About',
  blog: 'Blog',
  cv: 'CV',
  repos: 'Repos',
  moments: 'Moments',
  news: 'News',
  publications: 'Publications',
  summary: 'Summary',
  'career-objectives': 'Career Objectives',
  education: 'Education',
  experience: 'Experience',
  'research-interests': 'Research Interests',
  'competitions-activities': 'Honors & Awards',
  skills: 'Skills',
  languages: 'Languages',
  focus: 'Research Focus',
  goals: 'Goals',
  tech: 'Technologies',
  projects: 'Projects',
  contact: 'Contact',
  // Moments section keys
  competitions: 'Competitions',
  hackathons: 'Hackathons',
  activities: 'Leadership & Community',
};

export default function LineSidebarNav({ sectionIds, activeId, isSmall, sectionsOpen, setSectionsOpen }) {
  const listRef = useRef(null);
  const lineRef = useRef(null);
  const itemRefs = useRef({});
  const prevActiveRef = useRef(activeId);

  // Animate line indicator to active item
  const animateLine = useCallback((id) => {
    const line = lineRef.current;
    const list = listRef.current;
    const item = itemRefs.current[id];
    if (!line || !list || !item) return;

    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const top = itemRect.top - listRect.top;
    const height = itemRect.height;

    gsap.to(line, {
      y: top,
      height,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.set(line, { opacity: 1 });
  }, []);

  // Initialize line on mount
  useEffect(() => {
    if (sectionIds.length > 0 && activeId) {
      requestAnimationFrame(() => animateLine(activeId));
    }
  }, []);

  // Move line when active section changes
  useEffect(() => {
    if (activeId && activeId !== prevActiveRef.current) {
      animateLine(activeId);
      prevActiveRef.current = activeId;
    }
  }, [activeId, animateLine]);

  // Handle hover on items
  const handleItemHover = (id) => {
    if (id !== activeId && itemRefs.current[id]) {
      animateLine(id);
    }
  };

  const handleMouseLeave = () => {
    if (activeId) {
      animateLine(activeId);
    }
  };

  if (!sectionIds || sectionIds.length === 0) return null;

  return (
    <div className="roman-card mb-3 beam-border" data-animate>
      <div className="roman-card-inner py-3 px-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="roman-eyebrow">On This Page</span>
          {isSmall && (
            <button
              type="button"
              className="btn-roman btn-roman-ghost btn-sm btn-icon"
              aria-expanded={sectionsOpen}
              aria-controls="sidebar-sections"
              onClick={() => setSectionsOpen((v) => !v)}
              style={{ width: 26, height: 26, padding: 0 }}
            >
              <i className={`bi ${sectionsOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
            </button>
          )}
        </div>
        <AnimatePresence initial={false}>
          {(!isSmall || sectionsOpen) && (
            <motion.nav
              id="sidebar-sections"
              key="sections"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="spy-list"
              aria-label="Page sections"
              style={{ overflow: 'hidden' }}
              onMouseLeave={handleMouseLeave}
            >
              {/* GSAP-animated line indicator (React Bits Line Sidebar style) */}
              <div
                ref={lineRef}
                className="sidebar-line-indicator visible"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 3,
                  height: 0,
                  willChange: 'transform, height',
                }}
                aria-hidden="true"
              />

              {sectionIds.map((id) => {
                const label = NAV_LABELS[id] || id.replace(/-/g, ' ');
                return (
                  <a
                    key={id}
                    ref={(el) => { itemRefs.current[id] = el; }}
                    href={`#${id}`}
                    className={`spy-item ${activeId === id ? 'active' : ''}`}
                    onMouseEnter={() => handleItemHover(id)}
                  >
                    <span className="dot" />
                    <span className="position-relative" style={{ zIndex: 1 }}>
                      {label}
                    </span>
                  </a>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}