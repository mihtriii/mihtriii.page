import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

/* ── Lightbox ── */
function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', keyHandler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', keyHandler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  if (!images || images.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="btn btn-dark border-0 rounded-circle position-absolute d-flex align-items-center justify-content-center"
        style={{ top: 20, right: 20, width: 44, height: 44, zIndex: 10 }}
      >
        <i className="bi bi-x-lg fs-5" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="btn btn-dark border-0 rounded-circle position-absolute d-flex align-items-center justify-content-center"
          style={{ left: 20, width: 48, height: 48, zIndex: 10 }}
        >
          <i className="bi bi-chevron-left fs-4" />
        </button>
      )}

      {/* Image */}
      <img
        src={images[currentIndex]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '92vw', maxHeight: '88vh',
          objectFit: 'contain', borderRadius: 8,
          cursor: 'default',
          boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
        }}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="btn btn-dark border-0 rounded-circle position-absolute d-flex align-items-center justify-content-center"
          style={{ right: 20, width: 48, height: 48, zIndex: 10 }}
        >
          <i className="bi bi-chevron-right fs-4" />
        </button>
      )}

      {/* Counter */}
      <div
        className="position-absolute text-white fw-medium px-3 py-1 rounded-pill"
        style={{
          bottom: 24, fontSize: '0.85rem',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
}

/* ── Moment Card ── */
function MomentCard({ moment, onImageClick }) {
  const magneticRef = useMagnetic(0.05);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
    >
      <div
        ref={magneticRef}
        className="card card-hover card-elevate card-gradient-border magnetic overflow-hidden"
      >
        {moment.images && moment.images.length > 0 && (
          <div
            className="position-relative overflow-hidden"
            style={{ cursor: 'pointer' }}
            onClick={() => onImageClick(moment.images, 0)}
          >
            <img
              src={moment.images[0]}
              alt={moment.title}
              className="card-img-top"
              style={{ height: 260, objectFit: 'cover' }}
              loading="lazy"
            />
            {moment.images.length > 1 && (
              <span
                className="position-absolute bottom-0 end-0 m-2 badge bg-black bg-opacity-40 d-flex align-items-center gap-1"
                style={{ fontSize: '0.75rem', backdropFilter: 'blur(2px)' }}
              >
                <i className="bi bi-images" /> {moment.images.length}
              </span>
            )}
            {/* Hover hint */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{
                background: 'rgba(0,0,0,0.25)',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
            >
              <span className="badge bg-dark bg-opacity-75 fs-6 px-3 py-2">
                <i className="bi bi-arrows-angle-expand me-2" />
                {moment.images.length > 1 ? 'View gallery' : 'View full'}
              </span>
            </div>
          </div>
        )}

        <div className="card-body d-flex flex-column">
          {/* Title + Year */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h3 className="h6 mb-0 fw-semibold">{moment.title}</h3>
            <span className="badge text-bg-primary">{moment.year}</span>
          </div>

          {/* Date + Location */}
          <div className="text-secondary small mb-3">
            <i className="bi bi-calendar3 me-1" />
            {moment.date} · {moment.location}
          </div>

          {/* Description */}
          <p className="mb-3 flex-grow-1 text-secondary small line-clamp-3">
            {moment.description}
          </p>

          {/* Achievements */}
          {moment.achievements && moment.achievements.length > 0 && (
            <div className="mb-3">
              <div className="fw-semibold small mb-2">
                <i className="bi bi-trophy me-1" />
                {moment.t('moments.achievements') || 'Key outcomes'}
              </div>
              <ul className="small text-secondary mb-0 ps-3">
                {moment.achievements.map((a, i) => (
                  <li key={i} className="mb-1">{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {moment.technologies && moment.technologies.length > 0 && (
            <div className="mb-3">
              <div className="fw-semibold small mb-2">
                <i className="bi bi-code-slash me-1" />
                {moment.t('moments.technologies') || 'Tech stack'}
              </div>
              <div className="d-flex flex-wrap gap-1">
                {moment.technologies.map((tech, i) => (
                  <span key={i} className="badge text-bg-secondary bg-opacity-10 text-body">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-light-subtle">
            {moment.category && (
              <span className="badge text-bg-secondary bg-opacity-10 text-body d-flex align-items-center gap-1">
                <i className={`bi ${moment.categoryIcon || 'bi-tag'}`} />
                {moment.category}
              </span>
            )}
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
              <span className="ms-1">
                {expanded
                  ? moment.t('moments.showLess') || 'Show less'
                  : moment.t('moments.showMore') || 'Show more'}
              </span>
            </button>
          </div>

          {/* Expanded details */}
          {expanded && moment.details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-top border-light-subtle"
            >
              <div className="text-secondary small">{moment.details}</div>
              {moment.links && moment.links.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {moment.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      {link.icon && <i className={`bi ${link.icon} me-1`} />}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Multi-image gallery strip ── */
function ImageGalleryStrip({ images, onImageClick }) {
  if (!images || images.length <= 1) return null;
  return (
    <div className="d-flex gap-2 mt-2 overflow-auto pb-1" style={{ scrollSnapType: 'x mandatory' }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="rounded cursor-pointer flex-shrink-0"
          style={{
            width: 80, height: 60, objectFit: 'cover',
            cursor: 'pointer', scrollSnapAlign: 'start',
            border: i === 0 ? '2px solid var(--bs-primary)' : '2px solid transparent',
          }}
          onClick={() => onImageClick(images, i)}
        />
      ))}
    </div>
  );
}

/* ── Main page ── */
export default function Moments() {
  const { t } = useI18n();
  const sectionIds = ['competitions', 'hackathons', 'projects', 'activities'];
  const allLabel = t('common.all');

  // filters state
  const [categoryFilter, setCategoryFilter] = useState(allLabel);
  const [yearFilter, setYearFilter] = useState(allLabel);
  const [searchQuery, setSearchQuery] = useState('');

  // lightbox state
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });
  const openLightbox = useCallback((images, index) => {
    setLightbox({ open: true, images, index });
  }, []);
  const closeLightbox = useCallback(() => {
    setLightbox({ open: false, images: [], index: 0 });
  }, []);
  const prevImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length,
    }));
  }, []);
  const nextImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }));
  }, []);

  /* ── data ── */
  const moments = useMemo(
    () => [
      /* ── Competitions ── */
      {
        id: 'samsung-sft-2024',
        title: t('moments.samsungSft.title'),
        year: '2024',
        date: t('moments.samsungSft.date'),
        location: t('moments.samsungSft.location'),
        category: t('moments.category.competition'),
        categoryIcon: 'bi-trophy',
        description: t('moments.samsungSft.description'),
        achievements: [
          t('moments.samsungSft.achievement1'),
          t('moments.samsungSft.achievement2'),
        ],
        technologies: ['Python', 'PyTorch', 'Computer Vision', 'IoT', 'Arduino'],
        details: t('moments.samsungSft.details'),
        links: [
          {
            label: t('moments.samsungSft.link1Label'),
            url: 'https://solvefortomorrow.vn/doi-thang-giai/t-gardens',
            icon: 'bi-box-arrow-up-right',
          },
          {
            label: t('moments.samsungSft.link2Label'),
            url: 'https://github.com/mihtriii/t-gardens',
            icon: 'bi-github',
          },
        ],
        images: [`${import.meta.env.BASE_URL}assets/moments/solve-for-tomorrow.jpg`],
      },
      {
        id: 'voi-2024',
        title: t('moments.voi.title'),
        year: '2024',
        date: t('moments.voi.date'),
        location: t('moments.voi.location'),
        category: t('moments.category.competition'),
        categoryIcon: 'bi-award',
        description: t('moments.voi.description'),
        achievements: [t('moments.voi.achievement1')],
        technologies: ['C++', 'Algorithms', 'Data Structures', 'Competitive Programming'],
        details: t('moments.voi.details'),
        links: [
          {
            label: t('moments.voi.linkLabel'),
            url: 'https://voi.olp.vn/',
            icon: 'bi-box-arrow-up-right',
          },
        ],
        images: [],
      },
      {
        id: 'fpt-coc-vuong-2024',
        title: t('moments.fptCocVuong.title'),
        year: '2025',
        date: t('moments.fptCocVuong.date'),
        location: t('moments.fptCocVuong.location'),
        category: t('moments.category.competition'),
        categoryIcon: 'bi-trophy',
        description: t('moments.fptCocVuong.description'),
        achievements: [
          t('moments.fptCocVuong.achievement1'),
          t('moments.fptCocVuong.achievement2'),
        ],
        technologies: [
          'Algorithm Design',
          'Competitive Programming',
          'C++',
          'Problem Solving',
        ],
        details: t('moments.fptCocVuong.details'),
        links: [
          {
            label: t('moments.fptCocVuong.linkLabel'),
            url: 'https://cocvuong.fpt.edu.vn/',
            icon: 'bi-box-arrow-up-right',
          },
        ],
        images: [`${import.meta.env.BASE_URL}assets/moments/coc-vuong.jpg`],
      },

      /* ── Hackathons ── */
      {
        id: 'fpt-hackathon-2024',
        title: t('moments.fptHackathon.title'),
        year: '2025',
        date: t('moments.fptHackathon.date'),
        location: t('moments.fptHackathon.location'),
        category: t('moments.category.hackathon'),
        categoryIcon: 'bi-lightning-charge',
        description: t('moments.fptHackathon.description'),
        achievements: [
          t('moments.fptHackathon.achievement1'),
          t('moments.fptHackathon.achievement2'),
        ],
        technologies: ['Unity', 'ARCore', 'Rapid Prototyping', 'Teamwork', 'Pitching'],
        details: t('moments.fptHackathon.details'),
        links: [],
        images: [`${import.meta.env.BASE_URL}assets/moments/fpt-hackathon.jpg`],
      },
      {
        id: 'seal-hackathon-2024',
        title: t('moments.sealHackathon.title'),
        year: '2025',
        date: t('moments.sealHackathon.date'),
        location: t('moments.sealHackathon.location'),
        category: t('moments.category.hackathon'),
        categoryIcon: 'bi-globe-asia-australia',
        description: t('moments.sealHackathon.description'),
        achievements: [
          t('moments.sealHackathon.achievement1'),
          t('moments.sealHackathon.achievement2'),
        ],
        technologies: [
          'Python',
          'Time Series',
          'Geospatial Data',
          'Anomaly Detection',
          'Remote Sensing',
        ],
        details: t('moments.sealHackathon.details'),
        links: [],
        images: [`${import.meta.env.BASE_URL}assets/moments/seal-hackathon.jpg`],
      },

      /* ── Leadership & Community ── */
      {
        id: 'farpc-vice-president',
        title: t('moments.farpc.title'),
        year: '2025-2026',
        date: t('moments.farpc.date'),
        location: t('moments.farpc.location'),
        category: t('moments.category.activity'),
        categoryIcon: 'bi-people',
        description: t('moments.farpc.description'),
        achievements: [
          t('moments.farpc.achievement1'),
          t('moments.farpc.achievement2'),
          t('moments.farpc.achievement3'),
        ],
        technologies: [
          'Leadership',
          'Event Organization',
          'AI/ML Workshops',
          'Community Building',
        ],
        details: t('moments.farpc.details'),
        links: [
          {
            label: t('moments.farpc.linkLabel'),
            url: 'https://www.facebook.com/FARPC.HCM/',
            icon: 'bi-facebook',
          },
        ],
        images: [],
      },
      {
        id: 'fpt-fa25-commendation-2025',
        title: t('moments.fptFa25.title'),
        year: '2025',
        date: t('moments.fptFa25.date'),
        location: t('moments.fptFa25.location'),
        category: t('moments.category.activity'),
        categoryIcon: 'bi-award',
        description: t('moments.fptFa25.description'),
        achievements: [
          t('moments.fptFa25.achievement1'),
          t('moments.fptFa25.achievement2'),
        ],
        technologies: ['Leadership', 'Academic Excellence', 'Research', 'Community Impact'],
        details: t('moments.fptFa25.details'),
        links: [],
        images: [`${import.meta.env.BASE_URL}assets/moments/le-ton-vinh.jpg`],
      },

      /* ── Research ── */
      {
        id: 'aita-lab-research',
        title: t('moments.aitaLab.title'),
        year: '2025-Present',
        date: t('moments.aitaLab.date'),
        location: t('moments.aitaLab.location'),
        category: t('moments.category.research'),
        categoryIcon: 'bi-cpu',
        description: t('moments.aitaLab.description'),
        achievements: [
          t('moments.aitaLab.achievement1'),
          t('moments.aitaLab.achievement2'),
        ],
        technologies: [
          'Python',
          'PyTorch',
          'Computer Vision',
          'Vision-Language Models',
          'Quantum ML',
          'Research',
        ],
        details: t('moments.aitaLab.details'),
        links: [
          {
            label: t('moments.aitaLab.linkLabel'),
            url: 'https://github.com/mihtriii',
            icon: 'bi-github',
          },
        ],
        images: [],
      },
    ],
    [t],
  );

  /* ── derived: years ── */
  const years = useMemo(() => {
    const set = new Set([allLabel]);
    moments.forEach((m) => {
      const y = m.year.split('-')[0];
      set.add(y);
    });
    return Array.from(set).sort((a, b) => {
      if (a === allLabel) return -1;
      if (b === allLabel) return 1;
      return parseInt(b, 10) - parseInt(a, 10);
    });
  }, [moments, allLabel]);

  /* ── derived: categories ── */
  const categories = useMemo(() => {
    const set = new Set([allLabel]);
    moments.forEach((m) => set.add(m.category));
    return Array.from(set);
  }, [moments, allLabel]);

  /* ── filter + sort ── */
  const filteredMoments = useMemo(() => {
    return moments
      .filter((m) => {
        const okCat =
          categoryFilter === allLabel || m.category === categoryFilter;
        const okYear =
          yearFilter === allLabel || m.year.startsWith(yearFilter);
        const q = searchQuery.trim().toLowerCase();
        const okQuery =
          q === '' ||
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          (m.technologies?.some((t) => t.toLowerCase().includes(q)) ?? false);
        return okCat && okYear && okQuery;
      })
      .sort((a, b) => {
        const ay = parseInt(a.year.split('-')[0], 10) || 0;
        const by = parseInt(b.year.split('-')[0], 10) || 0;
        if (by !== ay) return by - ay;
        // secondary sort: newer (Present) first within same year group
        const aHasPresent = a.year.includes('Present');
        const bHasPresent = b.year.includes('Present');
        if (aHasPresent && !bHasPresent) return -1;
        if (!aHasPresent && bHasPresent) return 1;
        return (b.date || '').localeCompare(a.date || '');
      });
  }, [moments, categoryFilter, yearFilter, searchQuery, allLabel]);

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} />
      </aside>

      <div className="col-12 col-lg-9">
        {/* Hero */}
        <section className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1">
            <span className="gradient-text">{t('moments.title')}</span>
          </h1>
          <p className="text-secondary mb-0">{t('moments.subtitle')}</p>
        </section>

        {/* ── Filters bar ── */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
          {/* Category pills */}
          <div className="d-flex gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${
                  categoryFilter === cat ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-muted mx-1">|</span>

          {/* Year dropdown */}
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto', minWidth: 110 }}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y === allLabel ? allLabel : y}
              </option>
            ))}
          </select>

          <div className="ms-auto" />

          {/* Search */}
          <input
            className="form-control form-control-sm search-input-glow"
            style={{ maxWidth: 240 }}
            placeholder={t('moments.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ── Timeline ── */}
        <div className="position-relative">
          {/* Vertical timeline line (desktop) */}
          <div
            className="d-none d-md-block position-absolute top-0"
            style={{
              left: 19,
              width: 2,
              height: '100%',
              background:
                'linear-gradient(to bottom, var(--bs-primary), var(--bs-primary) 85%, transparent)',
              opacity: 0.25,
            }}
          />

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.06, delayChildren: 0.06 },
              },
            }}
          >
            {filteredMoments.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="bi bi-search fs-3 d-block mb-2" />
                <p>{t('moments.noResults')}</p>
              </div>
            ) : (
              filteredMoments.map((moment) => (
                <div key={moment.id} className="d-flex mb-4 position-relative">
                  {/* Timeline dot */}
                  <div
                    className="d-none d-md-flex flex-column align-items-center"
                    style={{ width: 40, minWidth: 40, paddingTop: '1.2rem' }}
                  >
                    <div
                      className="rounded-circle border border-2 border-primary"
                      style={{
                        width: 14,
                        height: 14,
                        background: 'var(--bs-body-bg)',
                        zIndex: 1,
                      }}
                    />
                  </div>

                  {/* Card wrapper */}
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    {/* Year label */}
                    <div className="mb-1">
                      <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                        <i className="bi bi-clock me-1" />
                        {moment.year}
                      </span>
                    </div>

                    <MomentCard
                      moment={{ ...moment, t }}
                      onImageClick={openLightbox}
                    />

                    {/* Extra image strip if >1 images */}
                    {moment.images && moment.images.length > 1 && (
                      <ImageGalleryStrip
                        images={moment.images}
                        onImageClick={openLightbox}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Lightbox modal ── */}
      <AnimatePresence>
        {lightbox.open && lightbox.images.length > 0 && (
          <ImageLightbox
            images={lightbox.images}
            currentIndex={lightbox.index}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}