import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

const modules = import.meta.glob('../blog/*.mdx', { eager: true });

export default function BlogPost() {
  const { slug } = useParams();
  const entry = Object.entries(modules).find(([path, mod]) => {
    const s = path.split('/').pop().replace(/\.mdx$/, '');
    return s === slug;
  });

  if (!entry) {
    return (
      <div className="row g-4">
        <aside className="col-12 col-lg-4"><Sidebar /></aside>
        <div className="col-12 col-lg-8">
          <div className="alert alert-warning">Post not found.</div>
          <Link className="btn btn-outline-secondary" to="/blog">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const Mod = entry[1].default;
  const meta = entry[1].meta || {};

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-4"><Sidebar /></aside>
      <div className="col-12 col-lg-8">
        <section className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1"><span className="gradient-text">{meta.title || slug}</span></h1>
          {meta.date && <p className="text-secondary mb-0">{meta.date}</p>}
        </section>
        <article className="prose" data-animate>
          <Mod />
        </article>
        <div className="mt-4"><Link className="btn btn-outline-secondary btn-sm" to="/blog">← Back</Link></div>
      </div>
    </div>
  );
}

