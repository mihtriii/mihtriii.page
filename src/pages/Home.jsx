import React, { Suspense, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
const AnimatedHeadline = React.lazy(() => import('../components/AnimatedHeadline.jsx'));
import Typewriter from '../components/Typewriter.jsx';
import Tilt from '../components/Tilt.jsx';
import { Link } from 'react-router-dom';
import BlurImage from '../components/BlurImage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { toast } from '../components/Toast.jsx';
import { social, hasRealScholar } from '../config/site.js';
import { useI18n } from '../i18n/index.jsx';
import {
  useScrollAnimation,
  scrollAnimationVariants,
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '../hooks/useScrollAnimation.js';

const SECTIONS = {
  about: 'About',
  focus: 'Research Focus',
  goals: 'Goals',
  tech: 'Technologies',
  projects: 'Projects',
  contact: 'Contact',
};

function Section({ id, title, children }) {
  const { ref, controls } = useScrollAnimation();

  return (
    <motion.section
      ref={ref}
      id={id}
      className="section mb-4"
      initial="hidden"
      animate={controls}
      variants={scrollAnimationVariants}
    >
      <motion.h2 className="h4 mb-3 font-display" variants={fadeInUpVariants}>
        {title}
      </motion.h2>
      <motion.div variants={fadeInUpVariants}>{children}</motion.div>
    </motion.section>
  );
}

function ProjectCard({ project, index }) {
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
    <motion.div
      className="col"
      key={index}
      variants={staggerItemVariants}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div
        ref={cardRef}
        className="card-roman magnetic-card project-card"
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
    </motion.div>
  );
}

export default function Home() {
  const { t } = useI18n();
  const sectionIds = ['about', 'focus', 'goals', 'tech', 'projects', 'contact'];
  const heroRef = useRef(null);

  // Track mouse position for spotlight effect — use ref to avoid re-renders
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
        title: 'Mini‑VLM Playground',
        desc: 'Retrieval/grounding demos with small benchmarks',
        tags: ['VLM', 'Retrieval'],
        preview: null,
      },
      {
        title: 'QML for Vision',
        desc: 'Hybrid quantum‑classical baselines on MNIST/CIFAR',
        tags: ['QML', 'Vision'],
        preview: null,
      },
      {
        title: 'Edge‑friendly CV',
        desc: 'Distilled/quantized models for edge inference',
        tags: ['Edge', 'CV'],
        preview: null,
      },
    ],
    []
  );
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('All');
  const tags = ['All', 'VLM', 'Retrieval', 'QML', 'Vision', 'Edge', 'CV'];
  const filtered = allProjects.filter(
    (p) =>
      (tag === 'All' || p.tags.includes(tag)) &&
      (query.trim() === '' ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.desc.toLowerCase().includes(query.toLowerCase()))
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
              
              {/* Sub-headline */}
              <p className="text-secondary mb-2 fw-medium" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                <strong>Undergraduate Research Assistant</strong>
                <br />
                AiTA Lab, FPT University
              </p>
              
              {/* Typewriter */}
              <p className="text-secondary mb-4" style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)' }}>
                <Typewriter words={['Computer Vision', 'Vision‑Language Models', 'Quantum ML']} />
              </p>
              
              {/* Badges */}
              <div className="roman-metrics mb-4" role="list">
                <span className="roman-metric-pill" role="listitem"><i className="bi bi-eye me-1"></i><span className="roman-metric-label">Vision</span><span className="roman-metric-value">Computer Vision</span></span>
                <span className="roman-metric-pill" role="listitem"><i className="bi bi-cpu me-1"></i><span className="roman-metric-label">VLM</span><span className="roman-metric-value">Vision‑Language</span></span>
                <span className="roman-metric-pill" role="listitem"><i className="bi bi-lightning me-1"></i><span className="roman-metric-label">QML</span><span className="roman-metric-value">Quantum ML</span></span>
              </div>
              
              {/* CTA Buttons */}
              <div className="d-flex flex-wrap gap-2 hero-cta">
                <Link to="/cv" className="btn-roman btn-roman-primary btn-sm px-4 py-2">
                  <i className="bi bi-file-earmark-text me-1"></i> View CV
                </Link>
                <a href="#contact" className="btn-roman btn-roman-secondary btn-sm px-4 py-2">
                  <i className="bi bi-send me-1"></i> Contact
                </a>
                <a
                  className="btn-roman btn-roman-ghost btn-sm px-4 py-2"
                  href="https://github.com/mihtriii"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-github me-1"></i> GitHub
                </a>
              </div>
            </div>
            <div className="col-12 col-md-5 text-center">
              <Tilt className="d-inline-block avatar-frame">
                <BlurImage
                  className="portrait rounded-circle shadow-none border border-zinc"
                  src={`${import.meta.env.BASE_URL}assets/avatar.JPG`}
                  alt="Portrait"
                  imgProps={{ loading: 'eager', decoding: 'async', fetchPriority: 'high' }}
                  style={{ width: '100%', maxWidth: '320px', aspectRatio: '1/1', objectFit: 'cover' }}
                />
              </Tilt>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator" aria-hidden="true"></div>
        </section>

        <Section id="about" title={SECTIONS.about}>
          <div className="roman-card beam-border">
            <div className="roman-card-inner">
              <p className="lead mb-4">
                I'm an <strong>Undergraduate Research Assistant at AiTA Lab, FPT University</strong>,
                where I work on Computer Vision and Quantum Machine Learning research. I learn by
                building and enjoy working at the intersection of <strong>Computer Vision</strong> and{' '}
                <strong>Vision‑Language Models</strong>, exploring <strong>Quantum ML</strong> for
                vision as a long‑term research direction. I value clarity, simple baselines, and
                reproducible demos that make ideas tangible.
              </p>
              <p>
                Right now, I'm focused on practical VLM applications (retrieval, grounding,
                instruction‑tuning) and setting up strong habits for research: reading, small
                experiments, and writing. I'm open to collaborations that are lightweight, focused, and
                shipping‑oriented.
              </p>
              <div className="icon-row mt-2">
                <a
                  className="icon-btn"
                  href={social.kaggle}
                  target="_blank"
                  rel="noopener"
                  aria-label="Kaggle"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}assets/kaggle.svg`}
                    alt="Kaggle"
                    width="18"
                    height="18"
                  />
                </a>
                <a
                  className="icon-btn"
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
                <a
                  className="icon-btn"
                  href={social.github}
                  target="_blank"
                  rel="noopener"
                  aria-label="GitHub"
                >
                  <i className="bi bi-github"></i>
                </a>
                <a
                  className="icon-btn"
                  href={social.email}
                  aria-label="Email"
                >
                  <i className="bi bi-envelope"></i>
                </a>
                {hasRealScholar && (
                  <a
                    className="icon-btn"
                    href={social.scholar}
                    target="_blank"
                    rel="noopener"
                    aria-label="Google Scholar"
                  >
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
                <li className="mb-3">
                  <strong className="text-gold">Vision‑Language:</strong> multimodal retrieval, visual grounding, instruction
                  tuning, evaluation.
                </li>
                <li className="mb-3">
                  <strong className="text-gold">Applied VLMs:</strong> edge or cloud deployment with latency/throughput
                  trade‑offs.
                </li>
                <li>
                  <strong className="text-gold">Quantum for Vision:</strong> hybrid classical‑quantum training and simple QML
                  baselines.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="goals" title={SECTIONS.goals}>
          <div className="roman-card beam-border">
            <div className="roman-card-inner">
              <ul className="mb-0">
                <li className="mb-3">
                  <strong className="text-gold">2025:</strong> Complete foundational QML course, implement basic QML circuits for vision tasks.
                </li>
                <li className="mb-3">
                  Target first <strong className="text-gold">conference‑level</strong> paper (IEEE ICCE 2026) — ✅ Accepted.
                </li>
                <li>Attend CV/ML conferences and workshops, build toward graduate school applications.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="tech" title={SECTIONS.tech}>
          <div className="row g-3 row-cols-1 row-cols-md-3">
            <div className="col">
              <Tilt className="h-100">
                <div className="roman-card beam-border h-100">
                  <div className="roman-card-inner">
                    <h3 className="h6 mb-3 text-gold font-display">Core</h3>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="roman-badge-gold badge-pulse">Python</span>
                      <span className="roman-badge-gold badge-pulse">C++</span>
                    </div>
                  </div>
                </div>
              </Tilt>
            </div>
            <div className="col">
              <Tilt className="h-100">
                <div className="roman-card beam-border h-100">
                  <div className="roman-card-inner">
                    <h3 className="h6 mb-3 text-gold font-display">ML/CV</h3>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="roman-badge-gold badge-pulse">PyTorch</span>
                      <span className="roman-badge-gold badge-pulse">OpenCV</span>
                      <span className="roman-badge-gold badge-pulse">Transformers</span>
                      <span className="roman-badge-gold badge-pulse">timm</span>
                    </div>
                  </div>
                </div>
              </Tilt>
            </div>
            <div className="col">
              <Tilt className="h-100">
                <div className="roman-card beam-border h-100">
                  <div className="roman-card-inner">
                    <h3 className="h6 mb-3 text-gold font-display">Tooling</h3>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="roman-badge-gold badge-pulse">Git/GitHub</span>
                      <span className="roman-badge-gold badge-pulse">Linux</span>
                      <span className="roman-badge-gold badge-pulse">LaTeX/Overleaf</span>
                    </div>
                  </div>
                </div>
              </Tilt>
            </div>
          </div>
        </Section>

        <Section id="projects" title={SECTIONS.projects}>
          <motion.div
            className="d-flex flex-wrap align-items-center gap-2 mb-3 project-toolbar"
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
          >
            {tags.map((t) => (
              <motion.button
                key={t}
                className={`btn-roman ${tag === t ? 'btn-roman-primary' : 'btn-roman-ghost'} btn-sm`}
                onClick={() => setTag(t)}
                variants={staggerItemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t}
              </motion.button>
            ))}
            <div className="project-search-wrap ms-auto">
              <motion.input
                className="input-roman form-control-sm project-search-input"
                placeholder={t('home.projects.searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                variants={staggerItemVariants}
                whileFocus={{ scale: 1.01 }}
              />
            </div>
          </motion.div>
          <motion.div
            className="row g-3 row-cols-1 row-cols-md-2"
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
          >
            {filtered.map((p, i) => (
              <ProjectCard key={i} project={p} index={i} />
            ))}
          </motion.div>
        </Section>

        <Section id="contact" title={SECTIONS.contact}>
          <div className="d-flex flex-column gap-3">
            <div className="contact-row beam-border">
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
            <div className="contact-row beam-border">
              <i className="contact-icon bi bi-telephone"></i>
              <a href={social.phone} className="contact-link">
                {social.phoneDisplay}
              </a>
              <button
                className="btn-roman btn-roman-ghost btn-sm ms-auto"
                onClick={() => {
                  navigator.clipboard.writeText(social.phoneRaw);
                  toast('Copied phone number to clipboard');
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