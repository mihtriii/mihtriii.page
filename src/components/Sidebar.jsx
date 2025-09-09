import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollSpy } from './ScrollSpy.jsx';
import { github, social } from '../config/site.js';
import SidebarIcons from './SidebarIcons.jsx';

export default function Sidebar({ sectionIds = [], showSocial = true }) {
  const activeId = useScrollSpy(sectionIds);
  const [stats, setStats] = useState({ repos: null, stars: null, followers: null, loading: true });
  const [isSmall, setIsSmall] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState(true);
  function AnimatedNumber({ value = 0, duration = 500 }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      if (typeof value !== 'number') return;
      const start = performance.now();
      const from = display;
      const diff = value - from;
      let raf = 0;
      const step = (t) => {
        const p = Math.min(1, (t - start) / duration);
        setDisplay(Math.round(from + diff * p));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return <>{Number.isFinite(display) ? display : '—'}</>;
  }

  // Recent posts from MDX (top 3)
  const modules = import.meta.glob('../blog/*.mdx', { eager: true });
  const recentPosts = useMemo(() => {
    try {
      const arr = Object.entries(modules).map(([path, mod]) => {
        const slug = path.split('/').pop().replace(/\.mdx$/, '');
        const meta = mod.meta || {};
        return { slug, title: meta.title || slug, date: meta.date || '' };
      }).sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 3);
      return arr;
    } catch { return []; }
  }, []);

  // Track small screens to collapse Sections
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 575.98px)');
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
            const label = id.replace(/-/g, ' ');
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
                <span className="text-capitalize">{label}</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  // Load GitHub mini-stats using cache first
  useEffect(() => {
    const fromRepos = (arr) => {
      const repos = Array.isArray(arr) ? arr.length : 0;
      const stars = Array.isArray(arr) ? arr.reduce((a, r) => a + (r.stargazers_count || 0), 0) : 0;
      return { repos, stars };
    };
    const load = async () => {
      try {
        const cachedStats = sessionStorage.getItem('gh:stats');
        if (cachedStats) {
          const o = JSON.parse(cachedStats);
          if (o && o.ts && Date.now() - o.ts < 1000 * 60 * 60 * 4) { // 4h TTL
            setStats({ repos: o.repos, stars: o.stars, followers: o.followers ?? null, loading: false });
            return;
          }
        }
      } catch {}

      try {
        const cached = sessionStorage.getItem('gh:repos');
        if (cached) {
          const arr = JSON.parse(cached);
          const s = fromRepos(arr);
          setStats((prev) => ({ ...prev, ...s, loading: false }));
          sessionStorage.setItem('gh:stats', JSON.stringify({ ...s, followers: (prev?.followers ?? null), ts: Date.now() }));
          return;
        }
      } catch {}

      try {
        const r = await fetch(`https://api.github.com/users/${github.username}/repos?sort=updated&per_page=100`);
        if (!r.ok) throw new Error('GitHub error');
        const data = await r.json();
        const s = fromRepos(data);
        setStats((prev) => ({ ...prev, ...s, loading: false }));
        sessionStorage.setItem('gh:repos', JSON.stringify(data));
        const old = JSON.parse(sessionStorage.getItem('gh:stats') || '{}');
        sessionStorage.setItem('gh:stats', JSON.stringify({ ...old, ...s, ts: Date.now() }));
        window.dispatchEvent(new Event('gh:repos-updated'));
      } catch {
        setStats((st) => ({ ...st, loading: false }));
      }
    };

    // Defer network work to idle time to avoid blocking initial render
    const idle = (cb) => {
      if ('requestIdleCallback' in window) return requestIdleCallback(cb, { timeout: 2000 });
      return setTimeout(cb, 200);
    };
    const idleId = idle(load);

    const onUpdated = () => {
      try {
        const arr = JSON.parse(sessionStorage.getItem('gh:repos') || '[]');
        const repos = arr.length;
        const stars = arr.reduce((a, r) => a + (r.stargazers_count || 0), 0);
        setStats({ repos, stars, loading: false });
        sessionStorage.setItem('gh:stats', JSON.stringify({ repos, stars, ts: Date.now() }));
      } catch {}
    };
    window.addEventListener('gh:repos-updated', onUpdated);
    return () => {
      window.removeEventListener('gh:repos-updated', onUpdated);
      if ('cancelIdleCallback' in window) cancelIdleCallback?.(idleId);
      else clearTimeout(idleId);
    };
  }, []);

  // Load user profile stats (followers) with TTL cache
  useEffect(() => {
    const loadUser = async () => {
      try {
        const cached = sessionStorage.getItem('gh:user');
        if (cached) {
          const u = JSON.parse(cached);
          if (u && u.ts && Date.now() - u.ts < 1000 * 60 * 60 * 4) {
            setStats((st) => ({ ...st, followers: u.followers ?? null }));
            return;
          }
        }
      } catch {}
      try {
        const r = await fetch(`https://api.github.com/users/${github.username}`);
        if (!r.ok) throw new Error('GitHub error');
        const u = await r.json();
        const followers = u.followers ?? null;
        setStats((st) => ({ ...st, followers }));
        const oldStats = JSON.parse(sessionStorage.getItem('gh:stats') || '{}');
        sessionStorage.setItem('gh:user', JSON.stringify({ followers, ts: Date.now() }));
        sessionStorage.setItem('gh:stats', JSON.stringify({ ...oldStats, followers, ts: Date.now() }));
      } catch {
        /* ignore */
      }
    };
    const idle = (cb) => {
      if ('requestIdleCallback' in window) return requestIdleCallback(cb, { timeout: 2000 });
      return setTimeout(cb, 300);
    };
    const idleId = idle(loadUser);
    return () => {
      if ('cancelIdleCallback' in window) cancelIdleCallback?.(idleId);
      else clearTimeout(idleId);
    };
  }, []);
  return (
    <div className="sticky-top sidebar">
  {/* Animated sidebar icons for quick access */}
  <SidebarIcons />
      <SectionChips />
  <div className="card card-hover card-elevate mb-3 profile-card card-animate">
        <div className="card-body d-flex align-items-center gap-3 py-3">
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
            <div className="fw-semibold">Nguyễn Minh Trí</div>
            <div className="text-secondary small">AI @ FPTU HCM</div>
            <div className="text-secondary small d-flex align-items-center gap-2"><i className="bi bi-geo-alt"></i> Ho Chi Minh City, VN</div>
          </div>
        </div>
      </div>
  <div className="card card-hover card-elevate mb-3 d-none d-sm-block card-animate">
        <div className="card-body py-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="fw-semibold text-uppercase small letter d-flex align-items-center gap-2">
              <i className="bi bi-github"></i> On GitHub
            </div>
            <a className="text-decoration-none small" href={`https://github.com/${github.username}`} target="_blank" rel="noopener">View →</a>
          </div>
          <p className="mb-2 text-secondary small">Recent work and repositories.</p>
          {stats.loading ? (
            <div className="placeholder-glow"><span className="placeholder col-3 me-2"></span><span className="placeholder col-3"></span></div>
          ) : (
            <div className="mini-stats">
              <div className="stat-chip" title="Public repos"><i className="bi bi-journal-code me-1"></i><AnimatedNumber value={stats.repos ?? 0} /></div>
              <div className="stat-chip" title="Total stars"><i className="bi bi-star me-1"></i><AnimatedNumber value={stats.stars ?? 0} /></div>
              <div className="stat-chip" title="Followers"><i className="bi bi-people me-1"></i><AnimatedNumber value={stats.followers ?? 0} /></div>
            </div>
          )}
        </div>
      </div>
      {sectionIds.length > 0 && (
  <div className="card card-hover card-elevate mb-3 card-animate" data-animate>
          <div className="card-body py-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold text-uppercase small letter">Sections</div>
              {isSmall && (
                <button type="button" className="btn btn-outline-secondary btn-sm" aria-expanded={sectionsOpen} aria-controls="sidebar-sections" onClick={() => setSectionsOpen((v) => !v)}>
                  <i className={`bi ${sectionsOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
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
                  className="d-flex flex-column gap-1 spy-list"
                  aria-label="Page sections"
                  style={{ overflow: 'hidden' }}
                >
                  {sectionIds.map((id) => (
                    <a key={id} href={`#${id}`} className={`spy-item ${activeId === id ? 'active' : ''}`}>
                      {activeId === id && <motion.span layoutId="spyHighlight" className="spy-highlight" />}
                      <span className="dot"></span>
                      <span className="text-capitalize position-relative" style={{ zIndex: 1 }}>{id.replace(/-/g, ' ')}</span>
                    </a>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      {recentPosts.length > 0 && (
  <div className="card card-hover card-elevate mb-3 d-none d-sm-block card-animate" data-animate>
          <div className="card-body py-3">
            <div className="fw-semibold text-uppercase small letter mb-2">Recent Posts</div>
            <div className="d-flex flex-column gap-2">
              {recentPosts.map((p) => (
                <Link key={p.slug} className="text-decoration-none small d-flex justify-content-between align-items-center" to={`/blog/${p.slug}`}>
                  <span className="text-truncate" style={{ maxWidth: '80%' }}>{p.title}</span>
                  {p.date && <span className="text-secondary" style={{ fontSize: '0.75rem' }}>{p.date}</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      {showSocial && (
  <div className="card card-hover card-elevate mb-3 d-none d-sm-block card-animate" data-animate>
          <div className="card-body py-3">
            <div className="fw-semibold text-uppercase small letter mb-2">Social</div>
            <div className="social-grid">
              <a className="btn btn-outline-secondary btn-sm icon-btn" style={{width:32,height:32,margin:'0.15rem 0',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}} data-brand="kaggle" href={social.kaggle} target="_blank" rel="noopener" aria-label="Kaggle">
                <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="18" height="18" loading="lazy" decoding="async" />
              </a>
              <a className="btn btn-outline-secondary btn-sm icon-btn" style={{width:32,height:32,margin:'0.15rem 0',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}} data-brand="linkedin" href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a className="btn btn-outline-secondary btn-sm icon-btn" style={{width:32,height:32,margin:'0.15rem 0',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}} data-brand="github" href={social.github} target="_blank" rel="noopener" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a className="btn btn-outline-secondary btn-sm icon-btn" style={{width:32,height:32,margin:'0.15rem 0',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}} data-brand="email" href={social.email} aria-label="Email">
                <i className="bi bi-envelope"></i>
              </a>
              <a className="btn btn-outline-secondary btn-sm icon-btn" style={{width:32,height:32,margin:'0.15rem 0',padding:0,display:'flex',alignItems:'center',justifyContent:'center'}} data-brand="scholar" href={social.scholar} target="_blank" rel="noopener" aria-label="Google Scholar">
                <i className="bi bi-mortarboard"></i>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
