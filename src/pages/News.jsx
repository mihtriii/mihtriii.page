import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

function NewsCard({ item, t }) {
  const magneticRef = useMagnetic(0.04);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      className="col-12"
      whileHover={{ y: -6 }}
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
        <div className="roman-card-inner">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <span className="roman-badge-gold">
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

          <h2 className="h5 fw-semibold mb-2 font-display">{item.title}</h2>
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
              className="btn-roman btn-roman-primary btn-sm"
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
                className="btn-roman btn-roman-ghost btn-sm"
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
        <section
          id="featured-news"
          className="hero-section roman-card-elevated p-4 p-md-5 mb-4 position-relative overflow-hidden spotlight floating-orbs"
          data-animate
        >
          <div className="hero-ambient" aria-hidden="true" />
          <div className="glitter-layer" aria-hidden="true" />
          
          <span className="roman-eyebrow d-block mb-3 reveal">Acta Diurna</span>
          <h1 className="font-display fw-bold mb-2 text-gradient-animate reveal" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            <span>{t('news.title')}</span>
          </h1>
          <p className="text-secondary mb-0 reveal">{t('news.subtitle')}</p>
        </section>

        <section id="news-list" className="mb-3" data-animate>
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <div className="fw-semibold">
              <i className="bi bi-newspaper me-1"></i>
              {t('news.latest')}
            </div>
            <div className="ms-auto"></div>
            <div className="position-relative">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary z-1"></i>
              <input
                className="input-roman ps-5 form-control-sm"
                style={{ maxWidth: 280 }}
                placeholder={t('news.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                  <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
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