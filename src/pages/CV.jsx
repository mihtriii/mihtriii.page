import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import { toast } from '../components/Toast.jsx';
import { useI18n } from '../i18n/index.jsx';

/**
 * English section labels
 */
const CV_SECTIONS = {
  summary: 'Summary',
  'career-objectives': 'Career Objectives',
  education: 'Education',
  experience: 'Experience',
  'research-interests': 'Research Interests',
  'competitions-activities': 'Honors & Awards',
  skills: 'Skills',
  publications: 'Publications',
  languages: 'Languages',
};

function Section({ id, title, children }) {
  return (
    <section id={id} className="section mb-4 reveal-stagger" data-animate>
      <h2 className="h4 mb-3 font-display">{title}</h2>
      {children}
    </section>
  );
}

function SkillMeter({ label, level = 0 }) {
  const clamped = Math.max(0, Math.min(100, level));
  return (
    <div className="skill-meter" data-animate>
      <div className="skill-meter-header">
        <span className="skill-meter-label">{label}</span>
        <span className="skill-meter-value">{clamped}%</span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ '--w': `${clamped}%` }} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, className = '' }) {
  return (
    <div className={`col-md-6 ${className}`}>
      <div className="d-flex align-items-start gap-3">
        <div className="p-2 bg-gold bg-opacity-10 rounded-circle">
          <i className={`bi ${icon} fs-5 text-gold`}></i>
        </div>
        <div className="flex-grow-1">
          <h3 className="h6 mb-1 fw-bold font-display">{label}</h3>
          <p className="small text-secondary mb-0">{value}</p>
          {subtitle && <p className="small text-muted mb-0">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function CourseworkItem({ icon, text }) {
  return (
    <div className="col-md-6">
      <div className="d-flex align-items-center gap-2 mb-2">
        <i className={`bi ${icon} text-olive`}></i>
        <span className="small">{text}</span>
      </div>
    </div>
  );
}

function CompetitionCard({ icon, title, award, date, link, linkLabel }) {
  return (
    <div className="col-md-6">
      <div className="roman-card beam-border h-100 card-animate">
        <div className="roman-card-inner reveal-stagger">
          <div className="d-flex align-items-start gap-2 mb-2">
            <i className={`bi ${icon} text-gold fs-5`}></i>
            <div className="flex-grow-1">
              <h3 className="h6 mb-1 font-display">{title}</h3>
              <p className="small text-secondary mb-1">
                <strong>{award}</strong>
              </p>
              <p className="small text-muted mb-0">{date}</p>
            </div>
          </div>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillCategoryCard({ icon, title, children }) {
  return (
    <div className="col-12 col-md-6">
      <div className="roman-card beam-border h-100 card-animate">
        <div className="roman-card-inner reveal-stagger">
          <h3 className="h6 mb-3 font-display">
            <i className={`bi ${icon} text-gold me-2`}></i>
            {title}
          </h3>
          <div className="d-flex flex-wrap gap-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function CV() {
  const { t } = useI18n();
  const sectionIds = [
    'summary',
    'career-objectives',
    'education',
    'experience',
    'research-interests',
    'competitions-activities',
    'skills',
    'publications',
    'languages',
  ];

  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} />
      </aside>
      <div className="col-12 col-lg-9">
        {/* CV Hero Section */}
        <section
          className="hero-section roman-card-elevated p-4 p-md-5 mb-4 position-relative overflow-hidden spotlight floating-orbs"
          data-animate
          style={{ '--mouse-x': '50%', '--mouse-y': '50%' }}
        >
          {/* Hero Ambient Background */}
          <div className="hero-ambient" aria-hidden="true" />
          
          {/* Glitter Particle Layer */}
          <div className="glitter-layer" aria-hidden="true" />
          
          <div className="d-flex flex-column gap-3 position-relative z-1">
            <span className="roman-eyebrow reveal">Curriculum Vitae</span>
            <h1 className="font-display fw-bold mb-2 text-gradient-animate reveal" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
              <span>Nguyễn Minh Trí</span>
            </h1>
            <p className="text-secondary mb-2 reveal" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
              Undergraduate Research Assistant · AiTA Lab, FPT University HCMC
            </p>
            <div className="roman-metrics mb-3 reveal" role="list">
              <span className="roman-metric-pill" role="listitem"><i className="bi bi-eye me-1"></i><span className="roman-metric-label">Focus</span><span className="roman-metric-value">Computer Vision</span></span>
              <span className="roman-metric-pill" role="listitem"><i className="bi bi-cpu me-1"></i><span className="roman-metric-label">VLM</span><span className="roman-metric-value">VLMs</span></span>
              <span className="roman-metric-pill" role="listitem"><i className="bi bi-lightning me-1"></i><span className="roman-metric-label">QML</span><span className="roman-metric-value">Quantum ML</span></span>
            </div>
            <div className="d-flex flex-wrap gap-2 reveal">
              <button className="btn-roman btn-roman-primary btn-sm px-4 py-2" onClick={() => window.print()}>
                <i className="bi bi-printer me-1"></i> Download / Print
              </button>
              <a className="btn-roman btn-roman-secondary btn-sm px-4 py-2" href="mailto:mihtriii295@gmail.com">
                <i className="bi bi-envelope me-1"></i> Email
              </a>
              <a className="btn-roman btn-roman-secondary btn-sm px-4 py-2" href="tel:+848****6537">
                <i className="bi bi-telephone me-1"></i> Phone
              </a>
              <button
                className="btn-roman btn-roman-ghost btn-sm px-4 py-2"
                onClick={() => {
                  navigator.clipboard.writeText('mihtriii295@gmail.com | +84 858 276 537');
                  toast('Copied contact info');
                }}
              >
                <i className="bi bi-clipboard me-1"></i> Copy
              </button>
              <a
                className="btn-roman btn-roman-ghost btn-sm px-4 py-2"
                href="https://github.com/mihtriii"
                target="_blank"
                rel="noopener"
              >
                <i className="bi bi-github me-1"></i> GitHub
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator" aria-hidden="true">
            <span>Scroll</span>
          </div>
        </section>

        <Section id="summary" title={CV_SECTIONS.summary}>
          <div className="roman-card beam-border" data-animate>
            <div className="roman-card-inner reveal-stagger">
              <p className="lead mb-4">
                Undergraduate Research Assistant at AiTA Lab with strong foundation in{' '}
                <strong>Computer Vision</strong> and <strong>Quantum Machine Learning</strong>.
                Passionate about advancing AI through research in Vision-Language Models and Quantum
                Machine Learning.
              </p>
              <div className="row g-4">
                <StatCard
                  icon="bi-bullseye"
                  label="Research Focus"
                  value="Vision-Language Models, Multimodal AI, Quantum Computing for CV"
                />
                <StatCard
                  icon="bi-trophy"
                  label="Key Achievements"
                  value="Samsung SFT 3rd Prize, VOI Honorable Mention, AIoT Hackathon Award"
                />
              </div>
            </div>
          </div>
        </Section>

        <Section id="career-objectives" title={CV_SECTIONS['career-objectives']}>
          <div className="row g-3" data-animate>
            <div className="col-md-6">
              <div className="roman-card beam-border h-100 card-animate">
                <div className="roman-card-inner reveal-stagger">
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-gold bg-opacity-10 rounded-circle">
                      <i className="bi bi-mortarboard-fill fs-4 text-gold"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="h6 mb-2 fw-bold font-display">PhD in Artificial Intelligence</h3>
                      <p className="text-secondary small mb-0">{t('cv.careerObjectives.phd')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="roman-card beam-border h-100 card-animate">
                <div className="roman-card-inner reveal-stagger">
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-olive bg-opacity-10 rounded-circle">
                      <i className="bi bi-briefcase-fill fs-4 text-olive"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="h6 mb-2 fw-bold font-display">AI Engineer</h3>
                      <p className="text-secondary small mb-3">
                        {t('cv.careerObjectives.engineer')}
                      </p>
                      <div className="d-flex flex-wrap gap-1">
                        <span className="roman-badge-gold">Computer Vision</span>
                        <span className="roman-badge-gold">Time Series</span>
                        <span className="roman-badge-gold">Deep Learning</span>
                        <span className="roman-badge-gold">MLOps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <SectionDivider variant="dots" />

        <Section id="education" title={CV_SECTIONS.education}>
          <div className="roman-card beam-border" data-animate>
            <div className="roman-card-inner reveal-stagger">
              <div className="row align-items-start mb-4">
                <div className="col-md-8">
                  <h3 className="h5 mb-2 fw-bold font-display">{t('cv.education.university')}</h3>
                  <p className="mb-2 text-gold fw-semibold">{t('cv.education.degree')}</p>
                  <p className="text-secondary small mb-0">
                    <i className="bi bi-calendar3 me-1"></i> {t('cv.education.timeline')} ·{' '}
                    {t('cv.education.year')}
                  </p>
                </div>
              </div>
              <div className="border-top border-zinc pt-4">
                <h4 className="h6 fw-bold mb-3 font-display">
                  <i className="bi bi-journal-code me-2"></i>
                  {t('cv.education.courseworkTitle')}
                </h4>
                <div className="row g-2">
                  <CourseworkItem icon="bi-check-circle-fill" text={t('cv.education.coursework1')} />
                  <CourseworkItem icon="bi-check-circle-fill" text={t('cv.education.coursework2')} />
                  <CourseworkItem icon="bi-check-circle-fill" text={t('cv.education.coursework3')} />
                  <CourseworkItem icon="bi-check-circle-fill" text={t('cv.education.coursework4')} />
                  <CourseworkItem icon="bi-check-circle-fill" text={t('cv.education.coursework5')} />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <SectionDivider variant="wave" />

        <Section id="experience" title={CV_SECTIONS.experience}>
          <div className="roman-card beam-border" data-animate>
            <div className="roman-card-inner reveal-stagger">
              {/* Visual Timeline */}
              <div className="experience-timeline">
                <div className="timeline-item">
                  <div className="timeline-marker">
                    <div className="timeline-dot"></div>
                    <div className="timeline-pulse"></div>
                  </div>
                  <div className="timeline-content">
                    <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                      <div>
                        <h3 className="h6 fw-bold mb-1 font-display">{t('cv.experience.currentRole')}</h3>
                        <p className="text-gold small mb-0">{t('cv.experience.currentOrg')}</p>
                      </div>
                      <span className="roman-badge-olive">
                        <i className="bi bi-calendar3 me-1"></i>
                        {t('cv.experience.currentTimeline')}
                      </span>
                    </div>
                    <ul className="mt-3 mb-0 small">
                      <li className="mb-2">{t('cv.experience.currentDesc1')}</li>
                      <li className="mb-2">{t('cv.experience.currentDesc2')}</li>
                      <li>{t('cv.experience.currentDesc3')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="research-interests" title={CV_SECTIONS['research-interests']}>
          <div className="roman-card beam-border" data-animate>
            <div className="roman-card-inner reveal-stagger">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-eye text-gold"></i>
                    <div>
                      <h3 className="h6 fw-bold mb-1 font-display">Vision-Language Models</h3>
                      <p className="small text-secondary mb-0">
                        Multimodal retrieval, visual grounding, instruction tuning
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-cpu text-olive"></i>
                    <div>
                      <h3 className="h6 fw-bold mb-1 font-display">Applied VLMs</h3>
                      <p className="small text-secondary mb-0">
                        Edge/cloud deployment with performance optimizations
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-lightning text-amber"></i>
                    <div>
                      <h3 className="h6 fw-bold mb-1 font-display">Quantum ML</h3>
                      <p className="small text-secondary mb-0">
                        Hybrid classical-quantum architectures for vision
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="competitions-activities" title={CV_SECTIONS['competitions-activities']}>
          <div className="row g-3" data-animate>
            <CompetitionCard
              icon="bi-trophy-fill"
              title={t('cv.competitions.samsung')}
              award={t('cv.competitions.samsungAward')}
              date="2024"
              link="https://solvefortomorrow.vn/doi-thang-giai/t-gardens"
              linkLabel="Competition showcase"
            />
            <CompetitionCard
              icon="bi-award-fill"
              title={t('cv.competitions.aiot')}
              award={t('cv.competitions.aiotAward')}
              date="2025"
            />
            <CompetitionCard
              icon="bi-mortarboard-fill"
              title={t('cv.competitions.voi')}
              award={t('cv.competitions.voiAward')}
              date="2024"
              link="https://voi.edu.vn/"
            />
            <CompetitionCard
              icon="bi-people-fill"
              title="Leadership"
              award="Vice President, FARPC Programming Club"
              date="2025 - 2026"
              link="https://www.facebook.com/FARPC.HCM/"
            />
          </div>
        </Section>

        <Section id="skills" title={CV_SECTIONS.skills}>
          {/* Skills with Progress Visualization */}
          <div className="roman-card beam-border mb-3" data-animate>
            <div className="roman-card-inner reveal-stagger">
              <h3 className="h6 mb-3 font-display">
                <i className="bi bi-star-fill text-gold me-2"></i>
                Core Proficiencies
              </h3>
              <div className="row g-4">
                <div className="col-md-6">
                  <SkillMeter label="Python" level={90} />
                </div>
                <div className="col-md-6">
                  <SkillMeter label="PyTorch" level={85} />
                </div>
                <div className="col-md-6">
                  <SkillMeter label="Computer Vision" level={80} />
                </div>
                <div className="col-md-6">
                  <SkillMeter label="C++" level={75} />
                </div>
                <div className="col-md-6">
                  <SkillMeter label="Machine Learning" level={85} />
                </div>
                <div className="col-md-6">
                  <SkillMeter label="Git/GitHub" level={88} />
                </div>
              </div>
            </div>
          </div>

          {/* Existing skills cards */}
          <div className="row g-3">
            <SkillCategoryCard icon="bi-code-slash" title="Programming">
              <span className="roman-badge-gold">Python</span>
              <span className="roman-badge-gold">C++</span>
              <span className="roman-badge-gold">JavaScript</span>
              <span className="roman-badge-gold">SQL</span>
            </SkillCategoryCard>

            <SkillCategoryCard icon="bi-robot" title="Frameworks">
              <span className="roman-badge-gold">PyTorch</span>
              <span className="roman-badge-gold">TensorFlow</span>
              <span className="roman-badge-gold">OpenCV</span>
              <span className="roman-badge-gold">scikit-image</span>
              <span className="roman-badge-gold">timm</span>
              <span className="roman-badge-gold">Qiskit</span>
              <span className="roman-badge-gold">PennyLane</span>
            </SkillCategoryCard>

            <SkillCategoryCard icon="bi-tools" title="Tools">
              <span className="roman-badge-gold">Git/GitHub</span>
              <span className="roman-badge-gold">Linux</span>
              <span className="roman-badge-gold">LaTeX/Overleaf</span>
              <span className="roman-badge-gold">Docker</span>
              <span className="roman-badge-gold">Jupyter</span>
              <span className="roman-badge-gold">VS Code</span>
            </SkillCategoryCard>

            <SkillCategoryCard icon="bi-graph-up" title="Data Visualization">
              <span className="roman-badge-gold">Matplotlib</span>
              <span className="roman-badge-gold">Seaborn</span>
              <span className="roman-badge-gold">Plotly</span>
              <span className="roman-badge-gold">TensorBoard</span>
              <span className="roman-badge-gold">Weights & Biases</span>
            </SkillCategoryCard>
          </div>
        </Section>

        <Section id="publications" title={CV_SECTIONS.publications}>
          <div className="roman-card beam-border" data-animate>
            <div className="roman-card-inner reveal-stagger">
              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="p-2 bg-gold bg-opacity-10 rounded-circle">
                  <i className="bi bi-journal-richtext fs-5 text-gold"></i>
                </div>
                <div className="flex-grow-1">
                  <h3 className="h6 mb-1 fw-bold font-display">Hybrid Quantum Federated Learning for Brain Tumor MRI Analysis</h3>
                  <p className="small text-secondary mb-1">
                    Quang Nhan Hoang, Minh Tri Nguyen, Duc Ngoc Minh Dang
                  </p>
                  <p className="small text-secondary mb-1">
                    11th IEEE International Conference on Communications and Electronics (ICCE 2026)
                  </p>
                  <span className="roman-badge-olive">Accepted · 2026 · Co-author</span>
                </div>
              </div>
              <p className="small text-secondary mb-3">
                This paper presents a hybrid quantum federated learning framework for brain tumor MRI analysis, combining quantum neural networks with classical federated learning to preserve data privacy while leveraging quantum computational advantages for medical imaging tasks.
              </p>
              <a
                href="https://daihoc.fpt.edu.vn/hcm/aita-lab-tiep-tuc-ghi-dau-an-quoc-te-voi-02-bai-bao-tai-ieee-icce-2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-roman btn-roman-secondary btn-sm"
              >
                <i className="bi bi-newspaper me-1"></i> News Article
              </a>
            </div>
          </div>
        </Section>

        <Section id="languages" title={CV_SECTIONS.languages}>
          <div className="roman-card beam-border" data-animate>
            <div className="roman-card-inner reveal-stagger">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-translate fs-4 text-gold"></i>
                    <div>
                      <h3 className="h6 mb-1 fw-bold font-display">Vietnamese</h3>
                      <p className="small text-secondary mb-0">Native</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-translate fs-4 text-gold"></i>
                    <div>
                      <h3 className="h6 mb-1 fw-bold font-display">English</h3>
                      <p className="small text-secondary mb-0">IELTS 7.0</p>
                    </div>
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