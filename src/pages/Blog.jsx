import React, { useMemo } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { Link } from 'react-router-dom';
const modules = import.meta.glob('../blog/*.mdx', { eager: true });

export default function Blog() {
  const posts = useMemo(() => {
    return Object.entries(modules).map(([path, mod]) => {
      const slug = path.split('/').pop().replace(/\.mdx$/, '');
      const meta = mod.meta || {};
      return { slug, title: meta.title || slug, date: meta.date || '', summary: meta.summary || '' };
    }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, []);
  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-4"><Sidebar /></aside>
      <div className="col-12 col-lg-8">
        <section className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1"><span className="gradient-text">Blog / Notes</span></h1>
          <p className="text-secondary mb-0">Bài viết, ghi chú, demo nhỏ.</p>
        </section>

        <div className="row g-3 row-cols-1 row-cols-md-2">
          {posts.map((p) => (
            <div className="col" key={p.slug}>
              <Link className="card card-hover card-elevate h-100 text-decoration-none" to={`/blog/${p.slug}`} data-animate>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-baseline mb-2">
                    <h2 className="h6 mb-0">{p.title}</h2>
                    {p.date && <span className="text-secondary small">{p.date}</span>}
                  </div>
                  {p.summary && <p className="mb-0 text-secondary">{p.summary}</p>}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
