import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar.jsx';
import { useI18n } from '../i18n/index.jsx';
import { toast } from '../components/Toast.jsx';

const STATUS_STYLES = {
  published: { className: 'status-published', icon: 'bi-check-circle-fill' },
  accepted: { className: 'status-accepted', icon: 'bi-patch-check-fill' },
  inpress: { className: 'status-inpress', icon: 'bi-hourglass-split' },
  submitted: { className: 'status-submitted', icon: 'bi-send-fill' },
  preprint: { className: 'status-preprint', icon: 'bi-file-earmark-text-fill' },
};

function statusClass(status) {
  const key = status.toLowerCase().replace(/[^a-z]/g, '');
  return STATUS_STYLES[key]?.className || 'status-default';
}

function statusIcon(status) {
  const key = status.toLowerCase().replace(/[^a-z]/g, '');
  return STATUS_STYLES[key]?.icon || 'bi-circle';
}

function PublicationCard({ publication, t }) {
  const [showAbstract, setShowAbstract] = useState(false);
  const [showBibtex, setShowBibtex] = useState(false);

  const copyBibtex = (e) => {
    e.stopPropagation();
    if (publication.bibtex) {
      navigator.clipboard.writeText(publication.bibtex);
      toast('Copied BibTeX citation!');
    }
  };

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
      className="col-12"
    >
      <div className="roman-card beam-border p-4 h-100">
        {/* Top Badges */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <span className="roman-badge-gold">
            <i className="bi bi-journal-richtext me-1"></i>
            {publication.type}
          </span>
          {publication.status && (
            <span className={`roman-badge-status ${statusClass(publication.status)}`}>
              <i className={`bi ${statusIcon(publication.status)} me-1`}></i>
              {publication.status}
            </span>
          )}
          <span className="text-secondary small font-mono">
            <i className="bi bi-calendar3 me-1"></i>
            {publication.date}
          </span>
          <span className="text-gold small font-mono ms-auto">
            <i className="bi bi-geo-alt me-1"></i>
            {publication.venue}
          </span>
        </div>

        {/* Paper Image Preview if available */}
        {publication.image && (
          <div className="mb-3">
            <img
              src={publication.image}
              alt={publication.title}
              className="img-fluid rounded-3 border border-zinc publication-image"
              loading="lazy"
              decoding="async"
              style={{ maxHeight: '200px', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* Title */}
        <h2 className="h5 fw-bold mb-2 font-display text-primary">
          {publication.title}
        </h2>

        {/* Authors */}
        <p className="text-secondary small mb-2">
          {publication.authors.split('Minh Tri Nguyen').map((part, index, array) => (
            <React.Fragment key={index}>
              {part}
              {index < array.length - 1 && <strong className="text-gold fw-bold">Minh Tri Nguyen</strong>}
            </React.Fragment>
          ))}
        </p>

        {/* Citation info */}
        <p className="text-muted small mb-3 font-mono" style={{ fontSize: '0.78rem' }}>
          {publication.citation}
        </p>

        {/* Keywords */}
        {publication.keywords?.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {publication.keywords.map((kw) => (
              <span key={kw} className="roman-badge-gold" style={{ fontSize: '0.68rem' }}>
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Expandable Abstract */}
        {publication.abstract && (
          <div className="mb-3">
            <button
              onClick={() => setShowAbstract(!showAbstract)}
              className="btn btn-link text-decoration-none p-0 small text-gold d-flex align-items-center gap-1"
              style={{ fontSize: '0.8rem' }}
            >
              <i className={`bi bi-chevron-${showAbstract ? 'up' : 'down'}`}></i>
              {showAbstract ? 'Hide Abstract' : 'View Abstract'}
            </button>
            {showAbstract && (
              <div className="mt-2 p-3 rounded-3 bg-card border border-zinc small text-secondary">
                {publication.abstract}
              </div>
            )}
          </div>
        )}

        {/* Expandable BibTeX */}
        {showBibtex && publication.bibtex && (
          <div className="mb-3 p-3 rounded-3 bg-elevated border border-zinc position-relative">
            <button
              onClick={copyBibtex}
              className="btn-roman btn-roman-ghost btn-sm position-absolute top-0 end-0 m-2"
              style={{ fontSize: '0.72rem' }}
            >
              <i className="bi bi-clipboard me-1"></i> Copy
            </button>
            <pre className="mb-0 font-mono small text-secondary" style={{ fontSize: '0.75rem', overflowX: 'auto' }}>
              {publication.bibtex}
            </pre>
          </div>
        )}

        {/* Action Links & BibTeX button */}
        <div className="d-flex flex-wrap align-items-center gap-2 pt-2 border-top border-zinc">
          {publication.links?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-roman btn-roman-secondary btn-sm"
            >
              <i className={`bi ${link.icon} me-1`}></i>
              {link.label}
            </a>
          ))}
          {publication.bibtex && (
            <button
              onClick={() => setShowBibtex(!showBibtex)}
              className="btn-roman btn-roman-ghost btn-sm"
            >
              <i className="bi bi-quote me-1"></i>
              {showBibtex ? 'Hide BibTeX' : 'Cite (BibTeX)'}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Publications() {
  const { t } = useI18n();
  const sectionIds = ['featured-publications', 'publication-list'];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const publications = useMemo(
    () => [
      {
        id: 'slimfusion-lightweight-audio-visual-emotion',
        type: 'Conference',
        status: 'Accepted',
        title: 'SlimFusion: Lightweight Audio–Visual Emotion Recognition for Edge Inference',
        authors: 'Minh Tri Nguyen, et al.',
        date: 'Aug 2026',
        venue: 'MIWAI 2026 (LNAI, Springer)',
        citation:
          'In Proceedings of the 19th International Conference on Multi-disciplinary Trends in Artificial Intelligence (MIWAI 2026), LNAI, Springer, Aug 2026',
        abstract:
          'SlimFusion proposes an ultra-lightweight multimodal audio-visual fusion framework engineered specifically for real-time edge devices. By deploying cross-attention distillation and selective quantization, the system achieves superior emotion recognition accuracy while minimizing compute parameters and latency.',
        keywords: [
          'Audio-Visual Fusion',
          'Edge Inference',
          'Emotion Recognition',
          'Model Distillation',
          'Lightweight AI',
        ],
        bibtex: `@inproceedings{nguyen2026slimfusion,
  title={SlimFusion: Lightweight Audio--Visual Emotion Recognition for Edge Inference},
  author={Nguyen, Minh Tri and others},
  booktitle={Proceedings of the 19th International Conference on Multi-disciplinary Trends in Artificial Intelligence (MIWAI 2026)},
  series={Lecture Notes in Artificial Intelligence},
  publisher={Springer},
  year={2026},
  month={August}
}`,
        links: [
          {
            label: 'Conference Website',
            url: 'https://miwai26.miwai.org/',
            icon: 'bi-globe',
          },
        ],
      },
      {
        id: 'hybrid-quantum-federated-learning-brain-tumor',
        type: 'Conference',
        status: 'Accepted',
        title: 'Hybrid Quantum Federated Learning for Brain Tumor Magnetic Resonance Imaging Analysis',
        authors: 'Quang Nhan Hoang, Minh Tri Nguyen, and Duc Ngoc Minh Dang',
        date: 'Jun 2026',
        venue: 'IEEE ICCE 2026',
        citation:
          'In Proceedings of the 11th IEEE International Conference on Communications and Electronics (ICCE 2026), Jun 2026',
        image: '/assets/publications/icce.png',
        abstract:
          'This paper develops a privacy-preserving distributed architecture integrating Parameterized Quantum Circuits (PQC) within a Federated Learning framework for MRI brain tumor diagnosis. The hybrid model demonstrates high classification performance while strictly protecting patient data across client nodes.',
        keywords: [
          'Quantum Machine Learning',
          'Federated Learning',
          'Brain Tumor MRI',
          'Medical Imaging',
          'Hybrid Quantum Models',
        ],
        bibtex: `@inproceedings{hoang2026hybrid,
  title={Hybrid Quantum Federated Learning for Brain Tumor Magnetic Resonance Imaging Analysis},
  author={Hoang, Quang Nhan and Nguyen, Minh Tri and Dang, Duc Ngoc Minh},
  booktitle={Proceedings of the 11th IEEE International Conference on Communications and Electronics (ICCE 2026)},
  year={2026},
  month={June}
}`,
        links: [
          {
            label: 'Lab Press Release',
            url: 'https://daihoc.fpt.edu.vn/hcm/aita-lab-tiep-tuc-ghi-dau-an-quoc-te-voi-02-bai-bao-tai-ieee-icce-2026/',
            icon: 'bi-newspaper',
          },
          {
            label: 'Duc Dang Profile',
            url: 'https://dnmduc.github.io/',
            icon: 'bi-person-badge',
          },
          {
            label: 'Nhan Hoang Profile',
            url: 'https://nhanhqq.github.io/index.html',
            icon: 'bi-person-badge',
          },
        ],
      },
    ],
    []
  );

  const filteredPublications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return publications.filter((p) => {
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q) ||
        p.keywords?.some((k) => k.toLowerCase().includes(q));

      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      return matchQuery && matchStatus;
    });
  }, [publications, searchQuery, filterStatus]);

  return (
    <div className="row g-4 page-transition">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} />
      </aside>

      <div className="col-12 col-lg-9">
        <section
          id="featured-publications"
          className="hero-section roman-card-elevated p-4 p-md-5 mb-4 position-relative overflow-hidden spotlight"
          id="main-content"
          data-animate
        >
          <div className="hero-ambient" aria-hidden="true" />
          
          <span className="roman-eyebrow d-block mb-3">Scholarly Output</span>
          <h1 className="font-display fw-bold mb-2 hero-title text-gradient-gold">
            Publications &amp; Preprints
          </h1>
          <p className="text-secondary mb-0">
            Peer-reviewed conference proceedings, journal papers, and research manuscripts in Computer Vision and Quantum Machine Learning.
          </p>
        </section>

        {/* Search & Filter Bar */}
        <section id="publication-list" className="mb-4" data-animate>
          <div className="roman-card beam-border p-3 mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-6">
                <div className="position-relative">
                  <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                  <input
                    className="input-roman ps-5 form-control-sm"
                    placeholder="Search by title, author, keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-md-end gap-2">
                <span className="text-muted small font-mono">Status:</span>
                {['All', 'Accepted'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`btn-roman btn-sm ${filterStatus === st ? 'btn-roman-primary' : 'btn-roman-ghost'}`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {st}
                  </button>
                ))}
                <span className="roman-metric-pill ms-2">
                  <span className="roman-metric-value">{filteredPublications.length}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Publications List */}
          <motion.div
            className="row g-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {filteredPublications.length === 0 ? (
              <div className="col-12">
                <div className="text-center text-muted py-5">
                  <i className="bi bi-search fs-2 d-block mb-2"></i>
                  <p>No publications matching your query.</p>
                </div>
              </div>
            ) : (
              filteredPublications.map((pub) => (
                <PublicationCard key={pub.id} publication={pub} t={t} />
              ))
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}