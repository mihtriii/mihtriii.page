import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

function MomentCard({ moment }) {
  const magneticRef = useMagnetic(0.05);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
    >
      <div
        ref={magneticRef}
        className="card card-hover card-elevate card-gradient-border h-100 magnetic"
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h3 className="h6 mb-0 fw-semibold">{moment.title}</h3>
            <span className="badge text-bg-primary">
              {moment.year}
            </span>
          </div>
          <div className="text-secondary small mb-3">
            <i className="bi bi-calendar3 me-1"></i>
            {moment.date} · {moment.location}
          </div>
          <p className="mb-3 flex-grow-1 text-secondary small line-clamp-3">
            {moment.description}
          </p>
          
          {moment.achievements && moment.achievements.length > 0 && (
            <div className="mb-3">
              <div className="fw-semibold small mb-2">
                <i className="bi bi-trophy me-1"></i>
                {moment.t('moments.achievements') || 'Achievements'}
              </div>
              <ul className="small text-secondary mb-0">
                {moment.achievements.map((achievement, i) => (
                  <li key={i} className="mb-1">{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {moment.technologies && moment.technologies.length > 0 && (
            <div className="mb-3">
              <div className="fw-semibold small mb-2">
                <i className="bi bi-code-slash me-1"></i>
                {moment.t('moments.technologies') || 'Technologies'}
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

          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-light-subtle">
            {moment.category && (
              <span className="badge text-bg-secondary bg-opacity-10 text-body d-flex align-items-center gap-1">
                <i className={`bi ${moment.categoryIcon || 'bi-tag'}`}></i>
                {moment.category}
              </span>
            )}
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              <span className="ms-1">
                {expanded ? moment.t('moments.showLess') || 'Show less' : moment.t('moments.showMore') || 'Show more'}
              </span>
            </button>
          </div>

          {expanded && moment.details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-top border-light-subtle"
            >
              <div className="text-secondary small">
                {moment.details}
              </div>
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
              {moment.images && moment.images.length > 0 && (
                <div className="mt-3">
                  <div className="fw-semibold small mb-2">
                    <i className="bi bi-images me-1"></i>
                    {moment.t('moments.images') || 'Images'}
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {moment.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${moment.title} - ${i + 1}`}
                        className="img-thumbnail"
                        style={{ maxHeight: '120px', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Moments() {
  const { t } = useI18n();
  const sectionIds = ['competitions', 'hackathons', 'projects', 'activities'];
  const allLabel = t('common.all');
  const [categoryFilter, setCategoryFilter] = useState(() => t('common.all'));
  const [searchQuery, setSearchQuery] = useState('');

  // Moments data - competitions, hackathons, projects, activities
  const moments = useMemo(() => [
    // Competitions
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
        { label: t('moments.samsungSft.link1Label'), url: 'https://solvefortomorrow.vn/doi-thang-giai/t-gardens', icon: 'bi-box-arrow-up-right' },
        { label: t('moments.samsungSft.link2Label'), url: 'https://github.com/mihtriii/t-gardens', icon: 'bi-github' },
      ],
      images: [
        `${import.meta.env.BASE_URL}assets/moments/samsung-sft-1.jpg`,
        `${import.meta.env.BASE_URL}assets/moments/samsung-sft-2.jpg`,
      ],
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
      achievements: [
        t('moments.voi.achievement1'),
      ],
      technologies: ['C++', 'Algorithms', 'Data Structures', 'Competitive Programming'],
      details: t('moments.voi.details'),
      links: [
        { label: t('moments.voi.linkLabel'), url: 'https://voi.olp.vn/', icon: 'bi-box-arrow-up-right' },
      ],
      images: [
        `${import.meta.env.BASE_URL}assets/moments/voi-1.jpg`,
      ],
    },

    // Hackathons
    {
      id: 'aiot-hackathon-2025',
      title: t('moments.aiotHackathon.title'),
      year: '2025',
      date: t('moments.aiotHackathon.date'),
      location: t('moments.aiotHackathon.location'),
      category: t('moments.category.hackathon'),
      categoryIcon: 'bi-lightning-charge',
      description: t('moments.aiotHackathon.description'),
      achievements: [
        t('moments.aiotHackathon.achievement1'),
        t('moments.aiotHackathon.achievement2'),
      ],
      technologies: ['Python', 'TensorFlow Lite', 'Raspberry Pi', 'Computer Vision', 'Edge AI'],
      details: t('moments.aiotHackathon.details'),
      links: [
        { label: t('moments.aiotHackathon.linkLabel'), url: 'https://github.com/mihtriii/aiot-hackathon', icon: 'bi-github' },
      ],
      images: [
        `${import.meta.env.BASE_URL}assets/moments/aiot-1.jpg`,
        `${import.meta.env.BASE_URL}assets/moments/aiot-2.jpg`,
      ],
    },

    // Projects
    {
      id: 't-gardens-project',
      title: t('moments.tGardens.title'),
      year: '2024',
      date: t('moments.tGardens.date'),
      location: t('moments.tGardens.location'),
      category: t('moments.category.project'),
      categoryIcon: 'bi-folder',
      description: t('moments.tGardens.description'),
      achievements: [
        t('moments.tGardens.achievement1'),
        t('moments.tGardens.achievement2'),
      ],
      technologies: ['Python', 'OpenCV', 'YOLOv8', 'Arduino', 'IoT', 'Flask'],
      details: t('moments.tGardens.details'),
      links: [
        { label: t('moments.tGardens.link1Label'), url: 'https://github.com/mihtriii/t-gardens', icon: 'bi-github' },
        { label: t('moments.tGardens.link2Label'), url: 'https://solvefortomorrow.vn/doi-thang-giai/t-gardens', icon: 'bi-box-arrow-up-right' },
      ],
      images: [
        `${import.meta.env.BASE_URL}assets/moments/t-gardens-1.jpg`,
        `${import.meta.env.BASE_URL}assets/moments/t-gardens-2.jpg`,
      ],
    },
    {
      id: 'quantum-ml-project',
      title: t('moments.quantumMl.title'),
      year: '2025',
      date: t('moments.quantumMl.date'),
      location: t('moments.quantumMl.location'),
      category: t('moments.category.project'),
      categoryIcon: 'bi-folder',
      description: t('moments.quantumMl.description'),
      achievements: [
        t('moments.quantumMl.achievement1'),
      ],
      technologies: ['Qiskit', 'PennyLane', 'PyTorch', 'Quantum Computing', 'Computer Vision'],
      details: t('moments.quantumMl.details'),
      links: [
        { label: t('moments.quantumMl.linkLabel'), url: 'https://github.com/mihtriii/quantum-ml-vision', icon: 'bi-github' },
      ],
      images: [
        `${import.meta.env.BASE_URL}assets/moments/quantum-ml-1.jpg`,
      ],
    },

    // Activities
    {
      id: 'farpc-vice-president',
      title: t('moments.farpc.title'),
      year: '2024-2025',
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
      technologies: ['Leadership', 'Event Organization', 'AI/ML Workshops', 'Community Building'],
      details: t('moments.farpc.details'),
      links: [
        { label: t('moments.farpc.linkLabel'), url: 'https://www.facebook.com/FARPC.HCM/', icon: 'bi-facebook' },
      ],
      images: [
        `${import.meta.env.BASE_URL}assets/moments/farpc-1.jpg`,
        `${import.meta.env.BASE_URL}assets/moments/farpc-2.jpg`,
      ],
    },
    {
      id: 'aita-lab-research',
      title: t('moments.aitaLab.title'),
      year: '2024-Present',
      date: t('moments.aitaLab.date'),
      location: t('moments.aitaLab.location'),
      category: t('moments.category.research'),
      categoryIcon: 'bi-cpu',
      description: t('moments.aitaLab.description'),
      achievements: [
        t('moments.aitaLab.achievement1'),
        t('moments.aitaLab.achievement2'),
      ],
      technologies: ['Python', 'PyTorch', 'Computer Vision', 'Vision-Language Models', 'Quantum ML', 'Research'],
      details: t('moments.aitaLab.details'),
      links: [
        { label: t('moments.aitaLab.linkLabel'), url: 'https://github.com/mihtriii', icon: 'bi-github' },
      ],
      images: [
        `${import.meta.env.BASE_URL}assets/moments/aita-lab-1.jpg`,
      ],
    },
  ], [t]);

  const categories = useMemo(() => {
    const cats = new Set([allLabel]);
    moments.forEach(m => cats.add(m.category));
    return Array.from(cats);
  }, [moments, allLabel]);

  const filteredMoments = useMemo(() => {
    return moments.filter(m => {
      const okCat = categoryFilter === allLabel || m.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const okQuery = q === '' || 
        m.title.toLowerCase().includes(q) || 
        m.description.toLowerCase().includes(q) ||
        (m.technologies?.some(t => t.toLowerCase().includes(q)) ?? false);
      return okCat && okQuery;
    });
  }, [moments, categoryFilter, searchQuery, allLabel]);

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} />
      </aside>
      <div className="col-12 col-lg-9">
        <section className="page-hero hero-with-bg p-4 mb-3" data-animate>
          <h1 className="h3 mb-1">
            <span className="gradient-text">{t('moments.title')}</span>
          </h1>
          <p className="text-secondary mb-0">{t('moments.subtitle')}</p>
        </section>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
          <div className="ms-auto"></div>
          <input
            className="form-control form-control-sm search-input-glow"
            style={{ maxWidth: 260 }}
            placeholder={t('moments.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <motion.div
          className="row g-3 row-cols-1 row-cols-md-2"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
          }}
        >
          {filteredMoments.length === 0 ? (
            <div className="col-12">
              <div className="text-center text-muted py-5">
                <i className="bi bi-search"></i>
                <p>{t('moments.noResults')}</p>
              </div>
            </div>
          ) : (
              filteredMoments.map((moment) => (
                <MomentCard key={moment.id} moment={{ ...moment, t }} />
              ))
          )}
        </motion.div>
      </div>
    </div>
  );
}