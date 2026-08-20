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
      <div className="row g-4 page-transition">
        <aside className="col-12 col-lg-3">
          <Sidebar />
        </aside>
        <div className="col-12 col-lg-9">
          <div className="alert alert-warning roman-card beam-border p-4">
            Post not found.
          </div>
          <Link className="btn-roman btn-roman-secondary btn-sm mt-3" to="/blog">
            ← {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="row g-4 page-transition">
        <aside className="col-12 col-lg-3">
          <Sidebar />
        </aside>
        <div className="col-12 col-lg-9">
          <div className="alert alert-danger roman-card beam-border p-4">
            Failed to load this post.
          </div>
          <Link className="btn-roman btn-roman-secondary btn-sm mt-3" to="/blog">
            ← {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const Mod = PostComponent;

  return (
    <div className="row g-4 page-transition">
      <aside className="col-12 col-lg-3">
        <Sidebar />
      </aside>
      <div className="col-12 col-lg-9">
        <article className="roman-card beam-border p-4 p-md-5 mb-4" data-animate>
          <div className="mb-4 pb-3 border-bottom border-zinc">
            <Link className="text-decoration-none small text-gold d-inline-flex align-items-center gap-1 mb-3" to="/blog">
              ← {t('blog.backToBlog')}
            </Link>
            <h1 className="font-display fw-bold mb-2 hero-title text-gradient-gold">
              {entry.title || slug}
            </h1>
            <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small font-mono">
              {entry.date && (
                <span>
                  <i className="bi bi-calendar3 me-1"></i>
                  {entry.date}
                </span>
              )}
              {entry.readingTime && (
                <span>
                  <i className="bi bi-clock me-1"></i>
                  {entry.readingTime} min read
                </span>
              )}
            </div>
            {entry.tags?.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-3">
                {entry.tags.map((tag) => (
                  <span key={tag} className="roman-badge-gold" style={{ fontSize: '0.72rem' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {Mod ? (
            <div className="prose-content" data-animate>
              <Mod />
            </div>
          ) : (
            <div className="text-center text-secondary py-5" aria-busy="true">
              {t('common.loading')}
            </div>
          )}

          <div className="mt-5 pt-3 border-top border-zinc d-flex justify-content-between align-items-center">
            <Link className="btn-roman btn-roman-secondary btn-sm" to="/blog">
              ← {t('blog.backToBlog')}
            </Link>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast('Copied article link to clipboard!');
              }}
              className="btn-roman btn-roman-ghost btn-sm"
            >
              <i className="bi bi-share me-1"></i> Share Post
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
