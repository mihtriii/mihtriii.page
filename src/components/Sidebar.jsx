import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollSpy } from './ScrollSpy.jsx';
import { social, hasRealScholar } from '../config/site.js';
import { getRecentBlogPosts } from '../blog/manifest.js';
import { toast } from './Toast.jsx';

export default function Sidebar({ sectionIds = [], showSocial = true }) {
  const activeId = useScrollSpy(sectionIds);
  const [isMobile, setIsMobile] = useState(false);

  // Section display names
  const NAV_LABELS = {
    about: 'Overview',
    summary: 'Professional Summary',
    'career-objectives': 'Career Objectives',
    education: 'Education',
    experience: 'Research Experience',
    publications: 'Publications & Research',
    'competitions-activities': 'Honors & Awards',
    skills: 'Technical Skills',
    languages: 'Languages',
    focus: 'Research Focus',
    goals: 'Career Goals',
    tech: 'Tech Stack',
    projects: 'Featured Projects',
    contact: 'Contact & Collab',
    'featured-publications': 'Featured Papers',
    'publication-list': 'All Publications',
    'featured-news': 'Headlines',
    'news-list': 'Latest News',
    competitions: 'Competitions',
    hackathons: 'Hackathons',
    activities: 'Leadership & Community',
  };

  const NAV_ICONS = {
    about: 'bi-person',
    summary: 'bi-file-person',
    'career-objectives': 'bi-compass',
    education: 'bi-mortarboard',
    experience: 'bi-briefcase',
    publications: 'bi-journal-richtext',
    'competitions-activities': 'bi-trophy',
    skills: 'bi-stars',
    languages: 'bi-translate',
    focus: 'bi-bullseye',
    projects: 'bi-code-slash',
    contact: 'bi-envelope',
    'featured-publications': 'bi-star',
    'publication-list': 'bi-journal-bookmark',
    'featured-news': 'bi-newspaper',
    'news-list': 'bi-megaphone',
  };

  // Recent posts from MDX (top 2)
  const recentPosts = useMemo(() => {
    try {
      return getRecentBlogPosts(2);
    } catch {
      return [];
    }
  }, []);

  // Track responsive viewport width
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 991.98px)');
    const handleResize = () => setIsMobile(mq.matches);
    handleResize();
    mq.addEventListener?.('change', handleResize);
    return () => mq.removeEventListener?.('change', handleResize);
  }, []);

  // Mobile horizontal section scroll chips
  if (isMobile) {
    if (!sectionIds || sectionIds.length === 0) return null;
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
  }

  // Desktop Unified Sticky Sidebar Masterpiece
  return (
    <aside className="sticky-sidebar" aria-label="Author Profile and Table of Contents">
      <div className="roman-card beam-border unified-sidebar-card">
        {/* Profile Card Header */}
        <div className="sidebar-profile-header p-3 text-center border-bottom border-zinc">
          {/* Avatar with luxury glow */}
          <div className="position-relative d-inline-block mb-2">
            <div className="avatar-glow-ring p-1" style={{ width: 80, height: 80 }}>
              <img
                className="avatar photo rounded-circle"
                src={`${import.meta.env.BASE_URL}assets/avatar.JPG`}
                alt="Nguyễn Minh Trí"
                width="72"
                height="72"
                loading="eager"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
            </div>
            <span className="status-indicator online" title="Active in Research" />
          </div>

          <h2 className="font-display fw-bold h6 mb-0 text-primary">Nguyễn Minh Trí</h2>
          <p className="text-gold font-mono small mb-1" style={{ fontSize: '0.72rem' }}>
            AiTA Lab · FPTU HCMC
          </p>
          <p className="text-secondary small mb-3" style={{ fontSize: '0.78rem', lineHeight: '1.35' }}>
            Vision-Language &amp; Quantum ML
          </p>

          {/* Action Button Row */}
          <div className="d-flex gap-2 justify-content-center">
            <a
              href={`${import.meta.env.BASE_URL}CV_NguyenMinhTri.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-roman btn-roman-primary btn-sm flex-grow-1 justify-content-center"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.6rem' }}
            >
              <i className="bi bi-download me-1"></i> CV PDF
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText('mihtriii295@gmail.com');
                toast('Copied email to clipboard!');
              }}
              className="btn-roman btn-roman-ghost btn-sm"
              title="Copy Email Address"
              style={{ padding: '0.35rem 0.6rem' }}
            >
              <i className="bi bi-clipboard"></i>
            </button>
          </div>
        </div>

        {/* Section Navigation ("On This Page") */}
        {sectionIds.length > 0 && (
          <div className="sidebar-nav-section p-3 border-bottom border-zinc">
            <div className="roman-eyebrow mb-2 d-flex align-items-center gap-1">
              <i className="bi bi-list-nested text-gold"></i>
              <span>On This Page</span>
            </div>
            <nav className="spy-list" aria-label="Page Table of Contents">
              {sectionIds.map((id, index) => {
                const label = NAV_LABELS[id] || id.replace(/-/g, ' ');
                const icon = NAV_ICONS[id] || 'bi-dot';
                const active = activeId === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`sidebar-spy-link d-flex align-items-center justify-content-between text-decoration-none px-2.5 py-1.5 rounded-2 ${
                      active ? 'active' : ''
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                      <i className={`bi ${icon} small ${active ? 'text-gold' : 'text-muted'}`}></i>
                      <span className="text-truncate" style={{ fontSize: '0.8rem' }}>
                        {label}
                      </span>
                    </div>
                    <span className="sidebar-link-num font-mono small text-muted" style={{ fontSize: '0.68rem' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>
        )}

        {/* Recent Notes Snippet */}
        {recentPosts.length > 0 && (
          <div className="sidebar-recent-section p-3 border-bottom border-zinc">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="roman-eyebrow">Recent Notes</span>
              <Link to="/blog" className="text-decoration-none small text-gold" style={{ fontSize: '0.7rem' }}>
                All →
              </Link>
            </div>
            <div className="d-flex flex-column gap-1">
              {recentPosts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="sidebar-recent-item d-flex flex-column p-2 rounded-2 text-decoration-none"
                >
                  <span className="text-truncate fw-medium text-secondary" style={{ fontSize: '0.78rem' }}>
                    {p.title}
                  </span>
                  <span className="text-muted font-mono" style={{ fontSize: '0.68rem' }}>
                    {p.date} · {p.readingTime}m read
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Social Connect Footer */}
        {showSocial && (
          <div className="sidebar-social-footer p-3">
            <div className="roman-eyebrow mb-2">Connect &amp; Profiles</div>
            <div className="d-flex gap-1 flex-wrap justify-content-between">
              <a className="icon-btn" href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a className="icon-btn" href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a className="icon-btn" href={social.kaggle} target="_blank" rel="noopener noreferrer" aria-label="Kaggle" title="Kaggle">
                <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="14" height="14" />
              </a>
              {hasRealScholar && (
                <a className="icon-btn" href={social.scholar} target="_blank" rel="noopener noreferrer" aria-label="Google Scholar" title="Google Scholar">
                  <i className="bi bi-mortarboard"></i>
                </a>
              )}
              <a className="icon-btn" href={social.orcid} target="_blank" rel="noopener noreferrer" aria-label="ORCID" title="ORCID">
                <i className="bi bi-person-badge"></i>
              </a>
              <a className="icon-btn" href={social.email} aria-label="Email" title="Email">
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}