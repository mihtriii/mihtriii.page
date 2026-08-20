import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import GitHubCommitChart from '../components/GitHubCommitChart.jsx';
import { github } from '../config/site.js';
import { useI18n } from '../i18n/index.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

const RepoCard = ({ repo }) => {
  const magneticRef = useMagnetic(0.05);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div
        ref={magneticRef}
        className="roman-card beam-border magnetic-card h-100"
        style={{
          '--mouse-x': `${mousePos.x}px`,
          '--mouse-y': `${mousePos.y}px`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="roman-card-inner d-flex flex-column h-100">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h3 className="h6 mb-0 font-display">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener"
                className="text-decoration-none fw-semibold stretched-link"
              >
                {repo.name}
              </a>
            </h3>
            <div className="d-flex gap-2 align-items-center text-secondary small">
              {repo.stargazers_count > 0 && (
                <span className="roman-badge-gold d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-star-fill" style={{ fontSize: '0.6rem' }}></i>
                  {repo.stargazers_count}
                </span>
              )}
              {repo.forks_count > 0 && (
                <span className="text-secondary d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-diagram-3"></i> {repo.forks_count}
                </span>
              )}
            </div>
          </div>
          {repo.description && (
            <p className="text-secondary small mb-3 flex-grow-1 line-clamp-2">{repo.description}</p>
          )}
          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-zinc">
            {repo.language ? (
              <span className="roman-badge-gold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                <span className="d-inline-block rounded-circle bg-gold" style={{ width: 6, height: 6 }}></span>
                {repo.language}
              </span>
            ) : (
              <span></span>
            )}
            <span className="text-secondary small" style={{ fontSize: '0.7rem' }}>
              updated {new Date(repo.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Repos() {
  const { t } = useI18n();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [langFilter, setLangFilter] = useState('All');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const cached = sessionStorage.getItem('gh:repos');
    if (cached) {
      try {
        setRepos(JSON.parse(cached));
        setLoading(false);
      } catch {}
    }
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${github.username}/repos?sort=updated&per_page=100`, {
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`GitHub API error: ${r.status}`);
        const data = await r.json();
        setRepos(data);
        sessionStorage.setItem('gh:repos', JSON.stringify(data));
        try {
          const stars = data.reduce((a, it) => a + (it.stargazers_count || 0), 0);
          sessionStorage.setItem(
            'gh:stats',
            JSON.stringify({ repos: data.length, stars, ts: Date.now() })
          );
          window.dispatchEvent(new Event('gh:repos-updated'));
        } catch {}
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message || t('repos.error'));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const languages = useMemo(() => {
    const s = new Set(['All']);
    repos.forEach((r) => r.language && s.add(r.language));
    return Array.from(s);
  }, [repos]);

  const filtered = useMemo(() => {
    return repos.filter((r) => {
      const okLang = langFilter === 'All' || r.language === langFilter;
      const q = query.trim().toLowerCase();
      const okQuery =
        q === '' ||
        r.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q);
      return okLang && okQuery;
    });
  }, [repos, langFilter, query]);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="row g-4 page-transition">
      <aside className="col-12 col-lg-3">
        <Sidebar />
      </aside>
      <div className="col-12 col-lg-9">
        <section
          className="hero-section roman-card-elevated p-4 p-md-5 mb-4 position-relative overflow-hidden spotlight"
          id="main-content"
          data-animate
          style={{ '--mouse-x': `${mousePos.x}%`, '--mouse-y': `${mousePos.y}%` }}
          onMouseMove={handleHeroMouseMove}
        >
          <div className="hero-ambient" aria-hidden="true" />
          
          <span className="roman-eyebrow d-block mb-3">Open Source &amp; Codebases</span>
          <h1 className="font-display fw-bold mb-2 hero-title text-gradient-gold">
            {t('repos.title')}
          </h1>
          <p className="text-secondary mb-0">{t('repos.subtitle')}</p>
        </section>

        {/* GitHub Commit Activity Chart */}
        <div className="roman-card beam-border mb-4" data-animate>
          <div className="roman-card-inner reveal-stagger">
            <GitHubCommitChart />
          </div>
        </div>

        {/* Filter Controls - Roman Style */}
        <div className="roman-card beam-border mb-4" data-animate>
          <div className="roman-card-inner reveal-stagger">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="roman-eyebrow me-2 align-self-center">Filter by Language</span>
              <motion.div
                className="d-flex flex-wrap gap-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.03 } },
                }}
              >
                {languages.map((l) => (
                  <motion.button
                    key={l}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`btn-roman ${langFilter === l ? 'btn-roman-primary' : 'btn-roman-ghost'} btn-sm`}
                    onClick={() => setLangFilter(l)}
                  >
                    {l}
                  </motion.button>
                ))}
              </motion.div>
              <div className="ms-auto"></div>
              <div className="position-relative" style={{ maxWidth: 280 }}>
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary z-1"></i>
                <input
                  className="input-roman ps-5 form-control-sm"
                  placeholder={t('repos.searchPlaceholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Results Count */}
            <div className="d-flex justify-content-end">
              <span className="roman-metric-pill">
                <span className="roman-metric-label">Repo</span>
                <span className="roman-metric-value">{filtered.length}</span>
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-warning roman-card beam-border" role="alert">
            {error}
          </div>
        )}

        <motion.div
          className="row g-3 row-cols-1 row-cols-md-2"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
          }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                className="col"
                key={i}
                variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
              >
                <div className="roman-card beam-border h-100">
                  <div className="roman-card-inner">
                    <div className="placeholder-glow">
                      <span className="placeholder col-6"></span>
                      <p className="placeholder col-4 small"></p>
                      <p className="placeholder col-8 small"></p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-12">
              <div className="text-center text-muted py-5">
                <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
                <p>{t('repos.noResults')}</p>
              </div>
            </div>
          ) : (
            filtered.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}