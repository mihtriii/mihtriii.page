import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { github } from '../config/site.js';
import { useI18n } from '../i18n/index.jsx';

export default function Repos() {
  const { t } = useI18n();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [langFilter, setLangFilter] = useState('All');

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
    const s = new Set([t('common.all')]);
    repos.forEach((r) => r.language && s.add(r.language));
    return Array.from(s);
  }, [repos, t]);

  const filtered = useMemo(() => {
    return repos.filter((r) => {
      const okLang = langFilter === t('common.all') || r.language === langFilter;
      const q = query.trim().toLowerCase();
      const okQuery =
        q === '' ||
        r.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q);
      return okLang && okQuery;
    });
  }, [repos, langFilter, query, t]);

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar />
      </aside>
      <div className="col-12 col-lg-9">
        <section className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1">
            <span className="gradient-text">{t('repos.title')}</span>
          </h1>
          <p className="text-secondary mb-0">{t('repos.subtitle')}</p>
        </section>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {languages.map((l) => (
            <button
              key={l}
              className={`btn btn-sm ${langFilter === l ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setLangFilter(l)}
            >
              {l}
            </button>
          ))}
          <div className="ms-auto"></div>
          <input
            className="form-control form-control-sm"
            style={{ maxWidth: 260 }}
            placeholder={t('repos.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error && (
          <div className="alert alert-warning" role="alert">
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
                <div className="card card-elevate h-100">
                  <div className="card-body">
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
                <i className="bi bi-search"></i>
                <p>{t('repos.noResults')}</p>
              </div>
            </div>
          ) : (
            filtered.map((repo) => (
              <motion.div
                className="col"
                key={repo.id}
                variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
              >
                <div className="card card-hover card-elevate h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h3 className="h6 mb-0">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener"
                          className="text-decoration-none"
                        >
                          {repo.name}
                        </a>
                      </h3>
                      <div className="d-flex gap-1 align-items-center text-secondary small">
                        {repo.stargazers_count > 0 && (
                          <span>
                            <i className="bi bi-star"></i> {repo.stargazers_count}
                          </span>
                        )}
                      </div>
                    </div>
                    {repo.description && (
                      <p className="text-secondary small mb-2">{repo.description}</p>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      {repo.language && (
                        <span className="badge text-bg-secondary">{repo.language}</span>
                      )}
                      <span className="text-secondary small">
                        {t('repos.stats.updated')} {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
