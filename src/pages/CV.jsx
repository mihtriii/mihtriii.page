import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import SectionDivider from '../components/SectionDivider.jsx';
import { toast } from '../components/Toast.jsx';
import { useI18n } from '../i18n/index.jsx';

const CV_SECTIONS = {
  summary: 'Professional Summary',
  'career-objectives': 'Career Objectives',
  education: 'Education',
  experience: 'Research Experience',
  publications: 'Publications & Research',
  'competitions-activities': 'Honors & Awards',
  skills: 'Technical Skills',
  languages: 'Languages',
};

function Section({ id, title, children }) {
  return (
    <section id={id} className="section mb-5" data-animate>
      <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-zinc">
        <h2 className="h4 mb-0 font-display fw-bold text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="col-12 col-md-6">
      <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-card border border-zinc">
        <div className="p-2 bg-gold bg-opacity-10 rounded-circle text-gold fs-5">
          <i className={`bi ${icon}`}></i>
        </div>
        <div className="flex-grow-1">
          <h3 className="h6 mb-1 fw-bold font-display">{label}</h3>
          <p className="small text-secondary mb-0">{value}</p>
        </div>
      </div>
    </div>
  );
}

function CourseworkItem({ icon, text }) {
  return (
    <div className="col-12 col-sm-6">
      <div className="d-flex align-items-center gap-2 py-1">
        <i className={`bi ${icon} text-gold`} style={{ fontSize: '0.85rem' }}></i>
        <span className="small text-secondary">{text}</span>
      </div>
    </div>
  );
}

