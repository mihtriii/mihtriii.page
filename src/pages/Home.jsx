import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import DotFieldBackground from '../components/DotFieldBackground.jsx';
import AnimatedHeadline from '../components/AnimatedHeadline.jsx';
import Typewriter from '../components/Typewriter.jsx';
import Tilt from '../components/Tilt.jsx';
import { Link } from 'react-router-dom';
import BlurImage from '../components/BlurImage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import { toast } from '../components/Toast.jsx';
import { social, hasRealScholar } from '../config/site.js';
import { useI18n } from '../i18n/index.jsx';
import SEOHead, { useSEO } from '../components/SEOHead.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';
import {
  useScrollAnimation,
  scrollAnimationVariants,
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '../hooks/useScrollAnimation.js';

/**
 * Latin section labels for Roman Imperial aesthetic
 */
const LATIN_SECTIONS = {
  about: 'Athenaeum',
  focus: 'Studia',
  goals: 'Proposita',
  tech: 'Ars Mechanica',
  projects: 'Opera',
  contact: 'Contactus',
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
  const magneticRef = useMagnetic(0.1);
  
  return (
    <motion.div
      className="col"
      key={index}
      variants={staggerItemVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div
        ref={magneticRef}
        className="card h-100 card-hover card-elevate card-gradient-border project-card magnetic"
      >
        {project.preview && (
          <div className="project-preview">
            <img src={project.preview} alt="preview" />
          </div>
        )}
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h3 className="h6 mb-0 fw-semibold">{project.title}</h3>
            <span className="badge text-bg-primary">
              <i className="bi bi-rocket-takeoff me-1"></i>
              {t('home.projects.soon')}
            </span>
          </div>
          <p className="mb-2 text-secondary small">{project.desc}</p>
          <div className="d-flex gap-2 flex-wrap">
            {project.tags.map((t) => (
              <span key={t} className="badge text-bg-secondary">
                {t}
              </span>
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

  // SEO for homepage
  useSEO({
    title: null, // Use default title
    description:
      'AI student at FPTU HCM focusing on Computer Vision, Vision-Language Models, and Quantum ML. Personal portfolio and research blog.',
    url: '/',
    type: 'website',
  });

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
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} showSocial={false} />
      </aside>

      <div className="col-12 col-lg-9">
        {/* EPIC HERO SECTION - Greek Mythology / Frieren RPG Style */}
        <section
          className="hero-section roman-card-elevated p-4 p-md-5 mb-4 position-relative overflow-hidden"
          data-animate
        >
          <div className="row align-items-center g-4 g-md-5 position-relative z-1">
            <div className="col-12 col-md-7">
              {/* Latin Eyebrow */}
              <span className="roman-eyebrow d-block mb-3">Salve, Viator</span>
              
              {/* Main Headline with Cormorant Display */}
              <AnimatedHeadline
                text="Hi, I am Trí."
                tag="h1"
                className="font-display fw-bold mb-3"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.15 }}
                splitType="words, chars"
                delay={50}
                duration={0.65}
                ease="power3.out"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                scrollTrigger={false}
                gradient={true}
                gradientColors={['#F0E6C8', '#C9A84C', '#E8C96A']}
              />
              
              {/* Sub-headline - Epic tagline */}
              <p className="text-secondary mb-2 fw-medium" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                <strong>Undergraduate Research Assistant</strong>
                <br />
                AiTA Lab, FPT University
              </p>
              
              {/* Typewriter with Roman flair */}
              <p className="text-secondary mb-4" style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)' }}>
                <Typewriter words={['Computer Vision', 'Vision‑Language Models', 'Quantum ML', 'Sic Parvis Magna']} />
              </p>
              
              {/* Badges as Roman metric pills */}
              <div className="roman-metrics mb-4" role="list">
                <span className="roman-metric-pill" role="listitem"><i className="bi bi-eye me-1"></i><span className="roman-metric-label">Vision</span><span className="roman-metric-value">Computer Vision</span></span>
                <span className="roman-metric-pill" role="listitem"><i className="bi bi-cpu me-1"></i><span className="roman-metric-label">VLM</span><span className="roman-metric-value">VLMs</span></span>
                <span className="roman-metric-pill" role="listitem"><i className="bi bi-lightning me-1"></i><span className="roman-metric-label">QML</span><span className="roman-metric-value">Quantum ML</span></span>
              </div>
              
              {/* CTA Buttons - Roman Style */}
              <div className="d-flex flex-wrap gap-2 hero-cta">
                <Link to="/cv" className="roman-btn-cta btn-sm px-4 py-2">
                  <i className="bi bi-file-earmark-text me-1"></i> Tabula Vitae
                </Link>
                <a href="#contact" className="roman-btn btn-sm px-4 py-2">
                  <i className="bi bi-send me-1"></i> Contactus
                </a>
                <a
                  className="roman-btn-ghost btn-sm px-4 py-2"
                  href="https://github.com/mihtriii"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-github me-1"></i> Opuscula
                </a>
              </div>
            </div>
            <div className="col-12 col-md-5 text-center">
              <Tilt className="d-inline-block portrait-wrap">
                <BlurImage
                  className="portrait rounded-circle shadow-none border border-zinc"
                  src={`${import.meta.env.BASE_URL}assets/avatar.JPG`}
                  alt="Portrait"
                  imgProps={{ loading: 'eager', decoding: 'async', fetchpriority: 'high' }}
                  style={{ width: '100%', maxWidth: '320px', aspectRatio: '1/1', objectFit: 'cover' }}
                />
              </Tilt>
            </div>
          </div>
        </section>

        <Section id="about" title={LATIN_SECTIONS.about}>
          <div className="roman-card" data-animate>
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
                Right now, I’m focused on practical VLM applications (retrieval, grounding,
                instruction‑tuning) and setting up strong habits for research: reading, small
                experiments, and writing. I’m open to collaborations that are lightweight, focused, and
                shipping‑oriented.
              </p>
              <div className="icon-row mt-2" data-animate>
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

        <Section id="focus" title={LATIN_SECTIONS.focus}>
          <div className="roman-card" data-animate>
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

        <Section id="goals" title={LATIN_SECTIONS.goals}>
          <div className="roman-card" data-animate>
            <div className="roman-card-inner">
              <ul className="mb-0">
                <li className="mb-3">
                  <strong className="text-gold">Q1 2025:</strong> Complete foundational Quantum Machine Learning course and
                  implement basic QML circuits for vision tasks.
                </li>
                <li className="mb-3">
                  Target one <strong className="text-gold">A*</strong> conference‑level paper by end of sophomore year.
                </li>
                <li>Attend/participate in relevant CV/ML conferences and workshops.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="tech" title={LATIN_SECTIONS.tech}>
          <div className="row g-3 row-cols-1 row-cols-md-3">
            <div className="col">
              <Tilt className="h-100">
                <div className="roman-card h-100 card-animate">
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
                <div className="roman-card h-100 card-animate">
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
                <div className="roman-card h-100 card-animate">
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

        <Section id="projects" title={LATIN_SECTIONS.projects}>
          <motion.div
            className="d-flex flex-wrap align-items-center gap-2 mb-3 project-toolbar"
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
          >
            {tags.map((t) => (
              <motion.button
                key={t}
                className={`roman-btn ${tag === t ? 'roman-btn-cta' : 'roman-btn-ghost'} btn-sm`}
                onClick={() => setTag(t)}
                variants={staggerItemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t}
              </motion.button>
            ))}
            <div className="project-search-wrap ms-auto">
              <motion.input
                className="roman-input form-control-sm project-search-input"
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

        <Section id="contact" title={LATIN_SECTIONS.contact}>
          <div className="d-flex flex-column gap-3">
            <div className="contact-row">
              <i className="contact-icon bi bi-envelope"></i>
              <a href={social.email} className="contact-link">
                mihtriii295@gmail.com
              </a>
              <button
                className="roman-btn-ghost btn-sm ms-auto"
                onClick={() => {
                  navigator.clipboard.writeText('mihtriii295@gmail.com');
                  toast(t('common.copied'));
                }}
              >
                <i className="bi bi-clipboard me-1"></i> {t('common.copy')}
              </button>
            </div>
            <div className="contact-row">
              <i className="contact-icon bi bi-telephone"></i>
              <a href={social.phone} className="contact-link">
                {social.phoneDisplay}
              </a>
              <button
                className="roman-btn-ghost btn-sm ms-auto"
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
