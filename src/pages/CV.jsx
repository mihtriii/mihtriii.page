import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { toast } from '../components/Toast.jsx';
import { useI18n } from '../i18n/index.jsx';

function Section({ id, title, children }) {
  return (
    <section id={id} className="section mb-4" data-animate>
      <h2 className="h4">{title}</h2>
      {children}
    </section>
  );
}

function SkillMeter({ label, level = 0 }) {
  const clamped = Math.max(0, Math.min(100, level));
  return (
    <div className="skill-meter" data-animate>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="small fw-semibold">{label}</span>
        <span className="small text-secondary">{clamped}%</span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ '--w': `${clamped}%` }} />
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
  ];
  return (
    <div className="row g-4">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} />
      </aside>
      <div className="col-12 col-lg-9">
        <section
          className="page-hero hero-with-bg cv-hero p-4 mb-3 position-relative overflow-hidden"
          data-animate
        >
          <div className="d-flex flex-column gap-2">
            <h1 className="h3 mb-0">
              <span className="gradient-text">{t('cv.title')}</span>
            </h1>
            <p className="text-secondary mb-2">{t('cv.subtitle')}</p>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge badge-glow">{t('cv.research.computerVision')}</span>
              <span className="badge badge-glow">{t('cv.research.vlm')}</span>
              <span className="badge badge-glow">{t('cv.research.quantumML')}</span>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-1">
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                <i className="bi bi-download"></i> {t('cv.downloadPrint')}
              </button>
              <a className="btn btn-outline-secondary btn-sm" href="mailto:mihtriii295@gmail.com">
                <i className="bi bi-envelope"></i> Email
              </a>
              <a className="btn btn-outline-secondary btn-sm" href="tel:+84858276537">
                <i className="bi bi-telephone"></i> Phone
              </a>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  navigator.clipboard.writeText('mihtriii295@gmail.com | +84 858 276 537');
                  toast('Copied contact info');
                }}
              >
                <i className="bi bi-clipboard"></i> Copy Contact
              </button>
              <a
                className="btn btn-outline-secondary btn-sm"
                href="https://github.com/mihtriii"
                target="_blank"
                rel="noopener"
              >
                <i className="bi bi-github"></i> GitHub
              </a>
            </div>
          </div>
        </section>

        <Section id="summary" title={t('cv.sections.summary')}>
          <div className="card card-hover card-elevate" data-animate>
            <div className="card-body p-4">
              <p className="lead mb-4">
                Undergraduate Research Assistant at AiTA Lab with strong foundation in{' '}
                <strong>Computer Vision</strong> and <strong>Quantum Machine Learning</strong>.
                Passionate about advancing AI through research in Vision-Language Models and Quantum
                Machine Learning.
              </p>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-primary bg-opacity-10 rounded">
                      <i className="bi bi-bullseye text-primary fs-5"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="h6 mb-2 fw-bold">Research Focus</h3>
                      <p className="small text-secondary mb-0">
                        Vision-Language Models, Multimodal AI, Quantum Computing for CV
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-warning bg-opacity-10 rounded">
                      <i className="bi bi-trophy text-warning fs-5"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="h6 mb-2 fw-bold">Key Achievements</h3>
                      <p className="small text-secondary mb-0">
                        Samsung SFT 3rd Prize, VOI Honorable Mention, AIoT Hackathon Award
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="career-objectives" title={t('cv.sections.careerObjectives')}>
          <div className="row g-3" data-animate>
            <div className="col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-primary bg-opacity-10 rounded">
                      <i className="bi bi-mortarboard-fill fs-4 text-primary"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="h6 mb-2 fw-bold">PhD in Artificial Intelligence</h3>
                      <p className="text-secondary small mb-0">{t('cv.careerObjectives.phd')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="p-2 bg-success bg-opacity-10 rounded">
                      <i className="bi bi-briefcase-fill fs-4 text-success"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="h6 mb-2 fw-bold">AI Engineer</h3>
                      <p className="text-secondary small mb-3">
                        {t('cv.careerObjectives.engineer')}
                      </p>
                      <div className="d-flex flex-wrap gap-1">
                        <span className="badge text-bg-secondary">Computer Vision</span>
                        <span className="badge text-bg-secondary">Time Series</span>
                        <span className="badge text-bg-secondary">Deep Learning</span>
                        <span className="badge text-bg-secondary">MLOps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="education" title={t('cv.sections.education')}>
          <div className="card card-hover card-elevate" data-animate>
            <div className="card-body p-4">
              <div className="row align-items-start mb-4">
                <div className="col-md-8">
                  <h3 className="h5 mb-2 fw-bold">{t('cv.education.university')}</h3>
                  <p className="mb-2 text-primary fw-semibold">{t('cv.education.degree')}</p>
                  <p className="text-secondary small mb-0">
                    <i className="bi bi-calendar3 me-1"></i> {t('cv.education.timeline')} ·{' '}
                    {t('cv.education.year')}
                  </p>
                </div>
              </div>
              <div className="border-top pt-4">
                <h4 className="h6 fw-bold mb-3">
                  <i className="bi bi-journal-code me-2"></i>
                  {t('cv.education.courseworkTitle')}
                </h4>
                <div className="row g-2">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span className="small">{t('cv.education.coursework1')}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span className="small">{t('cv.education.coursework2')}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span className="small">{t('cv.education.coursework3')}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span className="small">{t('cv.education.coursework4')}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span className="small">{t('cv.education.coursework5')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="experience" title={t('cv.sections.experience')}>
          <div className="card card-hover card-elevate" data-animate>
            <div className="card-body p-4">
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 bg-info bg-opacity-10 rounded">
                  <i className="bi bi-briefcase text-info fs-5"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h3 className="h6 fw-bold mb-1">{t('cv.experience.currentRole')}</h3>
                      <p className="text-primary small mb-0">{t('cv.experience.currentOrg')}</p>
                    </div>
                    <span className="badge text-bg-secondary">
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
        </Section>

        <Section id="research-interests" title={t('cv.sections.researchInterests')}>
          <div className="card card-hover card-elevate" data-animate>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-eye text-primary"></i>
                    <div>
                      <h3 className="h6 fw-bold mb-1">Vision-Language Models</h3>
                      <p className="small text-secondary mb-0">
                        Multimodal retrieval, visual grounding, instruction tuning
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-cpu text-success"></i>
                    <div>
                      <h3 className="h6 fw-bold mb-1">Applied VLMs</h3>
                      <p className="small text-secondary mb-0">
                        Edge/cloud deployment with performance optimizations
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-lightning text-warning"></i>
                    <div>
                      <h3 className="h6 fw-bold mb-1">Quantum ML</h3>
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

        <Section id="competitions-activities" title={t('cv.sections.competitionsActivities')}>
          <div className="row g-3" data-animate>
            <div className="col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-trophy-fill text-warning fs-5"></i>
                    <div className="flex-grow-1">
                      <h3 className="h6 mb-1">{t('cv.competitions.samsung')}</h3>
                      <p className="small text-secondary mb-2">
                        <strong>{t('cv.competitions.samsungAward')}</strong>
                      </p>
                      <p className="small mb-0">
                        {t('cv.competitions.samsungTeam')}: T-Gardens{' '}
                        <a
                          href="https://solvefortomorrow.vn/doi-thang-giai/t-gardens"
                          target="_blank"
                          rel="noopener"
                          className="text-decoration-none"
                        >
                          <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-award-fill text-primary fs-5"></i>
                    <div>
                      <h3 className="h6 mb-1">{t('cv.competitions.aiot')}</h3>
                      <p className="small text-secondary mb-0">
                        <strong>{t('cv.competitions.aiotAward')}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-mortarboard-fill text-success fs-5"></i>
                    <div>
                      <h3 className="h6 mb-1">{t('cv.competitions.voi')}</h3>
                      <p className="small text-secondary mb-0">
                        <strong>{t('cv.competitions.voiAward')}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-people-fill text-info fs-5"></i>
                    <div>
                      <h3 className="h6 mb-1">Leadership</h3>
                      <p className="small text-secondary mb-0">
                        <strong>{t('cv.competitions.community')}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="skills" title={t('cv.sections.skills')}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <h3 className="h6 mb-3">
                    <i className="bi bi-code-slash"></i> {t('cv.skills.programming')}
                  </h3>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-primary">Python</span>
                    <span className="badge text-bg-primary">C++</span>
                    <span className="badge text-bg-secondary">JavaScript</span>
                    <span className="badge text-bg-secondary">SQL</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <h3 className="h6 mb-3">
                    <i className="bi bi-robot"></i> {t('cv.skills.frameworks')}
                  </h3>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <span className="badge text-bg-primary">{t('cv.skills.pytorch')}</span>
                    <span className="badge text-bg-primary">{t('cv.skills.cv')}</span>
                    <span className="badge text-bg-primary">{t('cv.skills.nlp')}</span>
                    <span className="badge text-bg-secondary">{t('cv.skills.quantum')}</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-secondary">NumPy</span>
                    <span className="badge text-bg-secondary">Pandas</span>
                    <span className="badge text-bg-secondary">scikit-learn</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <h3 className="h6 mb-3">
                    <i className="bi bi-tools"></i> {t('cv.skills.tools')}
                  </h3>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-info">{t('cv.skills.git')}</span>
                    <span className="badge text-bg-info">{t('cv.skills.cloud')}</span>
                    <span className="badge text-bg-info">{t('cv.skills.latex')}</span>
                    <span className="badge text-bg-secondary">Linux/Unix</span>
                    <span className="badge text-bg-secondary">Jupyter</span>
                    <span className="badge text-bg-secondary">VS Code</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <h3 className="h6 mb-3">
                    <i className="bi bi-graph-up"></i> Data Visualization
                  </h3>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-success">{t('cv.skills.dataViz')}</span>
                    <span className="badge text-bg-secondary">TensorBoard</span>
                    <span className="badge text-bg-secondary">Weights & Biases</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="research-interests" title={t('cv.sections.researchInterests')}>
          <div className="card card-hover card-elevate" data-animate>
            <div className="card-body">
              <ul className="mb-0">
                <li>
                  <strong>Vision-Language Models</strong>: Multimodal retrieval, visual grounding,
                  instruction tuning, and evaluation methodologies
                </li>
                <li>
                  <strong>Applied VLMs</strong>: Deployment strategies for edge/cloud environments
                  with latency and throughput optimizations
                </li>
                <li>
                  <strong>Quantum Machine Learning</strong>: Hybrid classical-quantum architectures
                  for computer vision tasks
                </li>
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
