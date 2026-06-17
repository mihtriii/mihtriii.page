import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

function NewsCard({ item, t }) {
  const magneticRef = useMagnetic(0.04);

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      className="col-12"
    >
      <div ref={magneticRef} className="card card-hover card-elevate card-gradient-border magnetic">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span className="badge text-bg-primary">
              <i className={`bi ${item.icon} me-1`}></i>
              {item.category}
            </span>
            <span className="text-secondary small">
              <i className="bi bi-calendar3 me-1"></i>
              {item.date}
            </span>
            <span className="text-secondary small">
              <i className="bi bi-building me-1"></i>
              {item.source}
            </span>
          </div>

          <h2 className="h5 fw-semibold mb-2">{item.title}</h2>
          <p className="text-secondary mb-3">{item.summary}</p>

          {item.highlights?.length > 0 && (
            <ul className="small text-secondary mb-3">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="mb-1">
                  {highlight}
                </li>
              ))}
            </ul>
          )}

          <div className="d-flex flex-wrap gap-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <i className="bi bi-newspaper me-1"></i>
              {t('news.readOriginal')}
            </a>
            {item.relatedLinks?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary btn-sm"
              >
                <i className={`bi ${link.icon} me-1`}></i>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function News() {
  const { t } = useI18n();
  const sectionIds = ['featured-news', 'news-list'];
  const [searchQuery, setSearchQuery] = useState('');

  const newsItems = useMemo(
    () => [
      {
        id: 'aita-lab-ieee-icce-2026',
        title: t('news.aitaIeee.title'),
        date: t('news.aitaIeee.date'),
        source: t('news.aitaIeee.source'),
        category: t('news.category.research'),
        icon: 'bi-globe2',
        summary: t('news.aitaIeee.summary'),
        highlights: [
          t('news.aitaIeee.highlight1'),
          t('news.aitaIeee.highlight2'),
          t('news.aitaIeee.highlight3'),
        ],
        url: 'https://daihoc.fpt.edu.vn/hcm/aita-lab-tiep-tuc-ghi-dau-an-quoc-te-voi-02-bai-bao-tai-ieee-icce-2026/',
        relatedLinks: [
          {
            label: t('news.links.ducProfile'),
            url: 'https://dnmduc.github.io/',
            icon: 'bi-person-badge',
          },
          {
            label: t('news.links.nhanProfile'),
            url: 'https://nhanhqq.github.io/index.html',
            icon: 'bi-person-badge',
          },
          {
            label: t('nav.publications'),
            url: '/publications',
            icon: 'bi-journal-bookmark',
          },
        ],
      },
    ],
    [t]
  );

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return newsItems;
    return newsItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.highlights?.some((highlight) => highlight.toLowerCase().includes(q))
    );
  }, [newsItems, searchQuery]);

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} />
      </aside>

      <div className="col-12 col-lg-9">
        <section id="featured-news" className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1">
            <span className="gradient-text">{t('news.title')}</span>
          </h1>
          <p className="text-secondary mb-0">{t('news.subtitle')}</p>
        </section>

        <section id="news-list" className="mb-3" data-animate>
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <div className="fw-semibold">
              <i className="bi bi-newspaper me-1"></i>
              {t('news.latest')}
            </div>
            <div className="ms-auto"></div>
            <input
              className="form-control form-control-sm search-input-glow"
              style={{ maxWidth: 280 }}
              placeholder={t('news.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <motion.div
            className="row g-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
            }}
          >
            {filteredNews.length === 0 ? (
              <div className="col-12">
                <div className="text-center text-muted py-5">
                  <i className="bi bi-search"></i>
                  <p>{t('news.noResults')}</p>
                </div>
              </div>
            ) : (
              filteredNews.map((item) => <NewsCard key={item.id} item={item} t={t} />)
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}