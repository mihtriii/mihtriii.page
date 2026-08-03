import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import BlurImage from '../components/BlurImage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { toast } from '../components/Toast.jsx';
import { social, hasRealScholar } from '../config/site.js';
import { useI18n } from '../i18n/index.jsx';

const SECTIONS = {
  about: 'About',
  focus: 'Research Focus',
  projects: 'Projects',
  contact: 'Contact',
};

function Section({ id, title, children }) {
  return (
    <section id={id} className="section mb-4">
      <h2 className="h4 mb-3 font-display">{title}</h2>
      {children}
    </section>
  );
}

function ProjectCard({ project }) {
  const { t } = useI18n();
  const cardRef = useRef(null);

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const handleMouseMove = (e) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = (e) => {
    if (isTouch) return;
    e.currentTarget.style.setProperty('--mouse-x', '0px');
    e.currentTarget.style.setProperty('--mouse-y', '0px');
  };

  return (
    <div className="col">
      <div
        ref={cardRef}
        className="roman-card magnetic-card project-card h-100"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {project.preview && (
          <div className="project-preview">
            <img src={project.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
          </div>
        )}
        <div className="card-body p-4 d-flex flex-column h-100">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h3 className="h6 mb-0 fw-semibold font-display">{project.title}</h3>
            <span className="roman-badge-gold badge-pulse">
              <i className="bi bi-rocket-takeoff me-1"></i>
              {t('home.projects.soon')}
            </span>
          </div>
          <p className="mb-3 text-secondary small flex-grow-1">{project.desc}</p>
          <div className="d-flex gap-2 flex-wrap mt-auto">
            {project.tags.map((t) => (
              <span key={t} className="roman-badge-gold">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useI18n();
  const sectionIds = ['about', 'focus', 'projects', 'contact'];
  const heroRef = useRef(null);

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
        desc: 'Retrieval/grounding demos with small benchmarks',
        tags: ['VLM', 'Retrieval'],
        preview: null,
      },
      {
        title: 'QML for Vision',
        desc: 'Hybrid quantum‐classical baselines on MNIST/CIFAR',
        tags: ['QML', 'Vision'],
        preview: null,
      },
      {
        title: 'Edge‐friendly CV',
        desc: 'Distilled/quantized models for edge inference',
        tags: ['Edge', 'CV'],
        preview: null,
      },
    ],
    []
  );

  return (
    <div className="row g-4 page-transition">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} showSocial={false} />
      </aside>

      <div className="col-12 col-lg-9">
        {/* HERO SECTION */}
        <section
          className="hero-section roman-card-elevated p-4 p-md-5 mb-4 position-relative overflow-hidden spotlight"
          id="main-content"
          data-animate
          onMouseMove={handleHeroMouseMove}
        >
          {/* Floating Ambient Orbs */}
          <div className="floating-orbs" aria-hidden="true" />
          
          {/* Glitter Particle Layer */}
          <div className="glitter-layer" aria-hidden="true" />
          
          {/* Hero Ambient Gradient Shift */}
          <div className="hero-ambient" aria-hidden="true" />

          <div className="row align-items-center g-4 g-md-5 position-relative z-1">
            <div className="col-12 col-md-7">
              {/* English Greeting */}
              <span className="roman-eyebrow d-block mb-3">Hello, Visitor</span>
              
              {/* Main Headline */}
              <Suspense fallback={<h1 className="font-display fw-bold mb-3 text-gradient-animate" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.15 }}>Hi, I am Trí.</h1>}>
                <AnimatedHeadline
                  text="Hi, I am Trí."
                  tag="h1"
                  className="font-display fw-bold mb-3 text-gradient-animate"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.15 }}
                  splitType="words, chars"
                  delay={50}
                  duration={0.65}
                  ease="power3.out"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  scrollTrigger={false}
                />
              </Suspense>

              <p className="lead mb-4">
                <strong>Undergraduate Research Assistant</strong>
              </p>

              <div className="d-flex flex-wrap gap-2 mb-4">
                <Typewriter
                  words={["Computer Vision", "Vision‐Language Models", "Quantum ML"]}
                  loop={true}
                  cursor={true}
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </div>

              <div className="d-flex gap-3">
                <Link to="/cv" className="btn-roman btn-roman-primary">
                  <i className="bi bi-badge-ad me-1"></i> {t('nav.cv')}
                </Link>
                <a href="#contact" className="btn-roman btn-roman-secondary">
                  <i className="bi bi-envelope me-1"></i> {t('common.contact')}
                </a>
                <a href="https://github.com/mihtriii" target="_blank" rel="noopener" className="btn-roman btn-roman-secondary">
                  <i className="bi bi-github me-1"></i> GitHub
                </a>
              </div>
            </div>

            <div className="col-12 col-md-5">
              <Tilt>
                <BlurImage
                  src={`${import.meta.env.BASE_URL}assets/avatar.JPG`}
                  alt="Portrait"
                  width={320}
                  height={320}
                  className="rounded-circle mx-auto d-block img-fluid"
                  imgProps={{ loading: 'eager', decoding: 'async', fetchPriority: 'high' }}
                  style={{ width: '100%', maxWidth: '320px', aspectRatio: '1/1', objectFit: 'cover' }}
                />
              </Tilt>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator" aria-hidden="true">
            <span>Explore</span>
          </div>
        </section>

        <Section id="about" title={SECTIONS.about}>
          <div className="roman-card beam-border">
            <div className="roman-card-inner">
              <p className="lead mb-4">
                I'm an <strong>Undergraduate Research Assistant at AiTA Lab, FPT University</strong>,
                where I work on Computer Vision and Quantum Machine Learning research. I learn by
                building and enjoy working at the intersection of <strong>Computer Vision</strong> and{' '}
                <strong>Vision‐Language Models</strong>, exploring <strong>Quantum ML</strong> for vision as a long‐term
                research direction. I value clarity, simple baselines, and reproducible demos that make ideas tangible.
              </p>
              <p>
                Right now, I'm focused on practical VLM applications (retrieval, grounding, instruction‐tuning) and setting up strong habits for research: reading, small experiments, and writing. I'm open to collaborations that are lightweight, focused, and shipping‐oriented.
              </p>
              <div className="d-flex gap-2 mt-3">
                <a className="icon-btn" data-brand="kaggle" href={social.kaggle} target="_blank" rel="noopener" aria-label="Kaggle">
                  <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="18" height="18" loading="lazy" decoding="async" />
                </a>
                <a className="icon-btn" data-brand="linkedin" href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a className="icon-btn" data-brand="github" href={social.github} target="_blank" rel="noopener" aria-label="GitHub">
                  <i className="bi bi-github"></i>
                </a>
                <a className="icon-btn" data-brand="email" href={social.email} aria-label="Email">
                  <i className="bi bi-envelope"></i>
                </a>
                {hasRealScholar && (
                  <a className="icon-btn" data-brand="scholar" href={social.scholar} target="_blank" rel="noopener" aria-label="Google Scholar">
                    <i className="bi bi-mortarboard"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section id="focus" title={SECTIONS.focus}>
          <div className="roman-card beam-border">
            <div className="roman-card-inner">
              <ul className="mb-0">
                <li className="mb-2">
                  <strong>Vision‐Language:</strong> multimodal retrieval, visual grounding, instruction tuning, evaluation.
                </li>
                <li className="mb-2">
                  <strong>Efficient Vision:</strong> active learning, model distillation, edge deployment, UAV vision.
                </li>
                <li>
                  <strong>Quantum ML:</strong> hybrid quantum‐classical models for vision tasks, long‐term research direction.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="projects" title={SECTIONS.projects}>
          <div className="row g-3 row-cols-1 row-cols-md-2">
            {allProjects.map((p, i) => (
              <ProjectCard key={i} project={p} />
            ))}
          </div>
        </Section>

        <Section id="contact" title={SECTIONS.contact}>
          <div className="d-flex flex-column gap-3">
            <div className="contact-row">
              <i className="contact-icon bi bi-envelope"></i>
              <a href={social.email} className="contact-link">
                mihtriii295@gmail.com
              </a>
              <button
                className="btn-roman btn-roman-ghost btn-sm ms-auto"
                onClick={() => {
                  navigator.clipboard.writeText('mihtriii295@gmail.com');
                  toast(t('common.copied'));
                }}
              >
                <i className="bi bi-clipboard me-1"></i> {t('common.copy')}
              </button>
            </div>
            <div className="contact-row">
              <i className="contact-icon bi bi-github"></i>
              <a href="https://github.com/mihtriii" target="_blank" rel="noopener" className="contact-link">
                github.com/mihtriii
              </a>
              <button
                className="btn-roman btn-roman-ghost btn-sm ms-auto"
                onClick={() => {
                  navigator.clipboard.writeText('https://github.com/mihtriii');
                  toast(t('common.copied'));
                }}
              >
                <i className="bi bi-clipboard me-1"></i> {t('common.copy')}
              </button>
            </div>
            <div className="contact-row">
              <i className="contact-icon bi bi-linkedin"></i>
              <a href="https://www.linkedin.com/in/mihtriii/" target="_blank" rel="noopener" className="contact-link">
                linkedin.com/in/mihtriii
              </a>
              <button
                className="btn-roman btn-roman-ghost btn-sm ms-auto"
                onClick={() => {
                  navigator.clipboard.writeText('https://www.linkedin.com/in/mihtriii/');
                  toast(t('common.copied'));
                }}
              >
                <i className="bi bi-clipboard me-1"></i> {t('common.copy')}
              </button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}