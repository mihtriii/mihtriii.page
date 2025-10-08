import React from 'react';
import Sidebar from '../components/Sidebar.jsx';
import { toast } from '../components/Toast.jsx';

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
  const sectionIds = [
    'summary',
    'education',
    'experience',
    'research-interests',
    'competitions-activities',
    'skills',
    'projects-planned',
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
              <span className="gradient-text">Curriculum Vitae</span>
            </h1>
            <p className="text-secondary mb-2">Nguyễn Minh Trí · AI Student · FPTU HCM</p>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge badge-glow">Computer Vision</span>
              <span className="badge badge-glow">VLMs</span>
              <span className="badge badge-glow">Quantum ML</span>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-1">
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                <i className="bi bi-download"></i> Download / Print
              </button>
              <a className="btn btn-outline-secondary btn-sm" href="mailto:mihtriii295@gmail.com">
                <i className="bi bi-envelope"></i> Contact
              </a>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  navigator.clipboard.writeText('mihtriii295@gmail.com');
                  toast('Copied email');
                }}
              >
                <i className="bi bi-clipboard"></i> Copy email
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

        <Section id="summary" title="Summary">
          <div className="row g-3 row-cols-1 row-cols-md-2">
            <div className="col">
              <div className="card card-hover card-elevate h-100" data-animate>
                <div className="card-body">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-bullseye"></i>
                    <h3 className="h6 mb-0">Focus</h3>
                  </div>
                  <p className="text-secondary small mb-2">
                    Practical VLM applications and strong research habits: simple baselines,
                    reproducible demos, and clear writing.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-secondary">Retrieval</span>
                    <span className="badge text-bg-secondary">Grounding</span>
                    <span className="badge text-bg-secondary">Instruction Tuning</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card card-hover card-elevate h-100" data-animate>
                <div className="card-body">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-lightning-charge"></i>
                    <h3 className="h6 mb-0">Highlights</h3>
                  </div>
                  <ul className="small mb-0">
                    <li>Edge‑friendly CV and lightweight VLM experiments</li>
                    <li>Hands‑on mindset: build first, iterate quickly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="education" title="Education">
          <div className="timeline" data-animate>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="d-flex justify-content-between gap-3 align-items-baseline">
                  <div>
                    <strong>FPT University Ho Chi Minh City (FPTU HCM)</strong> — BSc in Artificial
                    Intelligence (K20)
                  </div>
                  <div className="text-secondary small">2024 – present</div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <div className="timeline" data-animate>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="d-flex justify-content-between gap-3 align-items-baseline">
                  <div>
                    <strong>AI Research Intern</strong> — AITA LAB, FPTU HCM
                  </div>
                  <div className="text-secondary small">2025 – present</div>
                </div>
                <ul className="mb-0">
                  <li>Early‑stage research exposure in Computer Vision and QML.</li>
                  <li>Literature review, prototyping, and small‑scale experiments.</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section id="research-interests" title="Research Interests">
          <ul className="mb-0">
            <li>Vision‑Language Models: retrieval, grounding, instruction tuning, evaluation.</li>
            <li>Applied VLMs: deployment on edge/cloud with performance trade‑offs.</li>
            <li>Quantum ML: hybrid classical‑quantum methods for vision tasks.</li>
          </ul>
        </Section>

        <Section id="competitions-activities" title="Cuộc thi & Hoạt động">
          <ul className="mb-0">
            <li>
              Samsung Solve for Tomorrow Việt Nam 2024 — Giải Ba (Bảng THPT), thành viên đội{' '}
              <strong>T‑Gardens</strong>.{' '}
              <a
                href="https://solvefortomorrow.vn/doi-thang-giai/t-gardens"
                target="_blank"
                rel="noopener"
              >
                Liên kết
              </a>
            </li>
            <li>AIoT on Edge Hackathon (2025) — Giải Triển Vọng.</li>
            <li>VOI 2024 — Giải Khuyến khích.</li>
            <li>Cộng đồng: GDG on Campus, các cộng đồng công nghệ sinh viên, seminar học thuật.</li>
          </ul>
        </Section>

        <Section id="skills" title="Skills">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <h3 className="h6">Programming</h3>
                  <SkillMeter label="Python" level={80} />
                  <SkillMeter label="C++" level={65} />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <h3 className="h6">ML/CV</h3>
                  <SkillMeter label="PyTorch" level={70} />
                  <SkillMeter label="OpenCV" level={65} />
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    <span className="badge text-bg-secondary">Transformers (learning)</span>
                    <span className="badge text-bg-secondary">timm (learning)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <h3 className="h6">Quantum</h3>
                  <SkillMeter label="Qiskit" level={55} />
                  <SkillMeter label="PennyLane" level={50} />
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    <span className="badge text-bg-secondary">Hybrid training</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card card-hover card-elevate h-100">
                <div className="card-body">
                  <h3 className="h6">Tooling</h3>
                  <SkillMeter label="Git/GitHub" level={70} />
                  <SkillMeter label="Linux CLI" level={65} />
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    <span className="badge text-bg-secondary">LaTeX/Overleaf</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="projects-planned" title="Projects (Planned)">
          <ul className="mb-0">
            <li>Mini‑VLM Playground — small‑scale retrieval/grounding demos with benchmarks.</li>
            <li>QML for Vision — hybrid quantum‑classical baselines on MNIST/CIFAR.</li>
            <li>Edge‑friendly CV — distilled/quantized models for edge inference.</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
