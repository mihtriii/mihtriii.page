import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

function PublicationCard({ publication, t }) {
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
              <i className="bi bi-journal-richtext me-1"></i>
              {publication.type}
            </span>
            <span className="text-secondary small">
              <i className="bi bi-calendar3 me-1"></i>
              {publication.date}
            </span>
            <span className="text-secondary small">
              <i className="bi bi-building me-1"></i>
              {publication.venue}
            </span>
          </div>

          {publication.image && (
            <div className="mb-3">
              <img
                src={publication.image}
                alt={t('publications.previewAlt')}
                className="img-fluid rounded-4 border"
              />
            </div>
          )}

          <h2 className="h5 fw-semibold mb-2">{publication.title}</h2>
          <p className="text-secondary mb-2">{publication.authors}</p>
          <p className="text-secondary small mb-3">{publication.citation}</p>

          {publication.abstract && (
            <div className="mb-3">
              <div className="fw-semibold small mb-2">
                <i className="bi bi-card-text me-1"></i>
                {t('publications.abstract')}
              </div>
              <p className="text-secondary small mb-0">{publication.abstract}</p>
            </div>
          )}

          {publication.keywords?.length > 0 && (
            <div className="mb-3">
              <div className="fw-semibold small mb-2">
                <i className="bi bi-tags me-1"></i>
                {t('publications.keywords')}
              </div>
              <div className="d-flex flex-wrap gap-1">
                {publication.keywords.map((keyword) => (
                  <span key={keyword} className="badge text-bg-secondary bg-opacity-10 text-body">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="d-flex flex-wrap gap-2">
            {publication.links?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
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

export default function Publications() {
  const { t } = useI18n();
  const sectionIds = ['featured-publications', 'publication-list'];
  const [searchQuery, setSearchQuery] = useState('');

  const publications = useMemo(
    () => [
      {
        id: 'hybrid-quantum-federated-learning-brain-tumor',
        type: t('publications.types.conference'),
        title: 'Hybrid Quantum Federated Learning for Brain Tumor Magnetic Resonance Imaging Analysis',
        authors: 'Quang Nhan Hoang, Minh Tri Nguyen, and Duc Ngoc Minh Dang',
        date: 'Jun 2026',
        venue: 'IEEE ICCE 2026',
        citation:
          'In Proceedings of the 11th IEEE International Conference on Communications and Electronics (ICCE 2026), Jun 2026',
        image: '/assets/publications/icce.png',
        abstract: t('publications.paper1.abstract'),
        keywords: [
          'Quantum Machine Learning',
          'Federated Learning',
          'Brain Tumor MRI',
          'Medical Imaging',
          'Hybrid Quantum Models',
        ],
        links: [
          {
            label: t('publications.links.newsArticle'),
            url: 'https://daihoc.fpt.edu.vn/hcm/aita-lab-tiep-tuc-ghi-dau-an-quoc-te-voi-02-bai-bao-tai-ieee-icce-2026/',
            icon: 'bi-newspaper',
          },
          {
            label: t('publications.links.ducProfile'),
            url: 'https://dnmduc.github.io/',
            icon: 'bi-person-badge',
          },
          {
            label: t('publications.links.nhanProfile'),
            url: 'https://nhanhqq.github.io/index.html',
            icon: 'bi-person-badge',
          },
        ],
      },
    ],
    [t]
  );

  const filteredPublications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return publications;
    return publications.filter(
      (publication) =>
        publication.title.toLowerCase().includes(q) ||
        publication.authors.toLowerCase().includes(q) ||
        publication.venue.toLowerCase().includes(q) ||
        publication.citation.toLowerCase().includes(q) ||
        publication.keywords?.some((keyword) => keyword.toLowerCase().includes(q))
    );
  }, [publications, searchQuery]);

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} />
      </aside>

      <div className="col-12 col-lg-9">
        <section id="featured-publications" className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1">
            <span className="gradient-text">{t('publications.title')}</span>
          </h1>
          <p className="text-secondary mb-0">{t('publications.subtitle')}</p>
        </section>

        <section id="publication-list" className="mb-3" data-animate>
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <div className="fw-semibold">
              <i className="bi bi-journal-bookmark me-1"></i>
              {t('publications.latest')}
            </div>
            <div className="ms-auto"></div>
            <input
              className="form-control form-control-sm search-input-glow"
              style={{ maxWidth: 300 }}
              placeholder={t('publications.searchPlaceholder')}
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
            {filteredPublications.length === 0 ? (
              <div className="col-12">
                <div className="text-center text-muted py-5">
                  <i className="bi bi-search"></i>
                  <p>{t('publications.noResults')}</p>
                </div>
              </div>
            ) : (
              filteredPublications.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} t={t} />
              ))
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}