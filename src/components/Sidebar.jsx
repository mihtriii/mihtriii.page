import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LineSidebarNav from './LineSidebarNav.jsx';
import { useScrollSpy } from './ScrollSpy.jsx';
import { social, hasRealScholar } from '../config/site.js';
import { getRecentBlogPosts } from '../blog/manifest.js';
import SidebarIcons from './SidebarIcons.jsx';

export default function Sidebar({ sectionIds = [], showSocial = true }) {
  const activeId = useScrollSpy(sectionIds);
  const [isSmall, setIsSmall] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(true);

  // Shared labels for section chips (mobile) and LineSidebarNav
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
  };

  // Recent posts from MDX (top 3)
  const recentPosts = useMemo(() => {
    try {
      return getRecentBlogPosts(3);
    } catch {
      return [];
    }
  }, []);

  // Track small screens to collapse Sections
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)');
    const apply = () => { setIsSmall(mq.matches); setSectionsOpen(!mq.matches); };
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  const SectionChips = () => {
    if (!isSmall || !sectionIds || sectionIds.length === 0) return null;
    return (
      <div className="section-chips" role="tablist" aria-label="Quick sections">
        <div className="chips-row">
          {sectionIds.map((id) => {
            const label = NAV_LABELS[id] || id.replace(/-/g, ' ');
            const active = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`chip ${active ? 'active' : ''}`}
                role="tab"
                aria-selected={active}
              >
                <span className="chip-dot" />
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  // Detect mobile viewport (reactive: updates on resize)
  const isMobile = useMemo(
    () => {
      if (typeof window === 'undefined') return false;
      const mq = window.matchMedia('(max-width: 767.98px)');
      const [mobile, setMobile] = useState(mq.matches);
      useEffect(() => {
        const apply = () => setMobile(mq.matches);
        mq.addEventListener?.('change', apply);
        return () => mq.removeEventListener?.('change', apply);
      }, []);
      return mobile;
    },
    []
  );

  return (
    <div className="sticky-top sidebar">
      {/* Hide sidebar on mobile */}
      {isMobile ? null : (
        <>
          <SidebarIcons />
          <SectionChips />
          <div className="roman-card mb-3 profile-card">
            <div className="roman-card-inner d-flex align-items-center gap-3 py-2">
              <span className="avatar-frame">
                <img
                  className="avatar photo"
                  src={`${import.meta.env.BASE_URL}assets/avatar.JPG`}
                  alt="Profile"
                  width="64"
                  height="64"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    const candidates = [
                      `${import.meta.env.BASE_URL}assets/avatar.jpg`,
                      `${import.meta.env.BASE_URL}assets/4x6.JPG`,
                      `${import.meta.env.BASE_URL}assets/avatar.svg`,
                    ];
                    const img = e.currentTarget;
                    const tried = img.getAttribute('data-tried')?.split('\n') || [];
                    const next = candidates.find((c) => !tried.includes(c));
                    if (next) {
                      tried.push(next);
                      img.setAttribute('data-tried', tried.join('\n'));
                      img.src = next;
                    }
                  }}
                />
              </span>
              <div>
                <div className="fw-semibold font-display" style={{ fontSize: '1.125rem' }}>Nguyễn Minh Trí</div>
                <div className="text-secondary small font-mono">AI @ FPTU HCM</div>
                <div className="text-secondary small d-flex align-items-center gap-2"><i className="bi bi-geo-alt"></i> Ho Chi Minh City, VN</div>
              </div>
            </div>
          </div>

          {sectionIds.length > 0 && (
            <LineSidebarNav
              sectionIds={sectionIds}
              activeId={activeId}
              isSmall={isSmall}
              sectionsOpen={sectionsOpen}
              setSectionsOpen={setSectionsOpen}
            />
          )}

          {recentPosts.length > 0 && (
            <div className="roman-card mb-3 d-none d-sm-block">
              <div className="roman-card-inner py-2">
                <div className="roman-eyebrow mb-2">Recent</div>
                <div className="d-flex flex-column gap-2">
                  {recentPosts.map((p) => (
                    <Link key={p.slug} className="text-decoration-none small d-flex justify-content-between align-items-center" to={`/blog/${p.slug}`}>
                      <span className="text-truncate" style={{ maxWidth: '80%' }}>{p.title}</span>
                      {p.date && <span className="text-muted" style={{ fontSize: '0.75rem' }}>{p.date}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showSocial && (
            <div className="roman-card mb-3 d-none d-sm-block">
              <div className="roman-card-inner py-2">
                <div className="roman-eyebrow mb-2">Social</div>
                <div className="d-flex gap-2 flex-wrap">
                  <a className="icon-btn" data-brand="kaggle" href={social.kaggle} target="_blank" rel="noopener" aria-label="Kaggle">
                    <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="18" height="18" loading="lazy" decoding="async" />
                  </a>
                  <a className="icon-btn" data-brand="linkedin" href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a className="icon-btn" data-brand="github" href={social.github} target="_blank" rel="noopener" aria-label="GitHub">
                    <i className="bi bi-github"></i>
                  </a>
                  <a className="icon-btn" data-brand="email" href={social.email} aria-label="Email">
                    <i className="bi bi-envelope"></i>
                  </a>
                  {hasRealScholar && (
                    <a className="icon-btn" data-brand="scholar" href={social.scholar} target="_blank" rel="noopener" aria-label="Google Scholar">
                      <i className="bi bi-mortarboard"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}