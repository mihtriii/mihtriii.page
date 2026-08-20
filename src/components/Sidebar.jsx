import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LineSidebarNav from './LineSidebarNav.jsx';
import { useScrollSpy } from './ScrollSpy.jsx';
import { social, hasRealScholar } from '../config/site.js';
import { getRecentBlogPosts } from '../blog/manifest.js';
import SidebarIcons from './SidebarIcons.jsx';

export default function Sidebar({ sectionIds = [], showSocial = true }) {
  const activeId = useScrollSpy(sectionIds);
  const [isMobile, setIsMobile] = useState(false);
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
    'featured-publications': 'Featured',
    'publication-list': 'All Papers',
    'featured-news': 'Headlines',
    'news-list': 'All News',
  };

  // Recent posts from MDX (top 3)
  const recentPosts = useMemo(() => {
    try {
      return getRecentBlogPosts(3);
    } catch {
      return [];
    }
  }, []);

  // Track responsive viewport width
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 991.98px)');
    const handleResize = () => {
      setIsMobile(mq.matches);
      setSectionsOpen(!mq.matches);
    };
    handleResize();
    mq.addEventListener?.('change', handleResize);
    return () => mq.removeEventListener?.('change', handleResize);
  }, []);

  const SectionChips = () => {
    if (!isMobile || !sectionIds || sectionIds.length === 0) return null;
    return (
      <div className="section-chips mb-3" role="tablist" aria-label="Quick sections">
        <div className="chips-row d-flex gap-2 overflow-x-auto py-1 px-1">
          {sectionIds.map((id) => {
            const label = NAV_LABELS[id] || id.replace(/-/g, ' ');
            const active = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`btn-roman btn-sm text-decoration-none flex-shrink-0 ${
                  active ? 'btn-roman-primary' : 'btn-roman-ghost'
                }`}
                role="tab"
                aria-selected={active}
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  if (isMobile && (!sectionIds || sectionIds.length === 0)) {
    return null;
  }

  return (
    <div className="sidebar-wrapper">
      {/* Quick horizontal chips for tablet/mobile */}
      <SectionChips />

      {/* Desktop Sticky Sidebar */}
      {!isMobile && (
        <aside className="sticky-top sidebar" aria-label="Sidebar navigation">
          <SidebarIcons />

          {/* Profile Card */}
          <div className="roman-card mb-3 profile-card beam-border">
            <div className="roman-card-inner p-3">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="avatar-frame position-relative flex-shrink-0">
                  <img
                    className="avatar photo rounded-circle"
                    src={`${import.meta.env.BASE_URL}assets/avatar.JPG`}
                    alt="Nguyễn Minh Trí"
                    width="56"
                    height="56"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const candidates = [
                        `${import.meta.env.BASE_URL}assets/avatar.jpg`,
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
                  <span className="status-indicator online" title="Active in Research" />
                </div>
                <div className="overflow-hidden">
                  <h2 className="fw-bold font-display h6 mb-0 text-truncate">Nguyễn Minh Trí</h2>
                  <div className="text-secondary small font-mono text-truncate">AI @ FPTU HCM</div>
                  <div className="text-muted small d-flex align-items-center gap-1 mt-0 text-truncate" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-geo-alt"></i> Ho Chi Minh City, VN
                  </div>
                </div>
              </div>

              {/* Research Focus Mini-Tags */}
              <div className="d-flex flex-wrap gap-1 mb-2">
                <span className="roman-badge-gold" style={{ fontSize: '0.65rem' }}>Vision-Language</span>
                <span className="roman-badge-gold" style={{ fontSize: '0.65rem' }}>Quantum ML</span>
                <span className="roman-badge-gold" style={{ fontSize: '0.65rem' }}>Edge CV</span>
              </div>

              {/* Quick CV Download Link */}
              <a
                href={`${import.meta.env.BASE_URL}CV_NguyenMinhTri.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-roman btn-roman-ghost w-100 btn-sm text-center d-flex align-items-center justify-content-center gap-1 mt-2"
                style={{ fontSize: '0.78rem' }}
              >
                <i className="bi bi-file-earmark-pdf"></i> Download PDF CV
              </a>
            </div>
          </div>

          {/* Section Scrollspy Navigation */}
          {sectionIds.length > 0 && (
            <LineSidebarNav
              sectionIds={sectionIds}
              activeId={activeId}
              isSmall={isMobile}
              sectionsOpen={sectionsOpen}
              setSectionsOpen={setSectionsOpen}
            />
          )}

          {/* Recent Research Notes */}
          {recentPosts.length > 0 && (
            <div className="roman-card mb-3 beam-border">
              <div className="roman-card-inner py-3 px-3">
                <div className="roman-eyebrow mb-2 d-flex justify-content-between align-items-center">
                  <span>Recent Notes</span>
                  <Link to="/blog" className="text-decoration-none small text-gold" style={{ fontSize: '0.7rem' }}>
                    View all →
                  </Link>
                </div>
                <div className="d-flex flex-column gap-2">
                  {recentPosts.map((p) => (
                    <Link
                      key={p.slug}
                      className="text-decoration-none small d-flex justify-content-between align-items-center py-1 sidebar-recent-link"
                      to={`/blog/${p.slug}`}
                    >
                      <span className="text-truncate text-secondary" style={{ maxWidth: '75%' }}>
                        {p.title}
                      </span>
                      {p.date && <span className="text-muted" style={{ fontSize: '0.7rem' }}>{p.date}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Profiles */}
          {showSocial && (
            <div className="roman-card mb-3 beam-border">
              <div className="roman-card-inner py-2 px-3">
                <div className="roman-eyebrow mb-2">Connect</div>
                <div className="d-flex gap-2 flex-wrap">
                  <a className="icon-btn" data-brand="kaggle" href={social.kaggle} target="_blank" rel="noopener" aria-label="Kaggle" title="Kaggle">
                    <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="16" height="16" loading="lazy" decoding="async" />
                  </a>
                  <a className="icon-btn" data-brand="linkedin" href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a className="icon-btn" data-brand="github" href={social.github} target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
                    <i className="bi bi-github"></i>
                  </a>
                  <a className="icon-btn" data-brand="email" href={social.email} aria-label="Email" title="Email">
                    <i className="bi bi-envelope"></i>
                  </a>
                  {hasRealScholar && (
                    <a className="icon-btn" data-brand="scholar" href={social.scholar} target="_blank" rel="noopener" aria-label="Google Scholar" title="Google Scholar">
                      <i className="bi bi-mortarboard"></i>
                    </a>
                  )}
                  <a className="icon-btn" data-brand="orcid" href={social.orcid} target="_blank" rel="noopener" aria-label="ORCID" title="ORCID">
                    <i className="bi bi-person-badge"></i>
                  </a>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}