function CompetitionCard({ icon, title, award, date, link }) {
  return (
    <div className="col-12 col-md-6">
      <div className="roman-card beam-border h-100 p-3">
        <div className="d-flex align-items-start gap-3">
          <div className="p-2 rounded-circle bg-gold bg-opacity-10 text-gold fs-5 flex-shrink-0">
            <i className={`bi ${icon}`}></i>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <h3 className="h6 mb-1 font-display fw-bold">{title}</h3>
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold small ms-2"
                  title="View details"
                >
                  <i className="bi bi-box-arrow-up-right"></i>
                </a>
              )}
            </div>
            <p className="small text-gold fw-semibold mb-1">{award}</p>
            <p className="small text-muted font-mono mb-0" style={{ fontSize: '0.75rem' }}>{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillCategoryCard({ icon, title, children }) {
  return (
    <div className="col-12 col-md-6">
      <div className="roman-card beam-border h-100 p-4">
        <h3 className="h6 mb-3 font-display fw-bold d-flex align-items-center gap-2">
          <i className={`bi ${icon} text-gold`}></i>
          {title}
        </h3>
        <div className="d-flex flex-wrap gap-1">{children}</div>
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
    'publications',
    'competitions-activities',
    'skills',
    'languages',
  ];

  return (
    <div className="row g-4 page-transition">
      <aside className="col-12 col-lg-3">
        <Sidebar sectionIds={sectionIds} />
      </aside>

      <div className="col-12 col-lg-9">
        {/* CV Hero Section */}
        <section
          className="hero-section roman-card-elevated p-4 p-md-5 mb-5 position-relative overflow-hidden spotlight"
          id="main-content"
          data-animate
        >
          <div className="hero-ambient" aria-hidden="true" />
          
          <div className="d-flex flex-column gap-3 position-relative z-1">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <span className="roman-eyebrow">Academic Curriculum Vitae</span>
              <span className="roman-badge-gold font-mono" style={{ fontSize: '0.75rem' }}>
                Updated 2026
              </span>
            </div>

            <h1 className="font-display fw-bold mb-1 hero-title text-gradient-gold">
              Nguyễn Minh Trí
            </h1>

            <p className="lead text-secondary mb-2" style={{ fontSize: '1.1rem' }}>
              Undergraduate Research Assistant · AiTA Lab, FPT University Ho Chi Minh City
            </p>

            <div className="d-flex flex-wrap gap-2 mb-3" role="list">
              <span className="roman-badge-gold"><i className="bi bi-eye me-1"></i> Computer Vision</span>
              <span className="roman-badge-gold"><i className="bi bi-cpu me-1"></i> Vision-Language Models</span>
              <span className="roman-badge-gold"><i className="bi bi-lightning me-1"></i> Quantum ML</span>
            </div>

            {/* Action Bar */}
            <div className="d-flex flex-wrap gap-2 pt-2 border-top border-zinc">
              <a
                href={`${import.meta.env.BASE_URL}CV_NguyenMinhTri.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-roman btn-roman-primary btn-sm px-3 flex-grow-1 flex-sm-grow-0 justify-content-center"
              >
                <i className="bi bi-download me-1"></i> Download PDF CV
              </a>
              <button
                className="btn-roman btn-roman-secondary btn-sm px-3 flex-grow-1 flex-sm-grow-0 justify-content-center"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-1"></i> Print
              </button>
              <a
                className="btn-roman btn-roman-ghost btn-sm px-3 flex-grow-1 flex-sm-grow-0 justify-content-center"
                href="mailto:mihtriii295@gmail.com"
              >
                <i className="bi bi-envelope me-1"></i> Email
              </a>
              <button
                className="btn-roman btn-roman-ghost btn-sm px-3 flex-grow-1 flex-sm-grow-0 justify-content-center"
                onClick={() => {
                  navigator.clipboard.writeText('mihtriii295@gmail.com');
                  toast('Copied email to clipboard!');
                }}
              >
                <i className="bi bi-clipboard me-1"></i> Copy Email
              </button>
            </div>
          </div>
        </section>

        {/* SUMMARY SECTION */}
        <Section id="summary" title={CV_SECTIONS.summary}>
          <div className="roman-card beam-border p-4" data-animate>
            <p className="lead mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.75' }}>
              Undergraduate Research Assistant at <strong>AiTA Lab (FPT University)</strong> with strong focus on 
              <strong> Computer Vision</strong>, <strong>Vision-Language Models (VLMs)</strong>, and <strong>Quantum Machine Learning (QML)</strong>. 
              Dedicated to building reproducible, lightweight architectures and novel multimodal fusion frameworks.
            </p>
            <div className="row g-3">
              <StatCard
                icon="bi-bullseye"
                label="Primary Research Focus"
                value="Multimodal Retrieval, Visual Grounding, Parameterized Quantum Circuits for CV"
              />
              <StatCard
                icon="bi-trophy"
                label="Key Honors"
                value="Samsung SFT 3rd Prize, VOI Honorable Mention, 2 Conference Papers Accepted"
              />
            </div>
          </div>
        </Section>

        {/* CAREER OBJECTIVES */}
        <Section id="career-objectives" title={CV_SECTIONS['career-objectives']}>
          <div className="row g-3" data-animate>
            <div className="col-12 col-md-6">
              <div className="roman-card beam-border h-100 p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 bg-gold bg-opacity-10 rounded-circle text-gold fs-4">
                    <i className="bi bi-mortarboard-fill"></i>
                  </div>
                  <div>
                    <h3 className="h6 mb-2 fw-bold font-display">PhD in Artificial Intelligence</h3>
                    <p className="text-secondary small mb-0">
                      Pursuing doctoral research in advanced Computer Vision and Quantum Machine Learning for next-generation multimodal perception.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="roman-card beam-border h-100 p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 bg-gold bg-opacity-10 rounded-circle text-gold fs-4">
                    <i className="bi bi-cpu-fill"></i>
                  </div>
                  <div>
                    <h3 className="h6 mb-2 fw-bold font-display">Applied AI & Edge Specialist</h3>
                    <p className="text-secondary small mb-2">
                      Designing efficient, quantized vision models for edge devices, autonomous UAVs, and real-time inference systems.
                    </p>
                    <div className="d-flex flex-wrap gap-1">
                      <span className="roman-badge-gold">Edge AI</span>
                      <span className="roman-badge-gold">Quantization</span>
                      <span className="roman-badge-gold">PyTorch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <SectionDivider variant="dots" />

        {/* EDUCATION */}
        <Section id="education" title={CV_SECTIONS.education}>
          <div className="roman-card beam-border p-4" data-animate>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
              <div>
                <h3 className="h5 mb-1 fw-bold font-display">FPT University Ho Chi Minh City</h3>
                <p className="mb-1 text-gold fw-semibold">Bachelor of Science in Artificial Intelligence</p>
                <p className="text-secondary small mb-0">
                  <i className="bi bi-calendar3 me-1"></i> Sep 2024 – Expected 2028
                </p>
              </div>
              <span className="roman-badge-gold font-mono" style={{ fontSize: '0.78rem' }}>
                Undergraduate
              </span>
            </div>

            <div className="border-top border-zinc pt-3 mt-3">
              <h4 className="h6 fw-bold mb-3 font-display">
                <i className="bi bi-journal-code me-2 text-gold"></i>
                Key Academic Coursework
              </h4>
              <div className="row g-2">
                <CourseworkItem icon="bi-check-circle-fill" text="Data Structures & Algorithms" />
                <CourseworkItem icon="bi-check-circle-fill" text="Linear Algebra & Calculus" />
                <CourseworkItem icon="bi-check-circle-fill" text="Introduction to Machine Learning & Deep Learning" />
                <CourseworkItem icon="bi-check-circle-fill" text="Computer Vision Fundamentals" />
                <CourseworkItem icon="bi-check-circle-fill" text="Python Programming & Software Engineering" />
              </div>
            </div>
          </div>
        </Section>

        {/* EXPERIENCE */}
        <Section id="experience" title={CV_SECTIONS.experience}>
          <div className="roman-card beam-border p-4" data-animate>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
              <div>
                <h3 className="h6 fw-bold mb-1 font-display">Undergraduate Research Assistant</h3>
                <p className="text-gold small fw-semibold mb-0">AiTA Lab, FPT University HCMC</p>
              </div>
              <span className="roman-badge-gold font-mono" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-calendar3 me-1"></i> May 2025 – Present
              </span>
            </div>
            <ul className="small text-secondary mb-0 ps-3">
              <li className="mb-2">
                Conducting research on Computer Vision, Vision-Language Models (VLMs), and Quantum Machine Learning under laboratory supervision.
              </li>
              <li className="mb-2">
                Designing and implementing reproducible experimental pipelines for multimodal emotion recognition and hybrid quantum federated learning.
              </li>
              <li className="mb-2">
                Contributing to conference publications (MIWAI 2026, IEEE ICCE 2026) and technical documentation.
              </li>
              <li>
                Leading open-source experiments on lightweight edge inference architectures and visual grounding baselines.
              </li>
            </ul>
          </div>
        </Section>

        {/* PUBLICATIONS IN CV */}
        <Section id="publications" title={CV_SECTIONS.publications}>
          <div className="d-flex flex-column gap-3" data-animate>
            {/* Paper 1: MIWAI 2026 */}
            <div className="roman-card beam-border p-4">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="roman-badge-gold">Conference</span>
                <span className="roman-badge-status status-accepted">
                  <i className="bi bi-patch-check-fill me-1"></i> Accepted (2026)
                </span>
                <span className="text-muted small font-mono">MIWAI 2026 (LNAI, Springer)</span>
              </div>
              <h3 className="h6 font-display fw-bold mb-2 text-primary">
                SlimFusion: Lightweight Audio–Visual Emotion Recognition for Edge Inference
              </h3>
              <p className="small text-secondary mb-2">
                <strong>Minh Tri Nguyen</strong>, et al.
              </p>
              <p className="small text-muted mb-3">
                Proposes an ultra-lightweight multi-modal audio-visual fusion network tailored for low-power edge compute units.
              </p>
              <a
                href="https://miwai26.miwai.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-roman btn-roman-secondary btn-sm"
              >
                <i className="bi bi-globe me-1"></i> Conference Link
              </a>
            </div>

            {/* Paper 2: IEEE ICCE 2026 */}
            <div className="roman-card beam-border p-4">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="roman-badge-gold">Conference</span>
                <span className="roman-badge-status status-accepted">
                  <i className="bi bi-patch-check-fill me-1"></i> Accepted (2026)
                </span>
                <span className="text-muted small font-mono">IEEE ICCE 2026</span>
              </div>
              <h3 className="h6 font-display fw-bold mb-2 text-primary">
                Hybrid Quantum Federated Learning for Brain Tumor Magnetic Resonance Imaging Analysis
              </h3>
              <p className="small text-secondary mb-2">
                Quang Nhan Hoang, <strong>Minh Tri Nguyen</strong>, Duc Ngoc Minh Dang
              </p>
              <p className="small text-muted mb-3">
                Combines parameterized quantum neural circuits with federated privacy mechanisms for distributed medical MRI classification.
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

        {/* HONORS & AWARDS */}
        <Section id="competitions-activities" title={CV_SECTIONS['competitions-activities']}>
          <div className="row g-3" data-animate>
            <CompetitionCard
              icon="bi-trophy-fill"
              title="Samsung Solve for Tomorrow Vietnam"
              award="Third Prize (High School Category)"
              date="2024"
              link="https://solvefortomorrow.vn/doi-thang-giai/t-gardens"
            />
            <CompetitionCard
              icon="bi-award-fill"
              title="AIoT on Edge Hackathon"
              award="Promising Award"
              date="2025"
            />
            <CompetitionCard
              icon="bi-mortarboard-fill"
              title="Vietnam National Olympiad in Informatics (VOI)"
              award="National Honorable Mention"
              date="2024"
              link="https://voi.edu.vn/"
            />
            <CompetitionCard
              icon="bi-people-fill"
              title="FARPC Programming Club"
              award="Vice President (AI & Community)"
              date="2025 – Present"
              link="https://www.facebook.com/FARPC.HCM/"
            />
          </div>
        </Section>

        {/* SKILLS */}
        <Section id="skills" title={CV_SECTIONS.skills}>
          <div className="row g-3" data-animate>
            <SkillCategoryCard icon="bi-code-slash" title="Programming Languages">
              <span className="roman-badge-gold">Python</span>
              <span className="roman-badge-gold">C++</span>
              <span className="roman-badge-gold">JavaScript / TypeScript</span>
              <span className="roman-badge-gold">SQL</span>
              <span className="roman-badge-gold">Bash</span>
            </SkillCategoryCard>

            <SkillCategoryCard icon="bi-robot" title="AI & Deep Learning">
              <span className="roman-badge-gold">PyTorch</span>
              <span className="roman-badge-gold">OpenCV</span>
              <span className="roman-badge-gold">HuggingFace Transformers</span>
              <span className="roman-badge-gold">Qiskit</span>
              <span className="roman-badge-gold">PennyLane</span>
              <span className="roman-badge-gold">timm</span>
              <span className="roman-badge-gold">scikit-learn</span>
            </SkillCategoryCard>

            <SkillCategoryCard icon="bi-tools" title="Engineering & DevOps">
              <span className="roman-badge-gold">Git & GitHub</span>
              <span className="roman-badge-gold">Linux / Ubuntu</span>
              <span className="roman-badge-gold">CUDA</span>
              <span className="roman-badge-gold">Docker</span>
              <span className="roman-badge-gold">LaTeX / Overleaf</span>
              <span className="roman-badge-gold">VS Code</span>
            </SkillCategoryCard>

            <SkillCategoryCard icon="bi-graph-up" title="Experimentation & Viz">
              <span className="roman-badge-gold">Weights & Biases</span>
              <span className="roman-badge-gold">TensorBoard</span>
              <span className="roman-badge-gold">Matplotlib</span>
              <span className="roman-badge-gold">Seaborn</span>
              <span className="roman-badge-gold">Jupyter</span>
            </SkillCategoryCard>
          </div>
        </Section>

        {/* LANGUAGES */}
        <Section id="languages" title={CV_SECTIONS.languages}>
          <div className="roman-card beam-border p-4" data-animate>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-card border border-zinc">
                  <i className="bi bi-translate fs-4 text-gold"></i>
                  <div>
                    <h3 className="h6 mb-1 fw-bold font-display">Vietnamese</h3>
                    <p className="small text-secondary mb-0">Native Language</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-card border border-zinc">
                  <i className="bi bi-translate fs-4 text-gold"></i>
                  <div>
                    <h3 className="h6 mb-1 fw-bold font-display">English</h3>
                    <p className="small text-secondary mb-0">Professional Working Proficiency · Academic Writing</p>
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