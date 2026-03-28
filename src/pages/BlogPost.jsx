import 'katex/dist/katex.min.css';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useSEO } from '../components/SEOHead.jsx';
import { getBlogPostEntry } from '../blog/manifest.js';

export default function BlogPost() {
  const { t } = useI18n();
  const { slug } = useParams();
  const [PostComponent, setPostComponent] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const entry = getBlogPostEntry(slug);

  useSEO(
    entry
      ? {
          title: entry.title || slug,
          description: entry.summary || `Read ${entry.title || slug} on Nguyễn Minh Trí's blog`,
          url: `/blog/${slug}`,
          type: 'article',
          article: {
            date: entry.date,
            tags: entry.tags,
            lastModified: entry.lastModified,
          },
        }
      : {
          title: 'Post Not Found',
          description: 'The requested blog post could not be found.',
          url: `/blog/${slug}`,
          noindex: true,
        }
  );

  useEffect(() => {
    let cancelled = false;

    setPostComponent(null);
    setLoadError(null);

    if (!entry?.load) {
      return () => {
        cancelled = true;
      };
    }

    entry
      .load()
      .then((mod) => {
        if (!cancelled) {
          setPostComponent(() => mod.default || null);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [entry]);

  if (!entry) {
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

  if (loadError) {
    return (
      <div className="row g-4">
        <aside className="col-12 col-lg-4">
          <Sidebar />
        </aside>
        <div className="col-12 col-lg-8">
          <div className="alert alert-danger">Failed to load this post.</div>
          <Link className="btn btn-outline-secondary" to="/blog">
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const Mod = PostComponent;

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-4">
        <Sidebar />
      </aside>
      <div className="col-12 col-lg-8">
        <section className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1">
            <span className="gradient-text">{entry.title || slug}</span>
          </h1>
          {entry.date && <p className="text-secondary mb-0">{entry.date}</p>}
          {entry.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mt-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="badge text-bg-secondary" style={{ fontSize: '0.7rem' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>
        {Mod ? (
          <article className="prose" data-animate>
            <Mod />
          </article>
        ) : (
          <div className="text-center text-secondary py-5" aria-busy="true">
            {t('common.loading')}
          </div>
        )}
        <div className="mt-4">
          <Link className="btn btn-outline-secondary btn-sm" to="/blog">
            ← {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    </div>
  );
}
