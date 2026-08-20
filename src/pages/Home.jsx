import React, { useRef, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import BlurImage from '../components/BlurImage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Tilt from '../components/Tilt.jsx';
import Typewriter from '../components/Typewriter.jsx';
import { toast } from '../components/Toast.jsx';
import { social, hasRealScholar } from '../config/site.js';
import { useI18n } from '../i18n/index.jsx';

const SECTIONS = {
  about: 'About Me',
  metrics: 'Impact & Highlights',
  focus: 'Research Focus',
  publications: 'Selected Research',
  projects: 'Projects & Demos',
  contact: 'Get In Touch',
};

function Section({ id, title, eyebrow, action, children }) {
  return (
    <section id={id} className="section mb-5" data-animate>
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-3 pb-2 border-bottom border-zinc">
        <div>
          {eyebrow && <span className="roman-eyebrow d-block mb-1">{eyebrow}</span>}
          <h2 className="h4 mb-0 font-display fw-bold text-primary">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const { t } = useI18n();
  const sectionIds = ['about', 'focus', 'publications', 'projects', 'contact'];

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  };

  const allProjects = useMemo(
    () => [
      {
        title: 'Mini‐VLM Playground',
        desc: 'Multimodal retrieval, visual grounding, and instruction-tuning benchmarks with small-scale models.',
        tags: ['VLM', 'Grounding', 'Retrieval', 'PyTorch'],
        status: 'Active',
      },
      {
        title: 'Quantum ML for Vision',
        desc: 'Hybrid quantum‐classical vision baselines on medical and standard datasets using Qiskit & PennyLane.',
        tags: ['QML', 'Federated', 'Quantum Circuit'],
        status: 'Research',
      },
      {
        title: 'Edge‐friendly CV & UAV',
        desc: 'Lightweight distillation, INT8 quantization, and efficient real-time object detection for edge AI.',
        tags: ['Edge AI', 'Distillation', 'TensorRT'],
        status: 'Prototype',
      },
    ],
    []
  );

  const featuredPublications = useMemo(
    () => [
      {
        id: 'slimfusion',
        title: 'SlimFusion: Lightweight Audio–Visual Emotion Recognition for Edge Inference',
        venue: 'MIWAI 2026 (LNAI, Springer)',
        date: 'Aug 2026',
        status: 'Accepted',
        authors: 'Minh Tri Nguyen, et al.',
        tags: ['Audio-Visual Fusion', 'Edge Inference', 'Emotion Recognition'],
        link: 'https://miwai26.miwai.org/',
      },
      {
        id: 'quantum-federated',
        title: 'Hybrid Quantum Federated Learning for Brain Tumor Magnetic Resonance Imaging Analysis',
        venue: 'IEEE ICCE 2026',
        date: 'Jun 2026',
        status: 'Accepted',
        authors: 'Quang Nhan Hoang, Minh Tri Nguyen, Duc Ngoc Minh Dang',
        tags: ['Quantum ML', 'Federated Learning', 'Medical Imaging'],
        link: 'https://daihoc.fpt.edu.vn/hcm/aita-lab-tiep-tuc-ghi-dau-an-quoc-te-voi-02-bai-bao-tai-ieee-icce-2026/',
      },
    ],
    []
  );

  const copyEmail = () => {
    navigator.clipboard.writeText('mihtriii295@gmail.com');
    toast('Copied mihtriii295@gmail.com to clipboard!');
  };

  return (
    <div className="row g-4 page-transition">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} showSocial={true} />
      </aside>

      <div className="col-12 col-lg-9">
        {/* HERO SECTION */}
        <section
          className="hero-section roman-card-elevated p-4 p-md-5 mb-5 position-relative overflow-hidden spotlight"
          id="main-content"
          data-animate
          onMouseMove={handleHeroMouseMove}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="hero-ambient" aria-hidden="true" />

          <div className="row align-items-center g-4 g-md-5 position-relative z-1">
            {/* Avatar Profile Frame */}
            <div className="col-12 col-md-5 text-center order-1 order-md-2 mb-2 mb-md-0">
              <Tilt className="avatar-tilt-wrapper">
                <div className="avatar-glow-ring mx-auto">
                  <BlurImage
                    src={`${import.meta.env.BASE_URL}assets/avatar.JPG`}
                    alt="Nguyễn Minh Trí"
                    width={280}
                    height={280}
                    className="rounded-circle img-fluid avatar-hero-img"
                    imgProps={{ loading: 'eager', decoding: 'async', fetchPriority: 'high' }}
                    style={{ width: '100%', maxWidth: '280px', aspectRatio: '1/1', objectFit: 'cover' }}
                  />
                </div>
              </Tilt>
            </div>

            {/* Text & Action Column */}
            <div className="col-12 col-md-7 order-2 order-md-1 text-center text-md-start">
              {/* Status pill */}
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 status-pill">
                <span className="pulse-dot" />
                <span className="font-mono text-secondary small" style={{ fontSize: '0.75rem' }}>
                  Undergraduate Researcher @ AiTA Lab
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display fw-bold mb-2 hero-title text-gradient-gold">
                Nguyễn Minh Trí
              </h1>

              <div className="lead text-secondary mb-3 fw-medium">
                AI &amp; Quantum ML Research Enthusiast
              </div>

              {/* Dynamic Typewriter */}
              <div className="typewriter-box p-2 px-3 rounded-3 mb-4 d-inline-flex align-items-center gap-2 border border-zinc">
                <i className="bi bi-terminal text-gold"></i>
                <Typewriter
                  words={[
                    'Computer Vision & Visual Grounding',
                    'Vision-Language Models (VLMs)',
                    'Quantum Machine Learning (QML)',
                    'Efficient Edge AI & Distillation',
                  ]}
                  loop={true}
                  cursor={true}
                  typeSpeed={70}
                  deleteSpeed={40}
                  delaySpeed={1800}
                />
              </div>

              {/* CTA Buttons */}
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2 pt-1">
                <Link to="/cv" className="btn-roman btn-roman-primary">
                  <i className="bi bi-file-earmark-person me-1"></i> View CV
                </Link>
                <Link to="/publications" className="btn-roman btn-roman-secondary">
                  <i className="bi bi-journal-bookmark me-1"></i> Publications
                </Link>
                <a href="#contact" className="btn-roman btn-roman-ghost">
                  <i className="bi bi-envelope me-1"></i> Contact
                </a>
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-roman btn-roman-ghost"
                >
                  <i className="bi bi-github me-1"></i> GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* KEY HIGHLIGHTS / METRICS BANNER */}
        <div className="row g-3 mb-5" data-animate>
          <div className="col-6 col-md-3">
            <div className="roman-metric h-100 p-3 text-center">
              <div className="font-display fw-bold fs-3 text-gold">2+</div>
              <div className="small fw-semibold text-primary">Accepted Papers</div>
              <div className="text-muted small font-mono" style={{ fontSize: '0.72rem' }}>MIWAI & IEEE ICCE</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="roman-metric h-100 p-3 text-center">
              <div className="font-display fw-bold fs-3 text-gold">VOI '24</div>
              <div className="small fw-semibold text-primary">National Olympiad</div>
              <div className="text-muted small font-mono" style={{ fontSize: '0.72rem' }}>Honorable Mention</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="roman-metric h-100 p-3 text-center">
              <div className="font-display fw-bold fs-3 text-gold">3rd Prize</div>
              <div className="small fw-semibold text-primary">Solve for Tomorrow</div>
              <div className="text-muted small font-mono" style={{ fontSize: '0.72rem' }}>Samsung Vietnam '24</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="roman-metric h-100 p-3 text-center">
              <div className="font-display fw-bold fs-3 text-gold">AiTA Lab</div>
              <div className="small fw-semibold text-primary">Research Assistant</div>
              <div className="text-muted small font-mono" style={{ fontSize: '0.72rem' }}>FPT University HCMC</div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <Section id="about" title={SECTIONS.about} eyebrow="Overview">
          <div className="roman-card beam-border">
            <div className="roman-card-inner p-4">
              <p className="lead mb-3" style={{ fontSize: '1.05rem', lineHeight: '1.75' }}>
                I am an <strong>Undergraduate Research Assistant at AiTA Lab, FPT University Ho Chi Minh City</strong>. 
                I learn by building tangible prototypes and enjoy working at the intersection of <strong>Computer Vision</strong>, 
                <strong>Vision‐Language Models (VLMs)</strong>, and exploring <strong>Quantum Machine Learning (QML)</strong> for multimodal representations.
              </p>
              <p className="text-secondary mb-3">
                I strongly value research clarity, simple baselines, and reproducible experiments. 
                Currently, I am focusing on multimodal retrieval, visual grounding, lightweight distillation for edge inference, and hybrid quantum federated learning baselines.
              </p>
              <div className="d-flex align-items-center gap-2 pt-2 flex-wrap">
                <span className="text-muted small me-2 font-mono">Profiles:</span>
                <a className="icon-btn" data-brand="kaggle" href={social.kaggle} target="_blank" rel="noopener" aria-label="Kaggle" title="Kaggle">
                  <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="16" height="16" loading="lazy" decoding="async" />
                </a>
                <a className="icon-btn" data-brand="linkedin" href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a className="icon-btn" data-brand="github" href={social.github} target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
                  <i className="bi bi-github"></i>
                </a>
                <a className="icon-btn" data-brand="orcid" href={social.orcid} target="_blank" rel="noopener" aria-label="ORCID" title="ORCID">
                  <i className="bi bi-person-badge"></i>
                </a>
                {hasRealScholar && (
                  <a className="icon-btn" data-brand="scholar" href={social.scholar} target="_blank" rel="noopener" aria-label="Google Scholar" title="Google Scholar">
                    <i className="bi bi-mortarboard"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* RESEARCH FOCUS SECTION */}
        <Section id="focus" title={SECTIONS.focus} eyebrow="Domains">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="roman-card beam-border h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-gold bg-opacity-10 text-gold fs-5">
                    <i className="bi bi-eye"></i>
                  </div>
                  <h3 className="h6 mb-0 font-display fw-bold">Vision-Language</h3>
                </div>
                <p className="text-secondary small mb-3 flex-grow-1">
                  Multimodal retrieval, visual grounding, instruction tuning, cross-modal representation learning, and rigorous benchmark evaluation.
                </p>
                <div className="d-flex flex-wrap gap-1 mt-auto">
                  <span className="roman-badge-gold">CLIP</span>
                  <span className="roman-badge-gold">Grounding</span>
                  <span className="roman-badge-gold">VLM</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="roman-card beam-border h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-gold bg-opacity-10 text-gold fs-5">
                    <i className="bi bi-cpu"></i>
                  </div>
                  <h3 className="h6 mb-0 font-display fw-bold">Quantum ML</h3>
                </div>
                <p className="text-secondary small mb-3 flex-grow-1">
                  Hybrid quantum‐classical models, parameterized quantum circuits (PQC), quantum federated learning, and quantum vision applications.
                </p>
                <div className="d-flex flex-wrap gap-1 mt-auto">
                  <span className="roman-badge-gold">Qiskit</span>
                  <span className="roman-badge-gold">PennyLane</span>
                  <span className="roman-badge-gold">PQC</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="roman-card beam-border h-100 p-4 d-flex flex-column">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-gold bg-opacity-10 text-gold fs-5">
                    <i className="bi bi-lightning-charge"></i>
                  </div>
                  <h3 className="h6 mb-0 font-display fw-bold">Efficient Vision</h3>
                </div>
                <p className="text-secondary small mb-3 flex-grow-1">
                  Knowledge distillation, quantization, active learning for edge inference, and lightweight architectures for UAV deployment.
                </p>
                <div className="d-flex flex-wrap gap-1 mt-auto">
                  <span className="roman-badge-gold">Distillation</span>
                  <span className="roman-badge-gold">Edge AI</span>
                  <span className="roman-badge-gold">UAV</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* SELECTED PUBLICATIONS SECTION */}
        <Section
          id="publications"
          title={SECTIONS.publications}
          eyebrow="Academic"
          action={
            <Link to="/publications" className="text-decoration-none small text-gold d-inline-flex align-items-center gap-1">
              All Publications <i className="bi bi-arrow-right"></i>
            </Link>
          }
        >
          <div className="d-flex flex-column gap-3">
            {featuredPublications.map((pub) => (
              <div key={pub.id} className="roman-card beam-border p-4">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <span className="roman-badge-gold">
                    <i className="bi bi-journal-richtext me-1"></i> {pub.venue}
                  </span>
                  <span className="roman-badge-status status-accepted">
                    <i className="bi bi-patch-check-fill me-1"></i> {pub.status}
                  </span>
                  <span className="text-secondary small font-mono">{pub.date}</span>
                </div>
                <h3 className="h6 font-display fw-bold mb-2 text-primary">
                  {pub.title}
                </h3>
                <p className="text-secondary small mb-3">{pub.authors}</p>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <div className="d-flex flex-wrap gap-1">
                    {pub.tags.map((t) => (
                      <span key={t} className="roman-badge-gold" style={{ fontSize: '0.7rem' }}>{t}</span>
                    ))}
                  </div>
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-roman btn-roman-secondary btn-sm"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i> Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* PROJECTS SECTION */}
        <Section
          id="projects"
          title={SECTIONS.projects}
          eyebrow="Code & Demos"
          action={
            <Link to="/repos" className="text-decoration-none small text-gold d-inline-flex align-items-center gap-1">
              GitHub Repos <i className="bi bi-arrow-right"></i>
            </Link>
          }
        >
          <div className="row g-3 row-cols-1 row-cols-md-3">
            {allProjects.map((p, i) => (
              <div key={i} className="col">
                <div className="roman-card beam-border h-100 p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h3 className="h6 mb-0 font-display fw-semibold">{p.title}</h3>
                    <span className="roman-badge-gold" style={{ fontSize: '0.68rem' }}>{p.status}</span>
                  </div>
                  <p className="text-secondary small mb-3 flex-grow-1">{p.desc}</p>
                  <div className="d-flex flex-wrap gap-1 mt-auto">
                    {p.tags.map((t) => (
                      <span key={t} className="roman-badge-gold" style={{ fontSize: '0.68rem' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* CONTACT SECTION */}
        <Section id="contact" title={SECTIONS.contact} eyebrow="Collaboration">
          <div className="roman-card beam-border p-4">
            <div className="row g-4 align-items-center">
              <div className="col-12 col-md-7">
                <h3 className="h5 font-display fw-bold mb-2">Let's connect and discuss research.</h3>
                <p className="text-secondary small mb-3">
                  I'm always open to lightweight, focused research collaborations, paper discussions, and open-source ML projects.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <button onClick={copyEmail} className="btn-roman btn-roman-primary btn-sm">
                    <i className="bi bi-clipboard me-1"></i> Copy Email
                  </button>
                  <a href={social.email} className="btn-roman btn-roman-secondary btn-sm">
                    <i className="bi bi-envelope me-1"></i> Send Email
                  </a>
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="btn-roman btn-roman-ghost btn-sm">
                    <i className="bi bi-linkedin me-1"></i> LinkedIn
                  </a>
                </div>
              </div>

              <div className="col-12 col-md-5 border-start border-zinc ps-md-4">
                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex align-items-center gap-2 text-secondary">
                    <i className="bi bi-envelope text-gold"></i>
                    <span>mihtriii295@gmail.com</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-secondary">
                    <i className="bi bi-building text-gold"></i>
                    <span>AiTA Lab, FPT University HCMC</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-secondary">
                    <i className="bi bi-geo-alt text-gold"></i>
                    <span>Ho Chi Minh City, Vietnam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}