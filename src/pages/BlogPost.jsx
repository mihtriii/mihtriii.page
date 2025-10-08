import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useSEO } from '../components/SEOHead.jsx';

const modules = import.meta.glob('../blog/*.mdx', { eager: true });

export default function BlogPost() {
  const { t } = useI18n();
  const { slug } = useParams();
  const entry = Object.entries(modules).find(([path, mod]) => {
    const s = path
      .split('/')
      .pop()
      .replace(/\.mdx$/, '');
    return s === slug;
  });

  if (!entry) {
    // SEO for 404 page
    useSEO({
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      url: `/blog/${slug}`,
      noindex: true,
    });

    return (
      <div className="row g-4">
        <aside className="col-12 col-lg-4">
          <Sidebar />
        </aside>
        <div className="col-12 col-lg-8">
          <div className="alert alert-warning">Post not found.</div>
          <Link className="btn btn-outline-secondary" to="/blog">
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const Mod = entry[1].default;
  const meta = entry[1].meta || {};

  // SEO for blog post
  useSEO({
    title: meta.title || slug,
    description: meta.summary || `Read ${meta.title || slug} on Nguyễn Minh Trí's blog`,
    url: `/blog/${slug}`,
    type: 'article',
    article: {
      date: meta.date,
      tags: meta.tags,
      lastModified: meta.lastModified,
    },
  });

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-4">
        <Sidebar />
      </aside>
      <div className="col-12 col-lg-8">
        <section className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1">
            <span className="gradient-text">{meta.title || slug}</span>
          </h1>
          {meta.date && <p className="text-secondary mb-0">{meta.date}</p>}
          {meta.tags && (
            <div className="d-flex flex-wrap gap-1 mt-2">
              {meta.tags.map((tag) => (
                <span key={tag} className="badge text-bg-secondary" style={{ fontSize: '0.7rem' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>
        <article className="prose" data-animate>
          <Mod />
        </article>
        <div className="mt-4">
          <Link className="btn btn-outline-secondary btn-sm" to="/blog">
            ← {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    </div>
  );
}
