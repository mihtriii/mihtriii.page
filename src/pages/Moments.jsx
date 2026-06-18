import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

/* ── Lightbox ── */
function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext, caption }) {
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
        aria-label="Close gallery"
      >
        <i className="bi bi-x-lg fs-5" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="btn btn-dark border-0 rounded-circle position-absolute d-flex align-items-center justify-content-center"
          style={{ left: 20, width: 48, height: 48, zIndex: 10 }}
          aria-label="Previous photo"
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
          maxWidth: '92vw', maxHeight: '78vh',
          objectFit: 'contain', borderRadius: 8,
          cursor: 'default',
          boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
        }}
      />

      {/* Caption + counter */}
      {caption && (
        <div
          className="position-absolute text-white px-3 py-2 rounded-3 text-center"
          style={{
            bottom: 70, left: '50%', transform: 'translateX(-50%)',
            maxWidth: '90vw',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.9rem',
          }}
        >
          {caption.title && <div className="fw-semibold">{caption.title}</div>}
          {(caption.date || caption.location) && (
            <div className="small text-white-50 mt-1">
              {caption.date}
              {caption.date && caption.location ? ' · ' : ''}
              {caption.location}
            </div>
          )}
        </div>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="btn btn-dark border-0 rounded-circle position-absolute d-flex align-items-center justify-content-center"
          style={{ right: 20, width: 48, height: 48, zIndex: 10 }}
          aria-label="Next photo"
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
function MomentCard({ moment, onImageClick, featured = false }) {
  const magneticRef = useMagnetic(0.05);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      id={`moment-${moment.id}`}
    >
      <div
        ref={magneticRef}
        className={`card card-hover card-elevate card-gradient-border magnetic overflow-hidden ${
          featured ? 'moment-featured' : ''
        }`}
        style={
          featured
            ? {
                border: '1px solid rgba(var(--bs-primary-rgb), 0.4)',
                boxShadow: '0 8px 32px rgba(var(--bs-primary-rgb), 0.12)',
              }
            : undefined
        }
      >
        {moment.images && moment.images.length > 0 && (
          <div
            className="position-relative overflow-hidden moment-image-wrap"
            style={{ cursor: 'pointer' }}
            onClick={() => onImageClick(moment.images, 0, moment)}
          >
            <img
              src={moment.images[0]}
              alt={moment.title}
              className="card-img-top moment-image"
              style={{ height: featured ? 340 : 260, objectFit: 'cover' }}
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
            {/* Featured ribbon */}
            {featured && (
              <span
                className="position-absolute top-0 start-0 m-2 badge d-flex align-items-center gap-1"
                style={{
                  fontSize: '0.75rem',
                  background:
                    'linear-gradient(135deg, var(--bs-primary), #6f42c1)',
                  color: '#fff',
                  padding: '6px 10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                <i className="bi bi-star-fill" />
                {moment.t('moments.featuredBadge') || 'Highlighted'}
              </span>
            )}
            {/* Hover hint */}
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center moment-hover-overlay">
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
            <h3 className={`mb-0 fw-semibold ${featured ? 'h5' : 'h6'}`}>
              {moment.title}
            </h3>
            <span className="badge text-bg-primary flex-shrink-0 ms-2">
              {moment.year}
            </span>
          </div>

          {/* Date + Location */}
          <div className="text-secondary small mb-3">
            <i className="bi bi-calendar3 me-1" />
            {moment.date} · {moment.location}
          </div>

          {/* Description */}
          <p className="mb-3 flex-grow-1 text-secondary small moment-description">
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
                  <span
                    key={i}
                    className="badge text-bg-secondary bg-opacity-10 text-body moment-tech-badge"
                  >
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
          <AnimatePresence>
            {expanded && (
              <motion.div
                key="expanded"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
                className="mt-3 pt-3 border-top border-light-subtle"
              >
                {moment.details && (
                  <div className="text-secondary small mb-3">
                    {moment.details}
                  </div>
                )}

                {/* Evidence section */}
                {moment.links && moment.links.length > 0 && (
                  <div className="mb-3">
                    <div className="fw-semibold small mb-2">
                      <i className="bi bi-link-45deg me-1" />
                      {moment.t('moments.evidence') || 'Evidence'}
                    </div>
                    <div className="d-flex flex-wrap gap-2">
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
                          <i className="bi bi-box-arrow-up-right ms-1 small" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* What I learned */}
                {moment.learnings && moment.learnings.length > 0 && (
                  <div>
                    <div className="fw-semibold small mb-2">
                      <i className="bi bi-lightbulb me-1" />
                      {moment.t('moments.whatLearned') || 'What I learned'}
                    </div>
                    <ul className="small text-secondary mb-0 ps-3">
                      {moment.learnings.map((l, i) => (
                        <li key={i} className="mb-1">{l}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Multi-image gallery strip ── */
function ImageGalleryStrip({ images, onImageClick }) {
  if (!images || images.length <= 1) return null;
  return (
    <div className="d-flex gap-2 mt-2 overflow-auto pb-1 moment-thumb-strip" style={{ scrollSnapType: 'x mandatory' }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="rounded flex-shrink-0 moment-thumb"
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

/* ── Stats summary ── */
function StatsSummary({ moments, t }) {
  const stats = useMemo(() => {
    const counts = {
      total: moments.length,
      competition: 0,
      hackathon: 0,
      research: 0,
      leadership: 0,
    };
    moments.forEach((m) => {
      const cat = m.categoryKey;
      if (counts[cat] !== undefined) counts[cat] += 1;
    });
    // Span (years)
    const years = moments
      .map((m) => parseInt(m.year.split('-')[0], 10))
      .filter((y) => !isNaN(y));
    const minYear = years.length ? Math.min(...years) : null;
    const maxYear = years.length ? Math.max(...years) : null;
    const span = minYear && maxYear ? `${minYear}–${maxYear}` : '—';
    return { ...counts, span };
  }, [moments]);

  const items = [
    { key: 'total', value: stats.total, label: t('moments.statsMoments'), icon: 'bi-collection' },
    { key: 'competition', value: stats.competition, label: t('moments.statsCompetitions'), icon: 'bi-trophy' },
    { key: 'hackathon', value: stats.hackathon, label: t('moments.statsHackathons'), icon: 'bi-lightning-charge' },
    { key: 'research', value: stats.research, label: t('moments.statsResearch'), icon: 'bi-cpu' },
    { key: 'leadership', value: stats.leadership, label: t('moments.statsLeadership'), icon: 'bi-people' },
    { key: 'span', value: stats.span, label: t('moments.statsSpan'), icon: 'bi-calendar-range' },
  ];

  return (
    <div className="row g-2 mb-3">
      {items.map((it) => (
        <div key={it.key} className="col-6 col-md-4 col-lg-2">
          <div className="card card-elevate card-gradient-border h-100">
            <div className="card-body p-3 d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: 36, height: 36,
                  background: 'rgba(var(--bs-primary-rgb), 0.1)',
                  color: 'var(--bs-primary)',
                }}
              >
                <i className={`bi ${it.icon} fs-5`} />
              </div>
              <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                <span className="fw-semibold text-truncate" style={{ fontSize: '1.05rem' }}>
                  {it.value}
                </span>
                <span className="text-secondary small text-truncate">
                  {it.label}
                </span>
              </div>
            </div>
          </div>
        </div>
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
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0, caption: null });
  const openLightbox = useCallback((images, index, moment) => {
    setLightbox({
      open: true,
      images,
      index,
      caption: moment
        ? { title: moment.title, date: moment.date, location: moment.location }
        : null,
    });
  }, []);
  const closeLightbox = useCallback(() => {
    setLightbox({ open: false, images: [], index: 0, caption: null });
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
        categoryKey: 'competition',
        categoryIcon: 'bi-trophy',
        description: t('moments.samsungSft.description'),
        achievements: [
          t('moments.samsungSft.achievement1'),
          t('moments.samsungSft.achievement2'),
        ],
        technologies: ['Python', 'PyTorch', 'Computer Vision', 'IoT', 'Arduino'],
        details: t('moments.samsungSft.details'),
        learnings: [
          'Hardware debug under time pressure is its own discipline.',
          'Communication with non-technical judges shapes which problems get funded.',
          'Shipping > polishing: a working 80% beats a perfect 100% two hours too late.',
        ],
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
        featured: true,
      },
      {
        id: 'voi-2024',
        title: t('moments.voi.title'),
        year: '2024',
        date: t('moments.voi.date'),
        location: t('moments.voi.location'),
        category: t('moments.category.competition'),
        categoryKey: 'competition',
        categoryIcon: 'bi-award',
        description: t('moments.voi.description'),
        achievements: [t('moments.voi.achievement1')],
        technologies: ['C++', 'Algorithms', 'Data Structures', 'Competitive Programming'],
        details: t('moments.voi.details'),
        learnings: [
          'Prove correctness before coding, not after.',
          'Decompose messy problems into clean invariants.',
          'The optimal solution is the one you can actually implement in time.',
        ],
        links: [
          {
            label: t('moments.voi.linkLabel'),
            url: 'https://voi.olp.vn/',
            icon: 'bi-box-arrow-up-right',
          },
        ],
        images: [],
      },
      /* ── Hackathons ── */
      {
        id: 'fpt-hackathon-2024',
        title: t('moments.fptHackathon.title'),
        year: '2025',
        date: t('moments.fptHackathon.date'),
        location: t('moments.fptHackathon.location'),
        category: t('moments.category.hackathon'),
        categoryKey: 'hackathon',
        categoryIcon: 'bi-lightning-charge',
        description: t('moments.fptHackathon.description'),
        achievements: [
          t('moments.fptHackathon.achievement1'),
          t('moments.fptHackathon.achievement2'),
        ],
        technologies: ['Unity', 'ARCore', 'Rapid Prototyping', 'Teamwork', 'Pitching'],
        details: t('moments.fptHackathon.details'),
        learnings: [
          'Scope ruthlessly: cut features, keep the core loop working.',
          'Pair programming at 4 AM teaches you who you can really work with.',
          'A working demo at 90% is more memorable than a perfect architecture at 0%.',
        ],
        links: [
          {
            label: 'Facebook',
            url: 'https://www.facebook.com/photo?fbid=1219345173555225&set=a.547769154046167',
            icon: 'bi-facebook',
          },
        ],
        images: [`${import.meta.env.BASE_URL}assets/moments/fpt-hackathon.jpg`],
      },
      {
        id: 'seal-hackathon-2024',
        title: t('moments.sealHackathon.title'),
        year: '2025',
        date: t('moments.sealHackathon.date'),
        location: t('moments.sealHackathon.location'),
        category: t('moments.category.hackathon'),
        categoryKey: 'hackathon',
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
        learnings: [
          'Mapping messy real-world problems to tractable ML formulations is the transferable skill.',
          'Domain knowledge is learnable; problem framing is the moat.',
          'Cross-domain teams ship surprisingly fast when scope is shared.',
        ],
        links: [
          {
            label: 'Facebook',
            url: 'https://www.facebook.com/photo?fbid=803626365826982&set=a.804514772404808',
            icon: 'bi-facebook',
          },
        ],
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
        categoryKey: 'leadership',
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
        learnings: [
          'Leadership is follow-through, not vision decks.',
          'Onboarding docs, event templates, and feedback loops outlast any single term.',
          'The win is when a junior runs something better than you did.',
        ],
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
        categoryKey: 'leadership',
        categoryIcon: 'bi-award',
        description: t('moments.fptFa25.description'),
        achievements: [
          t('moments.fptFa25.achievement1'),
          t('moments.fptFa25.achievement2'),
        ],
        technologies: ['Leadership', 'Academic Excellence', 'Research', 'Community Impact'],
        details: t('moments.fptFa25.details'),
        learnings: [
          'Recognition only makes sense if you reinvest it into the community.',
          'Balancing coursework, research, and organizing forces ruthless prioritization.',
        ],
        links: [
          {
            label: 'Facebook',
            url: 'https://www.facebook.com/photo?fbid=901423002713984&set=a.902939099229041',
            icon: 'bi-facebook',
          },
        ],
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
        categoryKey: 'research',
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
        learnings: [
          'Reproducing papers that don\'t quite replicate is a research skill on its own.',
          'Designing ablations that actually isolate variables is harder than running them.',
          'Confronting a flat loss curve is where depth is built.',
        ],
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

  /* ── group by year for visual grouping ── */
  const groupedByYear = useMemo(() => {
    const groups = new Map();
    filteredMoments.forEach((m) => {
      const yearKey = m.year.split('-')[0];
      if (!groups.has(yearKey)) groups.set(yearKey, []);
      groups.get(yearKey).push(m);
    });
    return Array.from(groups.entries());
  }, [filteredMoments]);

  const isAnyFilterActive =
    categoryFilter !== allLabel ||
    yearFilter !== allLabel ||
    searchQuery.trim() !== '';

  const clearAllFilters = useCallback(() => {
    setCategoryFilter(allLabel);
    setYearFilter(allLabel);
    setSearchQuery('');
  }, [allLabel]);

  /* ── shareable moment URLs (scroll to anchor when present) ── */
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#moment-')) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }
    }
  }, []);

  const featured = moments.find((m) => m.featured);

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
          <p className="text-secondary mb-2">{t('moments.subtitle')}</p>
          {t('moments.intro') && (
            <p className="text-secondary small mb-2" style={{ maxWidth: 720 }}>
              {t('moments.intro')}
            </p>
          )}
          <div className="d-flex flex-wrap gap-2 small text-secondary">
            <span className="badge text-bg-secondary bg-opacity-10 text-body d-inline-flex align-items-center gap-1">
              <i className="bi bi-shield-check" />
              {t('moments.metaEvidence')}
            </span>
            <span className="badge text-bg-secondary bg-opacity-10 text-body d-inline-flex align-items-center gap-1">
              <i className="bi bi-images" />
              {t('moments.metaLinks')}
            </span>
            <span className="badge text-bg-secondary bg-opacity-10 text-body d-inline-flex align-items-center gap-1">
              <i className="bi bi-clock-history" />
              {t('moments.metaUpdated')} 2026
            </span>
          </div>
        </section>

        {/* ── Stats summary ── */}
        <StatsSummary moments={moments} t={t} />

        {/* ── Featured Moment ── */}
        {featured && filteredMoments.some((m) => m.featured) && (
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h2 className="h6 mb-0 fw-semibold">
                <i className="bi bi-star-fill text-warning me-2" />
                {t('moments.featured') || 'Featured'}
              </h2>
            </div>
            <MomentCard
              moment={{ ...featured, t }}
              onImageClick={openLightbox}
              featured
            />
          </div>
        )}

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

          {filteredMoments.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: 80, height: 80,
                  background: 'rgba(var(--bs-primary-rgb), 0.08)',
                  color: 'var(--bs-primary)',
                }}
              >
                <i className="bi bi-search fs-1" />
              </div>
              <p className="text-secondary fw-semibold mb-1">{t('moments.noResults')}</p>
              <p className="text-secondary small mb-3">{t('moments.noResultsHint')}</p>
              {isAnyFilterActive && (
                <button className="btn btn-primary btn-sm" onClick={clearAllFilters}>
                  <i className="bi bi-x-circle me-1" />
                  {t('moments.clearFilters')}
                </button>
              )}
            </div>
          ) : (
            groupedByYear.map(([yearKey, yearMoments]) => (
              <div key={yearKey} className="mb-4">
                {/* Year header */}
                <div className="d-flex align-items-center gap-2 mb-3 ms-md-5 ps-md-2">
                  <span
                    className="badge bg-primary d-inline-flex align-items-center gap-1"
                    style={{ fontSize: '0.9rem', padding: '6px 12px' }}
                  >
                    <i className="bi bi-calendar-event" />
                    {yearKey}
                  </span>
                  <span className="text-secondary small">
                    {yearMoments.length}{' '}
                    {yearMoments.length === 1
                      ? t('moments.statsMoments').toLowerCase()
                      : t('moments.statsMoments').toLowerCase() + 's'}
                  </span>
                </div>

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: { staggerChildren: 0.06, delayChildren: 0.04 },
                    },
                  }}
                >
                  {yearMoments.map((moment) => (
                    <div key={moment.id} className="d-flex mb-3 position-relative">
                      {/* Timeline dot */}
                      <div
                        className="d-none d-md-flex flex-column align-items-center"
                        style={{ width: 40, minWidth: 40, paddingTop: '1.2rem' }}
                      >
                        <div
                          className="rounded-circle border border-2 border-primary moment-dot"
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
                  ))}
                </motion.div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Lightbox modal ── */}
      <AnimatePresence>
        {lightbox.open && lightbox.images.length > 0 && (
          <ImageLightbox
            images={lightbox.images}
            currentIndex={lightbox.index}
            caption={lightbox.caption}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}