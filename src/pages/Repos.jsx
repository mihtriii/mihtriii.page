import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { github } from '../config/site.js';

export default function Repos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState('All');

  useEffect(() => {
    const cached = sessionStorage.getItem('gh:repos');
    if (cached) {
      try { setRepos(JSON.parse(cached)); setLoading(false); } catch {}
    }
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${github.username}/repos?sort=updated&per_page=100`, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`GitHub API error: ${r.status}`);
        const data = await r.json();
        setRepos(data);
        sessionStorage.setItem('gh:repos', JSON.stringify(data));
        try {
          const stars = data.reduce((a, it) => a + (it.stargazers_count || 0), 0);
          sessionStorage.setItem('gh:stats', JSON.stringify({ repos: data.length, stars, ts: Date.now() }));
          window.dispatchEvent(new Event('gh:repos-updated'));
        } catch {}
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to load repos');
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
      const okLang = lang === 'All' || r.language === lang;
      const q = query.trim().toLowerCase();
      const okQuery = q === '' || r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q);
      return okLang && okQuery;
    });
  }, [repos, lang, query]);

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3"><Sidebar /></aside>
      <div className="col-12 col-lg-9">
        <section className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1"><span className="gradient-text">Repositories</span></h1>
          <p className="text-secondary mb-0">Các dự án gần đây trên GitHub.</p>
        </section>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {languages.map((l) => (
            <button key={l} className={`btn btn-sm ${lang === l ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setLang(l)}>{l}</button>
          ))}
          <div className="ms-auto"></div>
          <input className="form-control form-control-sm" style={{ maxWidth: 260 }} placeholder="Search repositories" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {error && <div className="alert alert-warning" role="alert">{error}</div>}

        <motion.div className="row g-3 row-cols-1 row-cols-md-2"
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } } }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div className="col" key={i} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}>
                <div className="card h-100" aria-busy="true">
                  <div className="card-body">
                    <div className="placeholder-glow">
                      <span className="placeholder col-8"></span>
                    </div>
                    <div className="placeholder-glow mt-2">
                      <span className="placeholder col-12"></span>
                      <span className="placeholder col-10"></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            filtered.map((r) => (
              <motion.div className="col" key={r.id} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}>
                <a href={r.html_url} target="_blank" rel="noopener" className="card card-hover card-elevate h-100 text-decoration-none" data-animate>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h2 className="h6 mb-2 d-flex align-items-center gap-2">
                        <i className="bi bi-journal-code"></i> {r.name}
                      </h2>
                      {r.stargazers_count > 0 && <span className="badge text-bg-warning"><i className="bi bi-star-fill"></i> {r.stargazers_count}</span>}
                    </div>
                    <p className="text-secondary small mb-2">{r.description || 'No description'}</p>
                    <div className="d-flex gap-3 align-items-center text-secondary small">
                      {r.language && <span><i className="bi bi-circle-fill me-1" style={{ color: 'var(--brand-primary)' }}></i>{r.language}</span>}
                      <span><i className="bi bi-git"></i> {r.forks_count} forks</span>
                      <span><i className="bi bi-clock-history"></i> {new Date(r.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
