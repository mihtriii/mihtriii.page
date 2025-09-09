import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Particles from '../components/Particles.jsx';
import Typewriter from '../components/Typewriter.jsx';
import Tilt from '../components/Tilt.jsx';
import { Link } from 'react-router-dom';
import BlurImage from '../components/BlurImage.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { toast } from '../components/Toast.jsx';
import { social } from '../config/site.js';
import { useI18n } from '../i18n/index.jsx';

function Section({ id, title, children }) {
  return (
    <section id={id} className="section mb-4" data-animate>
      <h2 className="h4 mb-3">{title}</h2>
      {children}
    </section>
  );
}

export default function Home() {
  const { t } = useI18n();
  const sectionIds = ['about', 'focus', 'goals', 'tech', 'projects', 'contact'];

  const allProjects = useMemo(() => ([
    { title: 'Mini‑VLM Playground', desc: 'Retrieval/grounding demos with small benchmarks', tags: ['VLM', 'Retrieval'], preview: null },
    { title: 'QML for Vision', desc: 'Hybrid quantum‑classical baselines on MNIST/CIFAR', tags: ['QML', 'Vision'], preview: null },
    { title: 'Edge‑friendly CV', desc: 'Distilled/quantized models for edge inference', tags: ['Edge', 'CV'], preview: null },
  ]), []);
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('All');
  const tags = ['All', 'VLM', 'Retrieval', 'QML', 'Vision', 'Edge', 'CV'];
  const filtered = allProjects.filter(p => (
    (tag === 'All' || p.tags.includes(tag)) &&
    (query.trim() === '' || p.title.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase()))
  ));

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} showSocial={false} />
      </aside>

      <div className="col-12 col-lg-9">
        <section className="page-hero hero-with-bg p-4 mb-3 position-relative overflow-hidden" data-animate>
          <Particles />
          <div className="row align-items-center g-4 position-relative">
            <div className="col-12 col-md-7">
              <h1 className="h3 mb-2"><span className="gradient-text">{t('home.heroHi')}</span></h1>
              <p className="text-secondary mb-3">
                AI @ FPTU HCM —
                <Typewriter words={[
                  'Computer Vision',
                  'Vision‑Language Models',
                  'Quantum ML'
                ]} />
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge badge-glow">Computer Vision</span>
                <span className="badge badge-glow">VLMs</span>
                <span className="badge badge-glow">Quantum ML</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <a href="#contact" className="btn btn-primary btn-sm">{t('home.buttons.contact')}</a>
                <Link to="/cv" className="btn btn-outline-secondary btn-sm">{t('home.buttons.viewCV')}</Link>
                <a className="btn btn-outline-secondary btn-sm" href="https://github.com/mihtriii" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
            <div className="col-12 col-md-5 text-center">
              <Tilt className="d-inline-block portrait-wrap">
                <BlurImage className="portrait rounded shadow-sm" src={`${import.meta.env.BASE_URL}assets/avatar.JPG`} alt="Portrait" imgProps={{loading:'eager', decoding:'async', fetchpriority:'high'}} />
              </Tilt>
            </div>
          </div>
        </section>

        <Section id="about" title={t('home.sections.about')}>
          <p>I’m an AI student who learns by building. I enjoy working at the intersection of <strong>Computer Vision</strong> and <strong>Vision‑Language Models</strong>, and I’m exploring <strong>Quantum ML</strong> for vision as a long‑term research direction. I value clarity, simple baselines, and reproducible demos that make ideas tangible.</p>
          <p>Right now, I’m focused on practical VLM applications (retrieval, grounding, instruction‑tuning) and setting up strong habits for research: reading, small experiments, and writing. I’m open to collaborations that are lightweight, focused, and shipping‑oriented.</p>
          <div className="icon-row mt-2" data-animate>
            <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.kaggle} target="_blank" rel="noopener" aria-label="Kaggle">
              <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="18" height="18" />
            </a>
            <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
            <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.github} target="_blank" rel="noopener" aria-label="GitHub">
              <i className="bi bi-github"></i>
            </a>
            <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.email} aria-label="Email">
              <i className="bi bi-envelope"></i>
            </a>
            <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.scholar} target="_blank" rel="noopener" aria-label="Google Scholar">
              <i className="bi bi-mortarboard"></i>
            </a>
          </div>
        </Section>

        <Section id="focus" title="Research Focus">
          <ul className="mb-0">
            <li><strong>Vision‑Language</strong>: multimodal retrieval, visual grounding, instruction tuning, evaluation.</li>
            <li><strong>Applied VLMs</strong>: edge or cloud deployment with latency/throughput trade‑offs.</li>
            <li><strong>Quantum for Vision</strong>: hybrid classical‑quantum training and simple QML baselines.</li>
          </ul>
        </Section>

        <Section id="goals" title="Near‑term Goals (2024–2026)">
          <ul className="mb-0">
            <li>Target one <strong>A*</strong> conference‑level paper by end of sophomore year.</li>
            <li>Attend/participate in relevant CV/ML conferences and workshops.</li>
          </ul>
        </Section>

        <Section id="tech" title="Technologies">
          <div className="row g-3 row-cols-1 row-cols-md-3">
            <div className="col">
              <Tilt className="h-100">
              <div className="card card-hover card-elevate h-100 card-animate">
                <div className="card-body">
                  <h3 className="h6 mb-2">Core</h3>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-secondary badge-pulse">Python</span>
                    <span className="badge text-bg-secondary badge-pulse">C++</span>
                  </div>
                </div>
              </div>
              </Tilt>
            </div>
            <div className="col">
              <Tilt className="h-100">
              <div className="card card-hover card-elevate h-100 card-animate">
                <div className="card-body">
                  <h3 className="h6 mb-2">ML/CV</h3>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-secondary badge-pulse">PyTorch</span>
                    <span className="badge text-bg-secondary badge-pulse">OpenCV</span>
                    <span className="badge text-bg-secondary badge-pulse">Transformers</span>
                    <span className="badge text-bg-secondary badge-pulse">timm</span>
                  </div>
                </div>
              </div>
              </Tilt>
            </div>
            <div className="col">
              <Tilt className="h-100">
              <div className="card card-hover card-elevate h-100 card-animate">
                <div className="card-body">
                  <h3 className="h6 mb-2">Tooling</h3>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-secondary badge-pulse">Git/GitHub</span>
                    <span className="badge text-bg-secondary badge-pulse">Linux</span>
                    <span className="badge text-bg-secondary badge-pulse">LaTeX/Overleaf</span>
                  </div>
                </div>
              </div>
              </Tilt>
            </div>
          </div>
        </Section>

        <Section id="projects" title={t('home.sections.projects')}>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {tags.map((t) => (
              <button key={t} className={`btn btn-sm ${tag === t ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTag(t)}>{t}</button>
            ))}
            <div className="ms-auto"></div>
            <input className="form-control form-control-sm" style={{ maxWidth: 220 }} placeholder={t('home.projects.searchPlaceholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <motion.div className="row g-3 row-cols-1 row-cols-md-2"
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } } }}
          >
            {filtered.map((p, i) => (
              <motion.div className="col" key={i} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}>
                <Tilt>
                  <div className="card h-100 card-hover card-elevate project-card card-animate">
                    {p.preview && (
                      <div className="project-preview"><img src={p.preview} alt="preview" /></div>
                    )}
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="h6 mb-0">{p.title}</h3>
                        <span className="badge text-bg-primary">{t('home.projects.soon')}</span>
                      </div>
                      <p className="mb-2 text-secondary small">{p.desc}</p>
                      <div className="d-flex gap-2 flex-wrap">
                        {p.tags.map((t) => (
                          <span key={t} className="badge text-bg-secondary">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section id="contact" title={t('home.sections.contact')}>
          <div className="d-flex align-items-center gap-2">
            <a href="mailto:mihtriii295@gmail.com">mihtriii295@gmail.com</a>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => {
              navigator.clipboard.writeText('mihtriii295@gmail.com');
              toast(t('common.copied'));
            }}>
              {t('common.copy')}
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
